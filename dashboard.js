const storageKeys = {
  projects: 'alaa_dashboard_projects_v1',
  skills: 'alaa_dashboard_skills_v1',
  messages: 'alaa_dashboard_messages_v1',
  activity: 'alaa_dashboard_activity_v1',
  resume: 'alaa_dashboard_resume_v1'
};

const defaults = {
  projects: [
    { id: crypto.randomUUID(), title: 'Smart Garden Game', category: 'Full Stack', description: 'Java AI game with plant prediction, route optimization, and interactive UI.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&h=460&fit=crop', github: '#', demo: '#' },
    { id: crypto.randomUUID(), title: 'Personal Portfolio', category: 'Frontend', description: 'Animated responsive portfolio with a creative purple identity and star hero section.', image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&h=460&fit=crop', github: '#', demo: '#' },
    { id: crypto.randomUUID(), title: 'Mobile App Concept', category: 'UI/UX', description: 'Figma app concept focused on clean flows, accessibility, and modern visual hierarchy.', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=700&h=460&fit=crop', github: '#', demo: '#' }
  ],
  skills: [
    { id: crypto.randomUUID(), name: 'HTML / CSS', category: 'Frontend', level: 92, featured: true },
    { id: crypto.randomUUID(), name: 'JavaScript', category: 'Frontend', level: 84, featured: true },
    { id: crypto.randomUUID(), name: 'Java', category: 'Language', level: 86, featured: false },
    { id: crypto.randomUUID(), name: 'Figma', category: 'Design', level: 88, featured: true },
    { id: crypto.randomUUID(), name: 'UI/UX Design', category: 'Design', level: 90, featured: true },
    { id: crypto.randomUUID(), name: 'Problem Solving', category: 'Soft Skill', level: 91, featured: false }
  ],
  messages: [
    { id: crypto.randomUUID(), name: 'Sara Ahmad', email: 'sara@example.com', subject: 'Portfolio project request', message: 'Hi Alaa, I loved your portfolio style. Can we discuss a landing page design for my project?', unread: true, time: 'Today' },
    { id: crypto.randomUUID(), name: 'Omar Khaled', email: 'omar@example.com', subject: 'UI/UX collaboration', message: 'Your UI work looks clean. I want to ask about a mobile app prototype.', unread: true, time: 'Yesterday' },
    { id: crypto.randomUUID(), name: 'Training Team', email: 'hr@example.com', subject: 'Internship opportunity', message: 'We reviewed your profile and would like to invite you to apply for our frontend internship.', unread: false, time: '2 days ago' }
  ],
  activity: [
    { text: 'Dashboard generated from Figma design', sub: 'Admin panel ready', time: 'Now' },
    { text: 'Project section updated', sub: 'Smart Garden Game added', time: 'Today' },
    { text: 'Resume module prepared', sub: 'PDF upload UI enabled', time: 'Today' }
  ]
};

const state = {
  projects: load('projects'),
  skills: load('skills'),
  messages: load('messages'),
  activity: load('activity'),
  projectFilter: 'All',
  skillFilter: 'All',
  activeMessageId: null
};

function load(key) {
  const saved = localStorage.getItem(storageKeys[key]);
  if (!saved) return structuredClone(defaults[key]);
  try { return JSON.parse(saved); } catch { return structuredClone(defaults[key]); }
}
function save(key) { localStorage.setItem(storageKeys[key], JSON.stringify(state[key])); }
function addActivity(text, sub = 'Portfolio CMS') {
  state.activity.unshift({ text, sub, time: 'Just now' });
  state.activity = state.activity.slice(0, 8);
  save('activity');
  renderActivity();
}
function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

const pages = {
  dashboard: document.getElementById('dashboardPage'),
  projects: document.getElementById('projectsPage'),
  skills: document.getElementById('skillsPage'),
  messages: document.getElementById('messagesPage'),
  resume: document.getElementById('resumePage'),
  settings: document.getElementById('settingsPage')
};

document.querySelectorAll('.nav-link').forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.page));
});
document.querySelectorAll('[data-page-target]').forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.pageTarget));
});
function showPage(page) {
  Object.values(pages).forEach(p => p.classList.remove('active'));
  pages[page].classList.add('active');
  document.querySelectorAll('.nav-link').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  document.getElementById('sidebar').classList.remove('open');
}

