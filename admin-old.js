// Admin Panel JavaScript
// Default password: admin123 (change this in production)

const ADMIN_PASSWORD = 'admin123'; // Change this to your secure password
const STORAGE_KEY = 'portfolio_admin_data';

// Check if user is logged in
function checkAuth() {
  const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  if (isAuthenticated) {
    showAdminPanel();
  } else {
    showLoginScreen();
  }
}

// Show login screen
function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
}

// Show admin panel
function showAdminPanel() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  loadAllData();
}

// Login handler
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const password = document.getElementById('adminPassword').value;
  const errorDiv = document.getElementById('loginError');
  
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('admin_authenticated', 'true');
    showAdminPanel();
    errorDiv.style.display = 'none';
  } else {
    errorDiv.textContent = 'Invalid password. Please try again.';
    errorDiv.style.display = 'block';
  }
});

// Logout handler
function logout() {
  localStorage.removeItem('admin_authenticated');
  showLoginScreen();
  document.getElementById('adminPassword').value = '';
}

// Tab switching
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    // Update active tab
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update active content
    document.querySelectorAll('.admin-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
  });
});

// Load all data
function loadAllData() {
  loadHero();
  loadAbout();
  loadProjects();
  loadCertificates();
  loadContact();
}

// ========== HERO SECTION ==========
function loadHero() {
  const data = getStoredData();
  if (data.hero) {
    document.getElementById('heroName').value = data.hero.name || '';
    document.getElementById('heroRole').value = data.hero.role || '';
    document.getElementById('heroDescription').value = data.hero.description || '';
    if (data.hero.avatar) {
      document.getElementById('heroAvatarPreview').src = data.hero.avatar;
      document.getElementById('heroAvatarPreview').style.display = 'block';
    }
  }
}

function saveHero() {
  const name = document.getElementById('heroName').value;
  const role = document.getElementById('heroRole').value;
  const description = document.getElementById('heroDescription').value;
  
  const avatarFile = document.getElementById('heroAvatar').files[0];
  let avatarUrl = '';
  
  if (avatarFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl = e.target.result;
      saveHeroData(name, role, description, avatarUrl);
    };
    reader.readAsDataURL(avatarFile);
  } else {
    const data = getStoredData();
    avatarUrl = data.hero?.avatar || '';
    saveHeroData(name, role, description, avatarUrl);
  }
}

function saveHeroData(name, role, description, avatar) {
  const data = getStoredData();
  data.hero = { name, role, description, avatar };
  saveStoredData(data);
  
  // Update main site
  updateMainSite('hero', data.hero);
  
  showSuccess('heroSuccess', 'Hero section saved successfully!');
}

// ========== ABOUT SECTION ==========
function loadAbout() {
  const data = getStoredData();
  if (data.about) {
    document.getElementById('aboutText').value = data.about.text || '';
    document.getElementById('startYear').value = data.about.startYear || '';
    document.getElementById('cofounderYear').value = data.about.cofounderYear || '';
    document.getElementById('cofounderName').value = data.about.cofounderName || '';
  }
}

function saveAbout() {
  const data = getStoredData();
  data.about = {
    text: document.getElementById('aboutText').value,
    startYear: document.getElementById('startYear').value,
    cofounderYear: document.getElementById('cofounderYear').value,
    cofounderName: document.getElementById('cofounderName').value
  };
  saveStoredData(data);
  updateMainSite('about', data.about);
  showSuccess('aboutSuccess', 'About section saved successfully!');
}

// ========== PROJECTS SECTION ==========
function loadProjects() {
  // Try to load from projects-data.js first
  if (typeof projectsData !== 'undefined') {
    // Combine all project types
    const allProjects = [
      ...(projectsData.showcase || []),
      ...(projectsData.collections?.flatMap(c => c.subcategories?.flatMap(sc => sc.projects || []) || []) || []),
      ...(projectsData.gallery || [])
    ];
    renderProjects(allProjects);
  } else {
    const data = getStoredData();
    if (data.projects) {
      renderProjects(data.projects);
    } else {
      renderProjects([]);
    }
  }
}

function renderProjects(projects) {
  const container = document.getElementById('projectsList');
  container.innerHTML = '';
  
  projects.forEach((project, index) => {
    const item = document.createElement('div');
    item.className = 'project-item';
    item.innerHTML = `
      <div class="item-header">
        <h4>${project.title || 'Untitled Project'}</h4>
        <button class="delete-btn" onclick="deleteProject(${index})">Delete</button>
      </div>
      <div class="form-group">
        <label>Title</label>
        <input type="text" value="${project.title || ''}" onchange="updateProject(${index}, 'title', this.value)" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea rows="3" onchange="updateProject(${index}, 'description', this.value)" style="width: 100%; padding: 12px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(94, 240, 255, 0.2); border-radius: 8px; color: #e0e7ff; font-family: inherit;">${project.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Image URL</label>
        <input type="url" value="${project.image || ''}" onchange="updateProject(${index}, 'image', this.value)" />
      </div>
      <div class="form-group">
        <label>GitHub URL</label>
        <input type="url" value="${project.github || ''}" onchange="updateProject(${index}, 'github', this.value)" />
      </div>
      <div class="form-group">
        <label>Live URL</label>
        <input type="url" value="${project.live || ''}" onchange="updateProject(${index}, 'live', this.value)" />
      </div>
    `;
    container.appendChild(item);
  });
}

function updateProject(index, field, value) {
  const data = getStoredData();
  if (!data.projects) data.projects = [];
  if (!data.projects[index]) data.projects[index] = {};
  data.projects[index][field] = value;
  saveStoredData(data);
  updateMainSite('projects', data.projects);
}

