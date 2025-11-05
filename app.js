/* global window, document, supabase */
(() => {
  const cfg = window.APP_CONFIG || {};
  let client = null;
  if (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
    client = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  }

  const el = (id) => document.getElementById(id);
  const cardsEl = el('cards');
  const emptyEl = el('empty');
  const loginForm = el('login-form');
  const logoutBtn = el('logout-btn');
  const authInfo = el('auth-info');
  const demoBtn = el('demo-btn');

  const modal = el('override-modal');
  const strategySelect = el('strategy-select');
  const saveOverrideBtn = el('save-override');
  const ovStudentName = el('ov-student-name');

  let strategies = [];
  let user = null;
  let currentOverride = null; // {student}

  function riskBadge(level){
    const cls = level.toLowerCase();
    return `<span class="badge ${cls}">${level.toUpperCase()}</span>`;
  }

  function renderCards(students){
    cardsEl.innerHTML = '';
    if (!students || students.length === 0){
      emptyEl.classList.remove('hidden');
      return;
    }
    emptyEl.classList.add('hidden');

    students.forEach((s) => {
      const reasons = (s.risk_factors || []).join(', ') || '—';
      const suggested = s.intervention_suggestion || s.recommended_activity || 'Reminder (Free)';
      const nextActivity = s.last_activity || '—';

      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="row">
          <div>
            <h3>${s.name}</h3>
            <div class="muted">Grade ${s.grade} • Risk: ${s.risk_score}</div>
          </div>
          ${riskBadge(s.risk_level || 'low')}
        </div>
        <div>
          <div class="subtitle">Top Reasons</div>
          <div>${reasons}</div>
        </div>
        <div>
          <div class="subtitle">Next Activity</div>
          <div>${nextActivity}</div>
        </div>
        <div>
          <div class="subtitle">Suggested</div>
          <div>${suggested}</div>
        </div>
        <div class="actions">
          <a class="button" href="#" data-open="${s.id}">Open</a>
          <button data-override="${s.id}">Override</button>
        </div>
      `;
      cardsEl.appendChild(card);
    });

    // Wire up buttons
    cardsEl.querySelectorAll('button[data-override]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-override');
        const student = students.find(st => String(st.id) === String(id));
        currentOverride = student;
        ovStudentName.textContent = student.name;
        await loadStrategies();
        strategySelect.innerHTML = strategies.map(st => (
          `<option value="${st.name}">${st.name} (${st.cost_level})</option>`
        )).join('');
        modal.showModal();
      });
    });
  }

  async function loadStrategies(){
    if (strategies.length) return strategies;
    if (!client){
      // demo strategies
      strategies = [
        {name:'Reminder (Free)', cost_level:'free'},
        {name:'SMS (Low)', cost_level:'low'},
        {name:'Email to Parent', cost_level:'low'},
        {name:'Mentor Call', cost_level:'medium'},
        {name:'Personalized Content', cost_level:'medium'}
      ];
      return strategies;
    }
    const { data, error } = await client.from('intervention_strategies').select('*').eq('is_active', true);
    if (error){ console.warn(error); }
    strategies = data || [];
    return strategies;
  }

  async function loadStudents(){
    if (!client){
      // Demo mode: mock data similar to screenshot
      const demo = [
        { id:'1', name:'Aarav Kumar', grade:'6', risk_level:'low', risk_score:34, risk_factors:['Low Weekly Logins','Missed Assignments','Inactivity (days)'], last_activity:'Geometry — Practice Set (20m)', intervention_suggestion:'Reminder (Free)'},
        { id:'2', name:'Zoya Khan', grade:'7', risk_level:'low', risk_score:17, risk_factors:['Low Weekly Logins','Missed Assignments','Inactivity (days)'], last_activity:'Decimals — Practice Set (20m)', intervention_suggestion:'Reminder (Free)'},
        { id:'3', name:'Ishaan Patel', grade:'8', risk_level:'medium', risk_score:48, risk_factors:['Inactivity (days)','Low Weekly Logins','Missed Assignments'], last_activity:'Algebra Basics — Practice Set (20m)', intervention_suggestion:'SMS (Low)'},
        { id:'4', name:'Meera Singh', grade:'6', risk_level:'medium', risk_score:42, risk_factors:['Low Weekly Logins','Inactivity (days)','Missed Assignments'], last_activity:'Decimals — Practice Set (20m)', intervention_suggestion:'Reminder (Free)'},
        { id:'5', name:'Aditya Verma', grade:'7', risk_level:'low', risk_score:8, risk_factors:['Low Weekly Logins','Missed Assignments','Inactivity (days)'], last_activity:'Algebra Basics — Practice Set (20m)', intervention_suggestion:'Reminder (Free)'},
        { id:'6', name:'Riya Sharma', grade:'8', risk_level:'medium', risk_score:48, risk_factors:['Inactivity (days)','Low Weekly Logins','Missed Assignments'], last_activity:'Algebra Basics — Practice Set (20m)', intervention_suggestion:'SMS (Low)'}
      ];
      renderCards(demo);
      return;
    }
    let query = client.from('students').select('*').order('risk_score', {ascending: false});
    // optional filter by teacher via email -> join not possible here; keep simple demo
    const { data, error } = await query;
    if (error){ console.error(error); renderCards([]); return; }
    renderCards(data);
  }

  // Save override (updates student's intervention_suggestion)
  saveOverrideBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const value = strategySelect.value;
    const note = document.getElementById('override-note').value;
    if (!currentOverride){ modal.close(); return; }

    if (!client){
      // demo: just update in UI
      currentOverride.intervention_suggestion = `${value}${note ? ' — ' + note : ''}`;
      const items = Array.from(cardsEl.querySelectorAll('article.card'));
      // re-render instead of diffing
      loadStudents();
      modal.close();
      return;
    }
    const { error } = await client.from('students')
      .update({ intervention_suggestion: value })
      .eq('id', currentOverride.id)
      .select('id');
    if (error){ alert('Failed to save: ' + error.message); return; }
    // Optionally insert into notification_logs or audit table
    modal.close();
    await loadStudents();
  });

  // Auth
  async function refreshAuthUI(){
    const u = user;
    if (u){
      authInfo.textContent = u.email;
      loginForm.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
    } else {
      authInfo.textContent = '';
      loginForm.classList.remove('hidden');
      logoutBtn.classList.add('hidden');
    }
  }

  if (client){
    client.auth.onAuthStateChange((event, session) => {
      user = session?.user || null;
      refreshAuthUI();
      loadStudents();
    });
  }

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!client){ alert('Add Supabase credentials in config.js to enable auth.'); return; }
    const email = document.getElementById('email').value;
    const { error } = await client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    if (error) alert(error.message);
    else alert('Magic link sent! Check your email.');
  });

  logoutBtn?.addEventListener('click', async () => {
    if (!client) return;
    await client.auth.signOut();
  });

  demoBtn.addEventListener('click', () => {
    client = null;
    user = null;
    refreshAuthUI();
    loadStudents();
  });

  // Initial
  refreshAuthUI();
  loadStudents();
})();