document.getElementById('menuToggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

document.getElementById('globalSearch').addEventListener('input', (event) => {
  const q = event.target.value.trim().toLowerCase();
  document.querySelectorAll('.project-card, .skill-card, .message-item').forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});

function updateStats() {
  document.getElementById('statProjects').textContent = state.projects.length;
  document.getElementById('statSkills').textContent = state.skills.length;
  document.getElementById('statMessages').textContent = state.messages.length;
  const unread = state.messages.filter(m => m.unread).length;
  document.getElementById('unreadText').textContent = `${unread} unread messages`;
}
function renderActivity() {
  const box = document.getElementById('activityList');
  box.innerHTML = state.activity.map(item => `
    <div class="activity-item">
      <span class="activity-dot"></span>
      <div><strong>${escapeHTML(item.text)}</strong><p>${escapeHTML(item.sub)}</p></div>
      <span class="activity-time">${escapeHTML(item.time)}</span>
    </div>`).join('');
}

function renderProjectFilters() {
  const categories = ['All', ...new Set(state.projects.map(p => p.category))];
  document.getElementById('projectFilters').innerHTML = categories.map(cat => `<button class="filter-chip ${cat === state.projectFilter ? 'active' : ''}" data-filter="${cat}">${cat}</button>`).join('');
  document.querySelectorAll('#projectFilters .filter-chip').forEach(btn => btn.addEventListener('click', () => { state.projectFilter = btn.dataset.filter; renderProjects(); }));
}
function renderProjects() {
  renderProjectFilters();
  const projects = state.projectFilter === 'All' ? state.projects : state.projects.filter(p => p.category === state.projectFilter);
  document.getElementById('projectsGrid').innerHTML = projects.map(p => `
    <article class="project-card">
      <div class="project-image">
        <img src="${escapeAttr(p.image || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=700&h=460&fit=crop')}" alt="${escapeAttr(p.title)}" onerror="this.style.display='none'">
        <span class="category-badge">${escapeHTML(p.category)}</span>
      </div>
      <div class="project-body">
        <h3>${escapeHTML(p.title)}</h3>
        <p>${escapeHTML(p.description)}</p>
        <div class="card-actions">
          <button class="mini-btn" data-edit-project="${p.id}">Edit</button>
          <button class="mini-btn danger" data-delete-project="${p.id}">Delete</button>
          <button class="mini-btn" onclick="window.open('${escapeAttr(p.demo || '#')}', '_blank')">View</button>
        </div>
        <div class="links-row"><a href="${escapeAttr(p.github || '#')}" target="_blank">GitHub</a><a href="${escapeAttr(p.demo || '#')}" target="_blank">Live Demo</a></div>
      </div>
    </article>`).join('');
  document.querySelectorAll('[data-edit-project]').forEach(btn => btn.addEventListener('click', () => openProjectModal(btn.dataset.editProject)));
  document.querySelectorAll('[data-delete-project]').forEach(btn => btn.addEventListener('click', () => deleteProject(btn.dataset.deleteProject)));
  updateStats();
}
function openProjectModal(id = null) {
  const form = document.getElementById('projectForm');
  form.reset();
  document.getElementById('projectModalTitle').textContent = id ? 'Edit Project' : 'Add Project';
  if (id) {
    const p = state.projects.find(item => item.id === id);
    form.id.value = p.id; form.title.value = p.title; form.description.value = p.description; form.category.value = p.category; form.image.value = p.image; form.github.value = p.github; form.demo.value = p.demo;
  }
  openModal('projectModal');
}
function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  state.projects = state.projects.filter(p => p.id !== id);
  save('projects'); renderProjects(); updateStats(); addActivity('Project deleted', 'Projects management'); toast('Project deleted');
}

