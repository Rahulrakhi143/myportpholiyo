// Enhanced Admin Panel JavaScript with Code Generation
// Admin password

const ADMIN_PASSWORD = 'trikal@134344';
const STORAGE_KEY = 'portfolio_admin_data';

// Enhanced animations and interactions
let activeTab = 'hero';
let unsavedChanges = false;

// Check if user is logged in
function checkAuth() {
  const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  if (isAuthenticated) {
    showAdminPanel();
  } else {
    showLoginScreen();
  }
}

// Show login screen with animation
function showLoginScreen() {
  const loginScreen = document.getElementById('loginScreen');
  const adminPanel = document.getElementById('adminPanel');
  
  loginScreen.style.display = 'block';
  loginScreen.style.opacity = '0';
  loginScreen.style.transform = 'scale(0.9)';
  
  setTimeout(() => {
    loginScreen.style.transition = 'all 0.3s ease';
    loginScreen.style.opacity = '1';
    loginScreen.style.transform = 'scale(1)';
  }, 10);
  
  adminPanel.style.display = 'none';
}

// Show admin panel with animation
function showAdminPanel() {
  const loginScreen = document.getElementById('loginScreen');
  const adminPanel = document.getElementById('adminPanel');
  
  loginScreen.style.display = 'none';
  adminPanel.style.display = 'block';
  adminPanel.style.opacity = '0';
  
  setTimeout(() => {
    adminPanel.style.transition = 'all 0.3s ease';
    adminPanel.style.opacity = '1';
    loadAllData();
    initInteractivity();
  }, 10);
}

// Initialize interactive features
function initInteractivity() {
  // Add input animations
  document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
      markUnsaved();
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
    });
    
    input.addEventListener('input', function() {
      markUnsaved();
      showLivePreview(this);
    });
  });
  
  // Add button hover effects
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Add card hover effects
  document.querySelectorAll('.project-item, .certificate-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
      this.style.boxShadow = '0 8px 25px rgba(94, 240, 255, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
  });
}

// Mark unsaved changes
function markUnsaved() {
  unsavedChanges = true;
  const saveBtn = document.querySelector('.save-btn');
  const indicator = document.getElementById('unsavedIndicator');
  
  if (saveBtn) {
    saveBtn.style.animation = 'pulse 2s infinite';
  }
  
  if (indicator) {
    indicator.classList.add('show');
  }
}

// Show live preview
function showLivePreview(input) {
  const preview = input.dataset.preview;
  if (preview) {
    const previewEl = document.getElementById(preview);
    if (previewEl) {
      previewEl.textContent = input.value || input.placeholder;
    }
  }
}

// Login handler with animation
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const password = document.getElementById('adminPassword').value;
  const errorDiv = document.getElementById('loginError');
  const loginBtn = document.querySelector('.login-btn');
  
  loginBtn.textContent = 'Logging in...';
  loginBtn.disabled = true;
  
  setTimeout(() => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_authenticated', 'true');
      showAdminPanel();
      errorDiv.style.display = 'none';
    } else {
      errorDiv.textContent = 'Invalid password. Please try again.';
      errorDiv.style.display = 'block';
      loginBtn.textContent = 'Login';
      loginBtn.disabled = false;
      // Shake animation
      document.getElementById('loginForm').style.animation = 'shake 0.5s';
      setTimeout(() => {
        document.getElementById('loginForm').style.animation = '';
      }, 500);
    }
  }, 500);
});

// Logout handler
function logout() {
  if (unsavedChanges) {
    if (!confirm('You have unsaved changes. Are you sure you want to logout?')) {
      return;
    }
  }
  localStorage.removeItem('admin_authenticated');
  unsavedChanges = false;
  showLoginScreen();
  document.getElementById('adminPassword').value = '';
}

// Enhanced tab switching with animation
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    // Animate tab switch
    document.querySelectorAll('.admin-tab').forEach(t => {
      t.classList.remove('active');
      t.style.transform = 'scale(0.95)';
    });
    
    tab.classList.add('active');
    tab.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
      tab.style.transform = 'scale(1)';
    }, 200);
    
    // Animate content switch
    document.querySelectorAll('.admin-content').forEach(content => {
      content.classList.remove('active');
      content.style.opacity = '0';
      content.style.transform = 'translateX(20px)';
    });
    
    const targetContent = document.getElementById(tabName + 'Tab');
    targetContent.classList.add('active');
    
    setTimeout(() => {
      targetContent.style.transition = 'all 0.3s ease';
      targetContent.style.opacity = '1';
      targetContent.style.transform = 'translateX(0)';
    }, 50);
    
    activeTab = tabName;
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
  updateMainSite('hero', data.hero);
  unsavedChanges = false;
  const indicator = document.getElementById('unsavedIndicator');
  if (indicator) indicator.classList.remove('show');
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
  unsavedChanges = false;
  const indicator = document.getElementById('unsavedIndicator');
  if (indicator) indicator.classList.remove('show');
  showSuccess('aboutSuccess', 'About section saved successfully!');
}