function deleteProject(index) {
  if (confirm('Are you sure you want to delete this project?')) {
    const data = getStoredData();
    if (data.projects) {
      data.projects.splice(index, 1);
      saveStoredData(data);
      loadProjects();
      updateMainSite('projects', data.projects);
    }
  }
}

function addProject() {
  const data = getStoredData();
  if (!data.projects) data.projects = [];
  data.projects.push({
    title: 'New Project',
    description: '',
    image: '',
    github: '',
    live: ''
  });
  saveStoredData(data);
  loadProjects();
  showSuccess('projectsSuccess', 'New project added!');
}

// ========== CERTIFICATES SECTION ==========
function loadCertificates() {
  // Try to load from certificates-data.js first
  if (typeof certificatesData !== 'undefined') {
    renderCertificates(certificatesData.gallery || []);
  } else {
    const data = getStoredData();
    if (data.certificates) {
      renderCertificates(data.certificates);
    } else {
      renderCertificates([]);
    }
  }
}

function renderCertificates(certificates) {
  const container = document.getElementById('certificatesList');
  container.innerHTML = '';
  
  certificates.forEach((cert, index) => {
    const item = document.createElement('div');
    item.className = 'certificate-item';
    item.innerHTML = `
      <div class="item-header">
        <h4>${cert.title || 'Untitled Certificate'}</h4>
        <button class="delete-btn" onclick="deleteCertificate(${index})">Delete</button>
      </div>
      <div class="form-group">
        <label>Title</label>
        <input type="text" value="${cert.title || ''}" onchange="updateCertificate(${index}, 'title', this.value)" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea rows="3" onchange="updateCertificate(${index}, 'description', this.value)" style="width: 100%; padding: 12px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(94, 240, 255, 0.2); border-radius: 8px; color: #e0e7ff; font-family: inherit;">${cert.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Image URL</label>
        <input type="url" value="${cert.image || ''}" onchange="updateCertificate(${index}, 'image', this.value)" />
      </div>
      <div class="form-group">
        <label>Category</label>
        <select onchange="updateCertificate(${index}, 'category', this.value)" style="width: 100%; padding: 12px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(94, 240, 255, 0.2); border-radius: 8px; color: #e0e7ff; font-family: inherit;">
          <option value="all" ${cert.category === 'all' ? 'selected' : ''}>All</option>
          <option value="cloud" ${cert.category === 'cloud' ? 'selected' : ''}>Cloud</option>
          <option value="ai-ml" ${cert.category === 'ai-ml' ? 'selected' : ''}>AI & ML</option>
          <option value="programming" ${cert.category === 'programming' ? 'selected' : ''}>Programming</option>
          <option value="web-development" ${cert.category === 'web-development' ? 'selected' : ''}>Web Dev</option>
          <option value="devops" ${cert.category === 'devops' ? 'selected' : ''}>DevOps</option>
          <option value="mobile" ${cert.category === 'mobile' ? 'selected' : ''}>Mobile</option>
        </select>
      </div>
    `;
    container.appendChild(item);
  });
}

function updateCertificate(index, field, value) {
  const data = getStoredData();
  if (!data.certificates) data.certificates = [];
  if (!data.certificates[index]) data.certificates[index] = {};
  data.certificates[index][field] = value;
  saveStoredData(data);
  updateMainSite('certificates', data.certificates);
}

function deleteCertificate(index) {
  if (confirm('Are you sure you want to delete this certificate?')) {
    const data = getStoredData();
    if (data.certificates) {
      data.certificates.splice(index, 1);
      saveStoredData(data);
      loadCertificates();
      updateMainSite('certificates', data.certificates);
    }
  }
}

function addCertificate() {
  const data = getStoredData();
  if (!data.certificates) data.certificates = [];
  data.certificates.push({
    title: 'New Certificate',
    description: '',
    image: '',
    category: 'all'
  });
  saveStoredData(data);
  loadCertificates();
  showSuccess('certificatesSuccess', 'New certificate added!');
}

// ========== CONTACT SECTION ==========
function loadContact() {
  const data = getStoredData();
  if (data.contact) {
    document.getElementById('contactEmail').value = data.contact.email || '';
    document.getElementById('contactGithub').value = data.contact.github || '';
    document.getElementById('contactLinkedin').value = data.contact.linkedin || '';
    document.getElementById('contactPhone').value = data.contact.phone || '';
  }
}

function saveContact() {
  const data = getStoredData();
  data.contact = {
    email: document.getElementById('contactEmail').value,
    github: document.getElementById('contactGithub').value,
    linkedin: document.getElementById('contactLinkedin').value,
    phone: document.getElementById('contactPhone').value
  };
  saveStoredData(data);
  updateMainSite('contact', data.contact);
  showSuccess('contactSuccess', 'Contact information saved successfully!');
}

// ========== UTILITY FUNCTIONS ==========
function getStoredData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

function saveStoredData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function showSuccess(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.style.display = 'block';
  setTimeout(() => {
    element.style.display = 'none';
  }, 3000);
}

// Update main site (this will be called when main site loads)
function updateMainSite(section, data) {
  // Store update flag
  localStorage.setItem('portfolio_update_' + section, JSON.stringify(data));
  localStorage.setItem('portfolio_update_time', Date.now().toString());
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  
  // Handle avatar preview
  document.getElementById('heroAvatar').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('heroAvatarPreview').src = e.target.result;
        document.getElementById('heroAvatarPreview').style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
});