document.querySelectorAll('[data-open-project-modal]').forEach(btn => btn.addEventListener('click', () => openProjectModal()));
document.getElementById('projectForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const project = { id: form.id.value || crypto.randomUUID(), title: form.title.value, description: form.description.value, category: form.category.value, image: form.image.value, github: form.github.value, demo: form.demo.value };
  const index = state.projects.findIndex(p => p.id === project.id);
  if (index >= 0) state.projects[index] = project; else state.projects.unshift(project);
  save('projects'); renderProjects(); updateStats(); closeModals(); addActivity(index >= 0 ? 'Project updated' : 'New project added', project.title); toast('Project saved');
});

function renderSkillFilters() {
  const categories = ['All', ...new Set(state.skills.map(s => s.category))];
  document.getElementById('skillFilters').innerHTML = categories.map(cat => `<button class="filter-chip ${cat === state.skillFilter ? 'active' : ''}" data-filter="${cat}">${cat}</button>`).join('');
  document.querySelectorAll('#skillFilters .filter-chip').forEach(btn => btn.addEventListener('click', () => { state.skillFilter = btn.dataset.filter; renderSkills(); }));
}
function renderSkills() {
  renderSkillFilters();
  const skills = state.skillFilter === 'All' ? state.skills : state.skills.filter(s => s.category === state.skillFilter);
  document.getElementById('skillsGrid').innerHTML = skills.map(s => `
    <article class="skill-card">
      ${s.featured ? '<span class="featured-star">★</span>' : ''}
      <h3>${escapeHTML(s.name)}</h3>
      <p class="skill-meta">${escapeHTML(s.category)}</p>
      <div class="progress-head"><span>Proficiency</span><strong>${Number(s.level)}%</strong></div>
      <div class="progress"><span style="width:${Number(s.level)}%"></span></div>
      <div class="card-actions skill-actions"><button class="mini-btn" data-edit-skill="${s.id}">Edit</button><button class="mini-btn danger" data-delete-skill="${s.id}">Delete</button></div>
    </article>`).join('');
  document.querySelectorAll('[data-edit-skill]').forEach(btn => btn.addEventListener('click', () => openSkillModal(btn.dataset.editSkill)));
  document.querySelectorAll('[data-delete-skill]').forEach(btn => btn.addEventListener('click', () => deleteSkill(btn.dataset.deleteSkill)));
  updateStats();
}
function openSkillModal(id = null) {
  const form = document.getElementById('skillForm');
  form.reset();
  document.getElementById('skillModalTitle').textContent = id ? 'Edit Skill' : 'Add Skill';
  if (id) {
    const s = state.skills.find(item => item.id === id);
    form.id.value = s.id; form.name.value = s.name; form.category.value = s.category; form.level.value = s.level; form.featured.checked = !!s.featured;
  }
  openModal('skillModal');
}
function deleteSkill(id) {
  if (!confirm('Delete this skill?')) return;
  state.skills = state.skills.filter(s => s.id !== id);
  save('skills'); renderSkills(); updateStats(); addActivity('Skill deleted', 'Skills management'); toast('Skill deleted');
}
document.querySelectorAll('[data-open-skill-modal]').forEach(btn => btn.addEventListener('click', () => openSkillModal()));
document.getElementById('skillForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const skill = { id: form.id.value || crypto.randomUUID(), name: form.name.value, category: form.category.value, level: Math.max(0, Math.min(100, Number(form.level.value))), featured: form.featured.checked };
  const index = state.skills.findIndex(s => s.id === skill.id);
  if (index >= 0) state.skills[index] = skill; else state.skills.unshift(skill);
  save('skills'); renderSkills(); updateStats(); closeModals(); addActivity(index >= 0 ? 'Skill updated' : 'New skill added', skill.name); toast('Skill saved');
});