// ========== PROJECTS SECTION ==========
function loadProjects() {
  if (typeof projectsData !== 'undefined') {
    const allProjects = [
      ...(projectsData.showcase || []),
      ...(projectsData.collections?.flatMap(c => c.subcategories?.flatMap(sc => sc.projects || []) || []) || []),
      ...(projectsData.gallery || [])
    ];
    renderProjects(allProjects);
  } else {
    const data = getStoredData();
    renderProjects(data.projects || []);
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
        <button class="delete-btn" onclick="deleteProject(${index})">🗑️ Delete</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Title</label>
          <input type="text" value="${escapeHtml(project.title || '')}" onchange="updateProject(${index}, 'title', this.value)" />
        </div>
        <div class="form-group">
          <label>Image URL</label>
          <input type="url" value="${escapeHtml(project.image || '')}" onchange="updateProject(${index}, 'image', this.value)" />
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea rows="3" onchange="updateProject(${index}, 'description', this.value)" style="width: 100%; padding: 12px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(94, 240, 255, 0.2); border-radius: 8px; color: #e0e7ff; font-family: inherit;">${escapeHtml(project.description || '')}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>GitHub URL</label>
          <input type="url" value="${escapeHtml(project.github || project.links?.code || '')}" onchange="updateProject(${index}, 'github', this.value)" />
        </div>
        <div class="form-group">
          <label>Live URL</label>
          <input type="url" value="${escapeHtml(project.live || project.links?.live || '')}" onchange="updateProject(${index}, 'live', this.value)" />
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateProject(index, field, value) {
  const data = getStoredData();
  if (!data.projects) data.projects = [];
  if (!data.projects[index]) data.projects[index] = {};
  data.projects[index][field] = value;
  saveStoredData(data);
  updateMainSite('projects', data.projects);
  markUnsaved();
}

function deleteProject(index) {
  if (confirm('Are you sure you want to delete this project?')) {
    const data = getStoredData();
    if (data.projects) {
      data.projects.splice(index, 1);
      saveStoredData(data);
      loadProjects();
      updateMainSite('projects', data.projects);
      markUnsaved();
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
  markUnsaved();
}

// ========== CERTIFICATES SECTION ==========
function loadCertificates() {
  if (typeof certificatesData !== 'undefined') {
    renderCertificates(certificatesData.gallery || []);
  } else {
    const data = getStoredData();
    renderCertificates(data.certificates || []);
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
        <h4>${escapeHtml(cert.title || 'Untitled Certificate')}</h4>
        <button class="delete-btn" onclick="deleteCertificate(${index})">🗑️ Delete</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Title</label>
          <input type="text" value="${escapeHtml(cert.title || '')}" onchange="updateCertificate(${index}, 'title', this.value)" />
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
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea rows="3" onchange="updateCertificate(${index}, 'description', this.value)" style="width: 100%; padding: 12px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(94, 240, 255, 0.2); border-radius: 8px; color: #e0e7ff; font-family: inherit;">${escapeHtml(cert.description || '')}</textarea>
      </div>
      <div class="form-group">
        <label>Image URL</label>
        <input type="url" value="${escapeHtml(cert.image || '')}" onchange="updateCertificate(${index}, 'image', this.value)" />
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
  markUnsaved();
}

function deleteCertificate(index) {
  if (confirm('Are you sure you want to delete this certificate?')) {
    const data = getStoredData();
    if (data.certificates) {
      data.certificates.splice(index, 1);
      saveStoredData(data);
      loadCertificates();
      updateMainSite('certificates', data.certificates);
      markUnsaved();
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
  markUnsaved();
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
  unsavedChanges = false;
  const indicator = document.getElementById('unsavedIndicator');
  if (indicator) indicator.classList.remove('show');
  showSuccess('contactSuccess', 'Contact information saved successfully!');
}

// ========== CODE GENERATION ==========
function generateCodeFiles() {
  const data = getStoredData();
  
  // Generate certificates-data.js
  let certsToGenerate = [];
  if (data.certificates && data.certificates.length > 0) {
    certsToGenerate = data.certificates;
  } else if (typeof certificatesData !== 'undefined' && certificatesData.gallery) {
    certsToGenerate = certificatesData.gallery;
  }
  
  if (certsToGenerate.length > 0) {
    const certsCode = generateCertificatesCode(certsToGenerate);
    showCodePreview('certificates', certsCode);
    downloadCodeFile('certificates-data.js', certsCode);
  }
  
  // Generate projects-data.js
  let projectsToGenerate = [];
  if (data.projects && data.projects.length > 0) {
    projectsToGenerate = data.projects;
  } else if (typeof projectsData !== 'undefined') {
    // Use existing structure
    const existingCode = generateProjectsCodeFromExisting();
    if (existingCode) {
      showCodePreview('projects', existingCode);
      downloadCodeFile('projects-data.js', existingCode);
      return;
    }
  }
  
  if (projectsToGenerate.length > 0) {
    const projectsCode = generateProjectsCode(projectsToGenerate);
    showCodePreview('projects', projectsCode);
    downloadCodeFile('projects-data.js', projectsCode);
  } else {
    alert('No projects data to generate. Please add projects first.');
  }
}

function generateProjectsCodeFromExisting() {
  if (typeof projectsData === 'undefined') return null;
  
  // This would require reading the original file structure
  // For now, we'll generate based on current data
  return null;
}

function generateCertificatesCode(certificates) {
  let code = `// Certificates Data Configuration
// Auto-generated by Admin Panel
// Update this file to manage all your certificates easily

const certificatesData = {
  // Gallery Certificates (Featured Certificates with Images)
  gallery: [
`;
  
  certificates.forEach((cert, index) => {
    code += `    {
      id: ${index + 1},
      title: ${JSON.stringify(cert.title || '')},
      description: ${JSON.stringify(cert.description || '')},
      image: ${JSON.stringify(cert.image || '')},
      alt: ${JSON.stringify(cert.alt || cert.title + ' certificate')},
      viewLink: ${JSON.stringify(cert.viewLink || '#')},
      viewLinkText: ${JSON.stringify(cert.viewLinkText || 'View Credential')},
      category: ${JSON.stringify(cert.category || 'all')}
    }${index < certificates.length - 1 ? ',' : ''}
`;
  });
  
  code += `  ],

  // Catalog Certificates (List View)
  catalog: [
`;
  
  certificates.forEach((cert, index) => {
    code += `    {
      id: ${index + 1},
      title: ${JSON.stringify(cert.title || '')},
      description: ${JSON.stringify(cert.description || '')}
    }${index < certificates.length - 1 ? ',' : ''}
`;
  });
  
  code += `  ],

  // Download Certificates (Download View)
  downloads: []
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = certificatesData;
}
`;
  
  return code;
}

function generateProjectsCode(projects) {
  let code = `// Projects Data Configuration
// Auto-generated by Admin Panel
// Update this file to manage all your projects easily

const projectsData = {
  showcase: [
`;
  
  projects.forEach((project, index) => {
    code += `    {
      id: ${index + 1},
      title: ${JSON.stringify(project.title || '')},
      description: ${JSON.stringify(project.description || '')},
      image: ${JSON.stringify(project.image || '')},
      links: {
        code: ${JSON.stringify(project.github || '')},
        live: ${JSON.stringify(project.live || '')}
      },
      linkLabels: {
        code: "View Code",
        live: "Live Demo"
      },
      tags: ${JSON.stringify(project.tags || [])}
    }${index < projects.length - 1 ? ',' : ''}
`;
  });
  
  code += `  ],
  collections: [],
  gallery: []
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = projectsData;
}
`;
  
  return code;
}

function showCodePreview(type, code) {
  // Create or update code preview modal
  let modal = document.getElementById('codePreviewModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'codePreviewModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;';
    modal.innerHTML = `
      <div style="background: #1e293b; border: 1px solid rgba(94, 240, 255, 0.3); border-radius: 16px; max-width: 900px; width: 100%; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column;">
        <div style="padding: 20px; border-bottom: 1px solid rgba(94, 240, 255, 0.2); display: flex; justify-content: space-between; align-items: center;">
          <h3 style="color: #5ef0ff; margin: 0;">Generated Code</h3>
          <button onclick="closeCodePreview()" style="background: rgba(255, 71, 87, 0.2); border: 1px solid rgba(255, 71, 87, 0.4); color: #ff4757; padding: 8px 16px; border-radius: 8px; cursor: pointer;">Close</button>
        </div>
        <pre id="codeContent" style="flex: 1; overflow: auto; padding: 20px; margin: 0; color: #e0e7ff; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.6; background: #0f172a;"></pre>
        <div style="padding: 20px; border-top: 1px solid rgba(94, 240, 255, 0.2); display: flex; gap: 10px;">
          <button onclick="copyCodeToClipboard()" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #5ef0ff, #8c5bff); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer;">Copy Code</button>
          <button onclick="downloadGeneratedCode()" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer;">Download File</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  document.getElementById('codeContent').textContent = code;
  window.currentCode = code;
  window.currentCodeType = type;
  modal.style.display = 'flex';
}

function closeCodePreview() {
  document.getElementById('codePreviewModal').style.display = 'none';
}

function copyCodeToClipboard() {
  navigator.clipboard.writeText(window.currentCode).then(() => {
    alert('Code copied to clipboard! Paste it into your ' + window.currentCodeType + '-data.js file');
  });
}

function downloadGeneratedCode() {
  const filename = window.currentCodeType + '-data.js';
  downloadCodeFile(filename, window.currentCode);
  closeCodePreview();
}

function downloadCodeFile(filename, content) {
  const blob = new Blob([content], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
  element.style.animation = 'slideIn 0.3s ease';
  
  setTimeout(() => {
    element.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      element.style.display = 'none';
    }, 300);
  }, 3000);
}

function updateMainSite(section, data) {
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
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-10px); }
    }
    .form-group.focused label {
      color: #5ef0ff;
    }
    .form-group.focused input,
    .form-group.focused textarea,
    .form-group.focused select {
      border-color: #5ef0ff;
      box-shadow: 0 0 0 3px rgba(94, 240, 255, 0.1);
    }
  `;
  document.head.appendChild(style);
});

