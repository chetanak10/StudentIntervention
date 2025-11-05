-- Database schema for Student Intervention (Supabase/Postgres)
-- NOTE: Requires extensions: pgcrypto (for gen_random_uuid) and auth schema (Supabase).
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  school_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  school_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  students_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own record"
  ON public.teachers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all teachers"
  ON public.teachers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  grade TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  attendance NUMERIC(5,2) NOT NULL CHECK (attendance >= 0 AND attendance <= 100),
  assignment_completion NUMERIC(5,2) NOT NULL CHECK (assignment_completion >= 0 AND assignment_completion <= 100),
  last_activity TEXT NOT NULL,
  risk_factors TEXT[] DEFAULT '{}',
  recommended_activity TEXT,
  intervention_suggestion TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own students"
  ON public.students FOR SELECT
  USING (teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can manage own students"
  ON public.students FOR ALL
  USING (teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all students"
  ON public.students FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.intervention_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cost_level TEXT NOT NULL CHECK (cost_level IN ('free', 'low', 'medium', 'high')),
  effectiveness_score NUMERIC(3,2) CHECK (effectiveness_score >= 0 AND effectiveness_score <= 1),
  recommended_for_risk TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.intervention_strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active strategies"
  ON public.intervention_strategies FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage strategies"
  ON public.intervention_strategies FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.intervention_strategies (name, description, cost_level, effectiveness_score, recommended_for_risk) VALUES
  ('Reminder (Free)', 'Automated in-app reminder notification', 'free', 0.65, ARRAY['low', 'medium']),
  ('SMS (Low)', 'SMS text message to student', 'low', 0.75, ARRAY['medium', 'high']),
  ('Email to Parent', 'Email notification to parent', 'low', 0.70, ARRAY['medium', 'high']),
  ('Mentor Call', 'Personal call from mentor or teacher', 'medium', 0.85, ARRAY['high']),
  ('Personalized Content', 'Customized learning materials', 'medium', 0.80, ARRAY['medium', 'high']);

CREATE TABLE public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('sms', 'email', 'reminder')),
  recipient TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own notification logs"
  ON public.notification_logs FOR SELECT
  USING (teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all notification logs"
  ON public.notification_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.system_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(metric_name, metric_date)
);

ALTER TABLE public.system_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view analytics"
  ON public.system_analytics FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert analytics"
  ON public.system_analytics FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.intervention_strategies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