function renderMessages() {
  document.getElementById('messageList').innerHTML = state.messages.map(m => `
    <button class="message-item ${state.activeMessageId === m.id ? 'active' : ''}" data-message-id="${m.id}">
      <div class="message-top"><strong>${escapeHTML(m.name)}</strong>${m.unread ? '<span class="unread-pill">NEW</span>' : ''}</div>
      <p>${escapeHTML(m.subject)}</p><small>${escapeHTML(m.time)} · ${escapeHTML(m.email)}</small>
    </button>`).join('');
  document.querySelectorAll('[data-message-id]').forEach(btn => btn.addEventListener('click', () => previewMessage(btn.dataset.messageId)));
  updateStats();
}
function previewMessage(id) {
  state.activeMessageId = id;
  const m = state.messages.find(msg => msg.id === id);
  m.unread = false;
  save('messages');
  document.getElementById('messagePreview').innerHTML = `<h2>${escapeHTML(m.subject)}</h2><p>${escapeHTML(m.name)} · ${escapeHTML(m.email)}</p><div class="preview-body">${escapeHTML(m.message)}</div><button class="primary-btn" onclick="location.href='mailto:${escapeAttr(m.email)}'">Reply by Email</button>`;
  renderMessages();
}
document.getElementById('markAllRead').addEventListener('click', () => { state.messages.forEach(m => m.unread = false); save('messages'); renderMessages(); toast('All messages marked as read'); });

document.getElementById('resumeUpload').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const resume = { name: file.name, date: new Date().toLocaleString() };
  localStorage.setItem(storageKeys.resume, JSON.stringify(resume));
  renderResume(); addActivity('Resume uploaded', file.name); toast('Resume updated');
});
function renderResume() {
  const saved = JSON.parse(localStorage.getItem(storageKeys.resume) || 'null');
  if (!saved) return;
  document.getElementById('resumeName').textContent = saved.name;
  document.getElementById('resumeMeta').textContent = `Last updated: ${saved.date} · Ready for portfolio link`;
}
document.getElementById('downloadResume').addEventListener('click', () => toast('For real download, place resume.pdf in your project folder.'));

document.getElementById('settingsForm').addEventListener('submit', (event) => { event.preventDefault(); addActivity('Settings updated', 'Profile information saved'); toast('Settings saved'); });

function openModal(id) { document.getElementById(id).classList.add('show'); document.getElementById(id).setAttribute('aria-hidden', 'false'); }
function closeModals() { document.querySelectorAll('.modal').forEach(m => { m.classList.remove('show'); m.setAttribute('aria-hidden', 'true'); }); }
document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModals));
document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', e => { if (e.target === modal) closeModals(); }));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });

function escapeHTML(value = '') { return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
function escapeAttr(value = '') { return escapeHTML(value); }

renderProjects();
renderSkills();
renderMessages();
renderActivity();
renderResume();
updateStats();
// ===== Admin visibility control =====
const ADMIN_EMAIL = "aalaH.sunono@gmail.com"; // <-- غيريها لإيميلك

const adminNavItem = document.getElementById("adminNavItem");

function updateAdminUI() {
    const email = localStorage.getItem("adminEmail");
    if (adminNavItem && email === ADMIN_EMAIL) {
        adminNavItem.style.display = "block";
    } else if (adminNavItem) {
        adminNavItem.style.display = "none";
    }
}

function loginAdminPrompt() {
    const email = prompt("Enter admin email");
    if (!email) return;

    if (email === ADMIN_EMAIL) {
        localStorage.setItem("adminEmail", email);
        updateAdminUI();
        alert("Logged in as admin");
    } else {
        alert("Not admin");
    }
}

function logoutAdmin() {
    localStorage.removeItem("adminEmail");
    updateAdminUI();
}

updateAdminUI();