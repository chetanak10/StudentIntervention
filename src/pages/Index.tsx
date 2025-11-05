import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BarChart3, Users, Lightbulb, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-lg mb-4">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Student Success Intervention System
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering educators to predict and prevent student dropout in underserved communities through intelligent intervention strategies
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Early Risk Detection</h3>
            <p className="text-muted-foreground">
              AI-powered prediction model identifies at-risk students early with clear, actionable insights
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Interventions</h3>
            <p className="text-muted-foreground">
              Adaptive strategies recommend the most effective, low-cost interventions for each student
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Teacher Dashboard</h3>
            <p className="text-muted-foreground">
              Intuitive interface designed for educators with minimal training required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
