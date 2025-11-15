document.addEventListener('DOMContentLoaded', () => {
  // Apply admin panel updates
  const applyAdminUpdates = () => {
    // Hero Section Updates
    const heroUpdate = localStorage.getItem('portfolio_update_hero');
    if (heroUpdate) {
      try {
        const heroData = JSON.parse(heroUpdate);
        if (heroData.name) {
          const nameEl = document.querySelector('.hero-name-reveal, .hero h1');
          if (nameEl) nameEl.textContent = heroData.name;
        }
        if (heroData.role) {
          const roleEl = document.querySelector('.hero-role-badge, .hero-tagline');
          if (roleEl) roleEl.textContent = heroData.role;
        }
        if (heroData.description) {
          const descEl = document.querySelector('.hero-description-fade, .hero p');
          if (descEl) descEl.textContent = heroData.description;
        }
        if (heroData.avatar) {
          const avatarEl = document.getElementById('avatarImage');
          if (avatarEl) avatarEl.src = heroData.avatar;
        }
      } catch (e) {
        console.error('Error applying hero update:', e);
      }
    }

    // About Section Updates
    const aboutUpdate = localStorage.getItem('portfolio_update_about');
    if (aboutUpdate) {
      try {
        const aboutData = JSON.parse(aboutUpdate);
        if (aboutData.text) {
          const aboutEl = document.querySelector('[data-subpage="about-journey"] p, .about-text');
          if (aboutEl) aboutEl.textContent = aboutData.text;
        }
        // Update timeline years if needed
        if (aboutData.startYear) {
          const startYearEls = document.querySelectorAll('[data-year]');
          startYearEls.forEach(el => {
            if (el.textContent.includes('2023')) {
              el.textContent = el.textContent.replace('2023', aboutData.startYear);
            }
          });
        }
      } catch (e) {
        console.error('Error applying about update:', e);
      }
    }

    // Projects Updates
    const projectsUpdate = localStorage.getItem('portfolio_update_projects');
    if (projectsUpdate) {
      try {
        const projectsData = JSON.parse(projectsUpdate);
        // Store in a way that render functions can access
        window.adminProjectsData = projectsData;
        // Re-render projects
        setTimeout(() => {
          if (typeof renderShowcaseProjects === 'function') {
            renderShowcaseProjects();
          }
        }, 100);
      } catch (e) {
        console.error('Error applying projects update:', e);
      }
    }

    // Certificates Updates
    const certificatesUpdate = localStorage.getItem('portfolio_update_certificates');
    if (certificatesUpdate) {
      try {
        const certsData = JSON.parse(certificatesUpdate);
        // Store in a way that render functions can access
        window.adminCertificatesData = certsData;
        // Re-render certificates
        setTimeout(() => {
          if (typeof renderCertificateGallery === 'function') {
            renderCertificateGallery();
          }
        }, 100);
      } catch (e) {
        console.error('Error applying certificates update:', e);
      }
    }

    // Contact Updates
    const contactUpdate = localStorage.getItem('portfolio_update_contact');
    if (contactUpdate) {
      try {
        const contactData = JSON.parse(contactUpdate);
        if (contactData.email) {
          const emailEl = document.querySelector('a[href^="mailto:"]');
          if (emailEl) {
            emailEl.href = `mailto:${contactData.email}`;
            emailEl.textContent = contactData.email;
          }
        }
        if (contactData.github) {
          const githubEl = document.querySelector('a[href*="github.com"]');
          if (githubEl) githubEl.href = contactData.github;
        }
        if (contactData.linkedin) {
          const linkedinEl = document.querySelector('a[href*="linkedin.com"]');
          if (linkedinEl) linkedinEl.href = contactData.linkedin;
        }
      } catch (e) {
        console.error('Error applying contact update:', e);
      }
    }
  };

  // Apply updates on load
  applyAdminUpdates();

  // Listen for storage changes (when admin panel updates)
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('portfolio_update_')) {
      applyAdminUpdates();
    }
  });

  // Also check periodically for updates (for same-tab updates)
  setInterval(() => {
    const updateTime = localStorage.getItem('portfolio_update_time');
    if (updateTime && parseInt(updateTime) > (window.lastUpdateTime || 0)) {
      window.lastUpdateTime = parseInt(updateTime);
      applyAdminUpdates();
    }
  }, 1000);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const initNavToggle = () => {
    const nav = document.querySelector('.nav-glass');
    const toggle = document.querySelector('.nav-toggle');

    if (!nav || !toggle) return;

    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });

    nav.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('is-open'));
    });
  };

  const activateSubpage = (pageElement, subpageId, triggerButton) => {
    if (!pageElement) return;

    const subpages = pageElement.querySelectorAll('.subpage');
    const buttons = pageElement.querySelectorAll('.page-subnav .subnav-btn');

    subpages.forEach((subpage) => {
      subpage.classList.toggle('is-active', subpage.dataset.subpage === subpageId);
      if (subpage.dataset.subpage === subpageId) {
        subpage.querySelectorAll('.reveal-on-scroll').forEach((el) => el.classList.add('is-visible'));
        // Re-initialize animations for newly active subpage
        setTimeout(() => {
          initTilt();
          initReveal();
          // Re-render data if needed
          if (subpageId.includes('projects')) {
            initProjects();
          }
          if (subpageId.includes('cert')) {
            initCertificates();
          }
          // Re-initialize section-specific features
          if (subpageId && subpageId.includes('skills')) {
            initSkillsNavigation();
            initTilt();
            initReveal();
          }
          if (subpageId.includes('cert-gallery')) {
            initCertificateFlipCards();
            initCertificateFilters();
          }
          if (subpageId.includes('contact-message')) {
            initMultiStepForm();
          }
          if (subpageId.includes('home-highlights')) {
            initAnimatedStats();
          }
        }, 100);
      }
    });

    buttons.forEach((button) => {
      const isActive = button === triggerButton;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  const initSubnav = (pageElement) => {
    const buttons = pageElement.querySelectorAll('.page-subnav .subnav-btn');
    if (!buttons.length) return;

    if (!pageElement.dataset.subnavInitialized) {
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          activateSubpage(pageElement, button.dataset.subpageTarget, button);
        });
      });
      pageElement.dataset.subnavInitialized = 'true';
    }

    const defaultButton = pageElement.querySelector('.page-subnav .subnav-btn.is-active') || buttons[0];
    if (defaultButton) {
      activateSubpage(pageElement, defaultButton.dataset.subpageTarget, defaultButton);
    }
  };

  const initPageNavigation = () => {
    const pages = Array.from(document.querySelectorAll('.page-block'));
    const navLinks = Array.from(document.querySelectorAll('.nav-links a[data-page-target]'));
    const nav = document.querySelector('.nav-glass');

    if (!pages.length || !navLinks.length) return;

    const activatePage = (pageId) => {
      const targetId = pageId && pages.some((page) => page.dataset.page === pageId) ? pageId : 'home';

      pages.forEach((page) => {
        const isActive = page.dataset.page === targetId;
        page.classList.toggle('is-active', isActive);
        if (isActive) {
          initSubnav(page);
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.dataset.pageTarget === targetId);
      });

      if (nav) {
        nav.classList.remove('is-open');
      }

      window.history.replaceState(null, '', `#${targetId}`);
      // Enhanced smooth scroll with cinematic effect
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      
      // Add cinematic transition class
      document.body.style.transition = 'opacity 0.3s ease';
      document.body.style.opacity = '0.95';
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 150);
    };

    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        activatePage(link.dataset.pageTarget);
      });
    });

    const initialHash = window.location.hash.replace('#', '');
    activatePage(initialHash);
  };

  const initTilt = () => {
    const selectors = [
      '[data-tilt]',
      '.project-card',
      '.skill-card',
      '.certificate-card',
      '.contact-card',
      '.contact-form',
      '.service-card',
      '.highlight-card',
      '.experience-card',
      '.tool-card',
      '.soft-card',
      '.timeline-item',
      '.catalog-item',
      '.download-card',
      '.location-card',
      '.gallery-item',
      '.tilt-card-3d',
      '.skill-card-3d',
      '.tool-card-3d',
      '.soft-card-3d'
    ];

    const candidates = document.querySelectorAll(selectors.join(', '));
    const tiltElements = new Set();

    candidates.forEach((element) => {
      if (!tiltElements.has(element)) {
        element.classList.add('tilt-card');
        tiltElements.add(element);
      }
    });

    const applyTilt = (event) => {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const pointerX = event.clientX ?? event.touches?.[0]?.clientX;
      const pointerY = event.clientY ?? event.touches?.[0]?.clientY;

      if (pointerX === undefined || pointerY === undefined) return;

      const halfWidth = rect.width / 2;
      const halfHeight = rect.height / 2;
      const offsetX = pointerX - (rect.left + halfWidth);
      const offsetY = pointerY - (rect.top + halfHeight);

      // Enhanced 3D tilt for 3D cards
      const is3DCard = target.classList.contains('tilt-card-3d') || 
                       target.classList.contains('skill-card-3d') ||
                       target.classList.contains('tool-card-3d') ||
                       target.classList.contains('soft-card-3d');

      if (is3DCard) {
        const rotateX = clamp((offsetY / halfHeight) * -15, -20, 20);
        const rotateY = clamp((offsetX / halfWidth) * 15, -20, 20);
        const translateZ = 30;

        // Calculate hover position for radial gradient
        const hoverX = ((pointerX - rect.left) / rect.width) * 100;
        const hoverY = ((pointerY - rect.top) / rect.height) * 100;

        target.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
        target.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
        target.style.setProperty('--tilt-z', `${translateZ}px`);
        target.style.setProperty('--hover-x', `${hoverX}%`);
        target.style.setProperty('--hover-y', `${hoverY}%`);
      } else {
        const rotateX = clamp((offsetY / halfHeight) * -15, -18, 18);
        const rotateY = clamp((offsetX / halfWidth) * 15, -18, 18);

        // Calculate hover position for radial gradient
        const hoverX = ((pointerX - rect.left) / rect.width) * 100;
        const hoverY = ((pointerY - rect.top) / rect.height) * 100;

        target.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
        target.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
        target.style.setProperty('--tilt-z', '25px');
        
        // Set hover position for 3D cards
        if (target.classList.contains('skill-card-3d') || 
            target.classList.contains('tool-card-3d') || 
            target.classList.contains('soft-card-3d')) {
          target.style.setProperty('--hover-x', `${hoverX}%`);
          target.style.setProperty('--hover-y', `${hoverY}%`);
        }
      }

      target.classList.add('is-active');
    };

    const resetTilt = (event) => {
      const target = event.currentTarget;
      target.style.setProperty('--tilt-x', '0deg');
      target.style.setProperty('--tilt-y', '0deg');
      target.style.setProperty('--tilt-z', '0px');
      target.classList.remove('is-active');
    };

    tiltElements.forEach((element) => {
      element.addEventListener('pointermove', applyTilt);
      element.addEventListener('pointerleave', resetTilt);
      element.addEventListener('pointerdown', () => {
        element.classList.add('is-active');
        element.style.setProperty('--tilt-z', '15px');
      });
      element.addEventListener('pointerup', () => {
        element.classList.remove('is-active');
        element.style.setProperty('--tilt-z', '0px');
      });
    });

    // Enhanced 3D tilt for skill cards specifically
    const skillCards3D = document.querySelectorAll('.skill-card-3d[data-tilt], .tool-card-3d[data-tilt], .soft-card-3d[data-tilt]');
    skillCards3D.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--hover-x', `${x}%`);
        card.style.setProperty('--hover-y', `${y}%`);
      });
    });
  };

  const initReveal = () => {
    const revealTargets = document.querySelectorAll(
      '.reveal-on-scroll, .project-card, .skill-card, .certificate-card, .contact-card, .contact-form, .service-card, .highlight-card, .experience-card, .tool-card, .soft-card, .timeline-item, .catalog-item, .download-card, .location-card, .gallery-item, .skill-card-3d, .tool-card-3d, .soft-card-3d'
    );

    if (!revealTargets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            
            // Animate skill progress bars when visible
            const skillBar = entry.target.querySelector('.skill-bar-3d');
            if (skillBar && !skillBar.classList.contains('is-visible')) {
              skillBar.classList.add('is-visible');
              const progress = Number(skillBar.getAttribute('data-progress')) || 0;
              skillBar.style.setProperty('--progress', `${clamp(progress / 100, 0, 1)}`);
            }
            
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    revealTargets.forEach((target) => observer.observe(target));
  };

  const initSkills = () => {
    document.querySelectorAll('.skill-bar').forEach((bar) => {
      const progress = Number(bar.getAttribute('data-progress')) || 0;
      bar.style.setProperty('--progress', `${clamp(progress / 100, 0, 1)}`);
      if (progress > 0) {
        bar.classList.add('is-visible');
      }
    });

    // Initialize 3D skill bars
    document.querySelectorAll('.skill-bar-3d').forEach((bar) => {
      const progress = Number(bar.getAttribute('data-progress')) || 0;
      bar.style.setProperty('--progress', `${clamp(progress / 100, 0, 1)}`);
    });
  };

  const initSkillsNavigation = () => {
    const navButtons = document.querySelectorAll('.skill-nav-btn');
    const sections = document.querySelectorAll('.skills-section');
    const scrollContainer = document.getElementById('skillsScrollContainer') || document.querySelector('.skills-scroll-container');

    if (!navButtons.length || !sections.length) return;

    const updateActiveButton = (activeSection) => {
      navButtons.forEach((btn) => {
        const isActive = btn.dataset.skillSection === activeSection;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    };

    const scrollToSection = (sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const headerOffset = 150;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update active button immediately
        updateActiveButton(sectionId);
      }
    };

    // Button click handlers
    navButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = btn.dataset.skillSection;
        scrollToSection(sectionId);
      });
    });

    // Update active button and section visibility on scroll
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: [0.3, 0.5, 0.7]
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const section = entry.target;
        const sectionId = section.id;
        
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          section.classList.add('is-active');
          updateActiveButton(sectionId);
        } else {
          section.classList.remove('is-active');
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      sectionObserver.observe(section);
      // Set first section as active initially
      if (section.id === 'core-skills') {
        section.classList.add('is-active');
      }
    });
  };

  const initAnimatedStats = () => {
    const animatedStats = document.querySelectorAll('.stat-animated[data-value]');
    
    const animateCounter = (element, target) => {
      const duration = 2000;
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          element.textContent = Math.floor(current) + '+';
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target + '+';
        }
      };

      updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stat = entry.target;
          const value = Number(stat.getAttribute('data-value'));
          const numberElement = stat.querySelector('.stat-number');
          
          if (numberElement && value && !stat.dataset.animated) {
            stat.dataset.animated = 'true';
            animateCounter(numberElement, value);
          }
        }
      });
    }, { threshold: 0.5 });

    animatedStats.forEach((stat) => observer.observe(stat));
  };

  const initSkillsCarousel = () => {
    const container = document.querySelector('.skills-carousel-container');
    const track = document.getElementById('skillsCarouselTrack');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    
    if (!container || !track) return;

    const cards = track.querySelectorAll('.skill-card');
    if (cards.length === 0) return;

    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 32; // card width + gap

    // Create indicators
    cards.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
      indicator.addEventListener('click', () => goToSlide(index));
      indicatorsContainer.appendChild(indicator);
    });

    const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      indicators.forEach((ind, idx) => {
        ind.classList.toggle('active', idx === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = clamp(index, 0, cards.length - 1);
      updateCarousel();
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateCarousel();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCarousel();
    };

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Auto-play (optional)
    // setInterval(nextSlide, 5000);
  };

  const initCertificateFlipCards = () => {
    const flipCards = document.querySelectorAll('.certificate-flip-card');
    flipCards.forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  };

  const initCertificateFilters = () => {
    // Filter buttons removed - all certificates display by default
    // This function is kept for compatibility but does nothing
    const certificates = document.querySelectorAll('.certificate-flip-card, .certificate-card');
    // Ensure all certificates are visible
    certificates.forEach((cert) => {
      cert.style.display = '';
      cert.style.opacity = '1';
      cert.style.transform = 'scale(1)';
    });
  };

  const initMultiStepForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const steps = form.querySelectorAll('.form-step');
    const nextBtns = form.querySelectorAll('.form-next-btn');
    const prevBtns = form.querySelectorAll('.form-prev-btn');
    const progressFill = form.querySelector('.progress-fill');
    const currentStepSpan = document.getElementById('currentStep');

    let currentStep = 1;
    const totalSteps = steps.length;

    const updateProgress = () => {
      const progress = (currentStep / totalSteps) * 100;
      if (progressFill) {
        progressFill.style.width = `${progress}%`;
      }
      if (currentStepSpan) {
        currentStepSpan.textContent = currentStep;
      }
    };

    const showStep = (step) => {
      steps.forEach((s, idx) => {
        s.classList.toggle('active', idx + 1 === step);
      });
      currentStep = step;
      updateProgress();
    };

    nextBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const currentStepEl = form.querySelector('.form-step.active');
        if (currentStepEl) {
          const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
          let isValid = true;

          inputs.forEach((input) => {
            if (!input.value.trim()) {
              isValid = false;
              input.style.borderColor = 'rgba(255, 107, 157, 0.6)';
              setTimeout(() => {
                input.style.borderColor = '';
              }, 2000);
            }
          });

          if (isValid && currentStep < totalSteps) {
            showStep(currentStep + 1);
          }
        }
      });
    });

    prevBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (currentStep > 1) {
          showStep(currentStep - 1);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Handle form submission
      alert('Thank you for your message! I\'ll get back to you soon.');
      form.reset();
      showStep(1);
    });
  };

  const initFooterYear = () => {
    const yearNode = document.getElementById('year');
    if (yearNode) {
      yearNode.textContent = new Date().getFullYear();
    }
  };

  const initOrbs = () => {
    const canvas = document.getElementById('orbCanvas');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const orbs = [];
    const orbCount = 16;
    let width = (canvas.width = window.innerWidth * window.devicePixelRatio);
    let height = (canvas.height = window.innerHeight * window.devicePixelRatio);

    const createOrbs = () => {
      orbs.length = 0;
      for (let i = 0; i < orbCount; i += 1) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: (Math.random() * 220 + 120) * window.devicePixelRatio,
          hue: 190 + Math.random() * 120,
          alpha: Math.random() * 0.15 + 0.05,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
        });
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      createOrbs();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      orbs.forEach((orb) => {
        context.beginPath();
        const gradient = context.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, `hsla(${orb.hue}, 90%, 65%, ${orb.alpha})`);
        gradient.addColorStop(1, 'hsla(220, 60%, 10%, 0)');
        context.fillStyle = gradient;
        context.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        context.fill();

        orb.x += orb.speedX * window.devicePixelRatio;
        orb.y += orb.speedY * window.devicePixelRatio;

        if (orb.x - orb.radius > width) orb.x = -orb.radius;
        if (orb.x + orb.radius < 0) orb.x = width + orb.radius;
        if (orb.y - orb.radius > height) orb.y = -orb.radius;
        if (orb.y + orb.radius < 0) orb.y = height + orb.radius;
      });

      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    createOrbs();
    draw();
  };

  const initHeroParallax = () => {
    const hero = document.querySelector('.hero-subpage');
    if (!hero) return;

    const setParallax = (x, y) => {
      hero.style.setProperty('--parallax-x', x);
      hero.style.setProperty('--parallax-y', y);
    };

    const handlePointerMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width;
      const relY = (event.clientY - rect.top) / rect.height;
      const x = clamp((relX - 0.5) * 2, -1, 1);
      const y = clamp((relY - 0.5) * 2, -1, 1);
      setParallax(x.toFixed(3), y.toFixed(3));
    };

    const reset = () => setParallax('0', '0');

    hero.addEventListener('pointermove', handlePointerMove);
    hero.addEventListener('pointerleave', reset);
    hero.addEventListener('pointerdown', handlePointerMove);

    setParallax('0', '0');
  };

  const initCustomCursor = () => {
    const cursor = document.querySelector('.custom-cursor');
    const trail = document.querySelector('.cursor-trail');
    if (!cursor || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    const createRipple = (x, y) => {
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    const createGlowTrail = (x, y) => {
      const glow = document.createElement('div');
      glow.className = 'cursor-glow-trail';
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      document.body.appendChild(glow);
      setTimeout(() => glow.remove(), 800);
    };

    const updateCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    };

    const updateTrail = () => {
      trailX += (mouseX - trailX) * 0.1;
      trailY += (mouseY - trailY) * 0.1;
      trail.style.left = `${trailX}px`;
      trail.style.top = `${trailY}px`;
      requestAnimationFrame(updateTrail);
    };

    document.addEventListener('mousemove', updateCursor);
    updateTrail();

    const interactiveElements = document.querySelectorAll('a, button, .tilt-card, .project-card, .skill-card');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    document.addEventListener('mousedown', (e) => {
      cursor.classList.add('click');
      createRipple(e.clientX, e.clientY);
      createGlowTrail(e.clientX, e.clientY);
    });
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
  };

  const initParticles = () => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 30;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    });

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = distance < 100 ? (100 - distance) / 100 : 0;

        p.x += p.speedX + dx * force * 0.001;
        p.y += p.speedY + dy * force * 0.001;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94, 240, 255, ${p.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(94, 240, 255, 0.8)';
      });

      requestAnimationFrame(draw);
    };

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('resize', resize);
    resize();
    init();
    draw();
  };

  const initSparkles = () => {
    const container = document.querySelector('.sparkle-container');
    if (!container) return;

    const createSparkle = (x, y) => {
      for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 30 + Math.random() * 20;
        sparkle.style.left = `${x + Math.cos(angle) * distance}px`;
        sparkle.style.top = `${y + Math.sin(angle) * distance}px`;
        sparkle.style.animationDelay = `${Math.random() * 0.2}s`;
        container.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 600);
      }
    };

    document.addEventListener('click', (e) => {
      if (e.target.matches('button, a, .project-card, .skill-card')) {
        createSparkle(e.clientX, e.clientY);
      }
    });
  };

  const initMagneticButtons = () => {
    const buttons = document.querySelectorAll('.primary-btn, .ghost-btn');
    buttons.forEach((btn) => {
      let rafId = null;

      const updateMagnetic = (e) => {
        if (rafId) return;
        
        rafId = requestAnimationFrame(() => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const distance = Math.sqrt(x * x + y * y);
          const maxDistance = 100;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            btn.style.setProperty('--magnetic-x', `${x * force * 0.3}px`);
            btn.style.setProperty('--magnetic-y', `${y * force * 0.3}px`);
            btn.classList.add('magnetic');
          } else {
            btn.style.setProperty('--magnetic-x', '0');
            btn.style.setProperty('--magnetic-y', '0');
            btn.classList.remove('magnetic');
          }

          const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
          const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
          btn.style.setProperty('--mouse-x', `${mouseX}%`);
          btn.style.setProperty('--mouse-y', `${mouseY}%`);
          
          rafId = null;
        });
      };

      btn.addEventListener('mousemove', updateMagnetic);

      btn.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        btn.style.setProperty('--magnetic-x', '0');
        btn.style.setProperty('--magnetic-y', '0');
        btn.classList.remove('magnetic');
      });
    });
  };

  const initProjectHover = () => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--hover-x', `${x}%`);
        card.style.setProperty('--hover-y', `${y}%`);
      });
    });
  };

  const initTextReveal = () => {
    const headings = document.querySelectorAll('h1, h2, h3, .hero-tagline');
    headings.forEach((heading) => {
      heading.classList.add('text-reveal');
    });
  };

  const initAvatarReactions = () => {
    const avatarWrap = document.getElementById('avatarWrap');
    const avatarImage = document.getElementById('avatarImage');
    const avatarTooltip = document.getElementById('avatarTooltip');
    if (!avatarWrap || !avatarImage) return;

    let lastReactionTime = 0;
    const reactionCooldown = 2000; // 2 seconds between reactions

    const triggerReaction = (reactionType, message) => {
      const now = Date.now();
      if (now - lastReactionTime < reactionCooldown) return;
      lastReactionTime = now;

      // Remove all reaction classes
      avatarWrap.classList.remove('react-wave', 'react-nod', 'react-smile');
      
      // Add the new reaction
      setTimeout(() => {
        avatarWrap.classList.add(`react-${reactionType}`);
        if (avatarTooltip) {
          avatarTooltip.textContent = message;
        }
        
        // Remove reaction after animation
        setTimeout(() => {
          avatarWrap.classList.remove(`react-${reactionType}`);
          if (avatarTooltip) {
            avatarTooltip.textContent = 'Hover or click to interact!';
          }
        }, 2000);
      }, 50);
    };

    // Track cursor proximity
    let isNearAvatar = false;
    let proximityCheckInterval = null;

    const startProximityCheck = () => {
      if (proximityCheckInterval) return; // Already running
      proximityCheckInterval = setInterval(() => {
        if (isNearAvatar && Math.random() > 0.7) {
          triggerReaction('nod', '👍 Glad you\'re here!');
        }
      }, 5000);
    };

    const stopProximityCheck = () => {
      if (proximityCheckInterval) {
        clearInterval(proximityCheckInterval);
        proximityCheckInterval = null;
      }
    };

    document.addEventListener('mousemove', (e) => {
      const avatarRect = avatarWrap.getBoundingClientRect();
      const avatarCenterX = avatarRect.left + avatarRect.width / 2;
      const avatarCenterY = avatarRect.top + avatarRect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - avatarCenterX, 2) + 
        Math.pow(e.clientY - avatarCenterY, 2)
      );

      const proximityThreshold = 150;
      const wasNear = isNearAvatar;
      isNearAvatar = distance < proximityThreshold;

      if (isNearAvatar && !wasNear) {
        // Just entered proximity - wave
        triggerReaction('wave', '👋 Hello! Nice to see you!');
        startProximityCheck();
      } else if (!isNearAvatar && wasNear) {
        // Just left proximity
        stopProximityCheck();
      }
    });

    // Click interaction - smile
    avatarWrap.addEventListener('click', () => {
      triggerReaction('smile', '😊 Thanks for visiting!');
    });
  };

  const initHolographicIcons = () => {
    const icons = document.querySelectorAll('.holographic-icon');
    if (!icons.length) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      icons.forEach((icon, index) => {
        const rect = icon.getBoundingClientRect();
        const iconX = rect.left + rect.width / 2;
        const iconY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(mouseX - iconX, 2) + 
          Math.pow(mouseY - iconY, 2)
        );

        const followThreshold = 200;
        if (distance < followThreshold) {
          const force = (followThreshold - distance) / followThreshold;
          const angle = Math.atan2(mouseY - iconY, mouseX - iconX);
          const moveX = Math.cos(angle) * force * 30;
          const moveY = Math.sin(angle) * force * 30;
          
          icon.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.3})`;
          icon.classList.add('follow-cursor');
        } else {
          icon.style.transform = '';
          icon.classList.remove('follow-cursor');
        }
      });
    });
  };

  const smoothScrollTo = (element) => {
    if (!element) return;
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const hideLoader = () => {
    const loader = document.getElementById('pageLoader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  };

  const initKeyboardNavigation = () => {
    // ESC to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const nav = document.querySelector('.nav-glass');
        if (nav) {
          nav.classList.remove('is-open');
        }
      }
    });

    // Enhanced focus styles for accessibility
    const focusableElements = document.querySelectorAll('a, button, input, textarea, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach((el) => {
      el.addEventListener('focus', () => {
        el.style.outline = '2px solid var(--accent)';
        el.style.outlineOffset = '4px';
      });
      el.addEventListener('blur', () => {
        el.style.outline = '';
        el.style.outlineOffset = '';
      });
    });
  };


  initNavToggle();
  initPageNavigation();
  initHeroParallax();
  initCustomCursor();
  initParticles();
  initSparkles();
  initMagneticButtons();
  initProjectHover();
  initTextReveal();
  initTilt();
  initReveal();
  initSkills();
  initAnimatedStats();
  initSkillsNavigation();
  initCertificateFlipCards();
  initCertificateFilters();
  initMultiStepForm();
  initFooterYear();
  initOrbs();
  initAvatarReactions();
  initHolographicIcons();
  initKeyboardNavigation();

  // Hide loader after page is fully loaded
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 300);
  } else {
    window.addEventListener('load', () => {
      setTimeout(hideLoader, 300);
    });
  }

  // Initialize Projects from Data File
  const initProjects = () => {
    // Wait for projectsData to be available
    if (typeof projectsData === 'undefined') {
      console.warn('Projects data not loaded. Retrying...');
      setTimeout(() => {
        if (typeof projectsData !== 'undefined') {
          initProjects();
        } else {
          console.error('Projects data failed to load. Make sure projects-data.js is included and loaded before script.js');
        }
      }, 100);
      return;
    }

    console.log('Loading projects from projects-data.js...', projectsData);
    renderShowcaseProjects();
    renderCollections();
    renderGallery();
    console.log('Projects loaded successfully!');
  };

  // Reload Projects Data (useful for development)
  const reloadProjects = () => {
    // Remove the old script tag
    const oldScript = document.querySelector('script[src*="projects-data.js"]');
    if (oldScript) {
      oldScript.remove();
    }

    // Create new script tag with cache-busting
    const newScript = document.createElement('script');
    newScript.src = `projects-data.js?v=${Date.now()}`;
    newScript.onload = () => {
      console.log('Projects data reloaded!');
      initProjects();
    };
    newScript.onerror = () => {
      console.error('Failed to reload projects data');
    };
    document.head.appendChild(newScript);
  };

  // Expose reload function globally for development
  window.reloadProjects = reloadProjects;

  // Render Showcase Projects
  const renderShowcaseProjects = () => {
    const showcaseContainer = document.querySelector('[data-subpage="projects-showcase"] .project-grid');
    if (!showcaseContainer) {
      console.warn('Showcase container not found');
      return;
    }
    
    if (!projectsData.showcase || !Array.isArray(projectsData.showcase)) {
      console.warn('No showcase projects data available');
      showcaseContainer.innerHTML = '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No projects to display. Please check projects-data.js</p>';
      return;
    }

    try {
      showcaseContainer.innerHTML = projectsData.showcase.map(project => {
        // Validate project data
        if (!project.title || !project.tag || !project.description) {
          console.warn('Invalid project data:', project);
          return '';
        }
        
        return `
          <article class="project-card tilt-card reveal-on-scroll" data-tilt>
            <div class="project-preview" style="background-image: url('${project.image || 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80'}');"></div>
            <div class="project-content">
              <span class="project-tag">${project.tag}</span>
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              <div class="project-actions">
                ${project.links && project.links.code ? `<a href="${project.links.code}" target="_blank" rel="noreferrer">${project.linkLabels?.code || 'View Code'}</a>` : ''}
                ${project.links && project.links.live ? `<a href="${project.links.live}" target="_blank" rel="noreferrer">${project.linkLabels?.live || 'Live Demo'}</a>` : ''}
              </div>
            </div>
          </article>
        `;
      }).filter(html => html !== '').join('');

      // Re-initialize tilt for new elements
      initTilt();
      initReveal();
      console.log(`Rendered ${projectsData.showcase.length} showcase projects`);
    } catch (error) {
      console.error('Error rendering showcase projects:', error);
      showcaseContainer.innerHTML = '<p style="color: var(--accent); padding: 40px; text-align: center;">Error loading projects. Check console for details.</p>';
    }
  };

  // Render Collections
  const renderCollections = () => {
    const collectionsContainer = document.querySelector('[data-subpage="projects-collections"] .collection-grid');
    if (!collectionsContainer) {
      console.warn('Collections container not found');
      return;
    }
    
    if (!projectsData.collections || !Array.isArray(projectsData.collections)) {
      console.warn('No collections data available');
      collectionsContainer.innerHTML = '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No collections to display. Please check projects-data.js</p>';
      return;
    }

    try {
      const defaultOpenCategories = ['Flutter Projects'];
      const defaultOpenSubcategories = ['Mobile Applications', 'Web Applications', 'Linear Regression & Predictive Analytics', 'DevOps Projects', 'Conversational AI'];
      
      collectionsContainer.innerHTML = projectsData.collections.map(collection => {
        if (!collection.category || !collection.subcategories) {
          console.warn('Invalid collection data:', collection);
          return '';
        }
        
        return `
          <details class="collection-card tilt-card" ${defaultOpenCategories.includes(collection.category) ? 'open' : ''} data-tilt>
            <summary>${collection.category}</summary>
            <div class="collection-body">
              ${collection.subcategories.map(subcategory => {
                if (!subcategory.name || !subcategory.projects) {
                  console.warn('Invalid subcategory data:', subcategory);
                  return '';
                }
                
                return `
                  <details ${defaultOpenSubcategories.includes(subcategory.name) ? 'open' : ''}>
                    <summary>${subcategory.name}</summary>
                    <ul>
                      ${subcategory.projects.map(project => {
                        if (!project.title || !project.description) {
                          console.warn('Invalid project data:', project);
                          return '';
                        }
                        
                        return `
                          <li>
                            <strong>${project.title}</strong>
                            <span>${project.description}</span>
                            <div class="collection-links">
                              ${project.links && project.links.code ? `<a href="${project.links.code}" target="_blank" rel="noreferrer">${project.linkLabels?.code || 'View Code'}</a>` : ''}
                              ${project.links && project.links.live ? `<a href="${project.links.live}" target="_blank" rel="noreferrer">${project.linkLabels?.live || 'Live Demo'}</a>` : ''}
                            </div>
                          </li>
                        `;
                      }).filter(html => html !== '').join('')}
                    </ul>
                  </details>
                `;
              }).filter(html => html !== '').join('')}
            </div>
          </details>
        `;
      }).filter(html => html !== '').join('');

      // Re-initialize tilt for new elements
      initTilt();
      console.log(`Rendered ${projectsData.collections.length} collections`);
    } catch (error) {
      console.error('Error rendering collections:', error);
      collectionsContainer.innerHTML = '<p style="color: var(--accent); padding: 40px; text-align: center;">Error loading collections. Check console for details.</p>';
    }
  };

  // Render Gallery
  const renderGallery = () => {
    const galleryContainer = document.querySelector('[data-subpage="projects-gallery"] .project-gallery');
    if (!galleryContainer) {
      console.warn('Gallery container not found');
      return;
    }
    
    if (!projectsData.gallery || !Array.isArray(projectsData.gallery)) {
      console.warn('No gallery data available');
      galleryContainer.innerHTML = '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No gallery items to display. Please check projects-data.js</p>';
      return;
    }

    try {
      galleryContainer.innerHTML = projectsData.gallery.map(item => {
        if (!item.title || !item.description) {
          console.warn('Invalid gallery item data:', item);
          return '';
        }
        
        return `
          <div class="gallery-item tilt-card" data-tilt>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
        `;
      }).filter(html => html !== '').join('');

      // Re-initialize tilt for new elements
      initTilt();
      console.log(`Rendered ${projectsData.gallery.length} gallery items`);
    } catch (error) {
      console.error('Error rendering gallery:', error);
      galleryContainer.innerHTML = '<p style="color: var(--accent); padding: 40px; text-align: center;">Error loading gallery. Check console for details.</p>';
    }
  };

  // Initialize Certificates from Data File
  const initCertificates = () => {
    // Wait for certificatesData to be available
    if (typeof certificatesData === 'undefined') {
      console.warn('Certificates data not loaded. Retrying...');
      setTimeout(() => {
        if (typeof certificatesData !== 'undefined') {
          initCertificates();
        } else {
          console.error('Certificates data failed to load. Make sure certificates-data.js is included and loaded before script.js');
        }
      }, 100);
      return;
    }

    console.log('Loading certificates from certificates-data.js...', certificatesData);
    renderCertificateGallery();
    renderCertificateCatalog();
    console.log('Certificates loaded successfully!');
  };

  // Reload Certificates Data (useful for development)
  const reloadCertificates = () => {
    // Remove the old script tag
    const oldScript = document.querySelector('script[src*="certificates-data.js"]');
    if (oldScript) {
      oldScript.remove();
    }

    // Create new script tag with cache-busting
    const newScript = document.createElement('script');
    newScript.src = `certificates-data.js?v=${Date.now()}`;
    newScript.onload = () => {
      console.log('Certificates data reloaded!');
      initCertificates();
    };
    newScript.onerror = () => {
      console.error('Failed to reload certificates data');
    };
    document.head.appendChild(newScript);
  };

  // Expose reload function globally for development
  window.reloadCertificates = reloadCertificates;

  // Render Certificate Gallery
  const renderCertificateGallery = () => {
    const galleryContainer = document.querySelector('[data-subpage="cert-gallery"] .certificate-grid');
    if (!galleryContainer) {
      console.warn('Certificate gallery container not found');
      return;
    }
    
    // Check for admin updates first
    let dataToUse = certificatesData;
    if (window.adminCertificatesData && Array.isArray(window.adminCertificatesData)) {
      dataToUse = { gallery: window.adminCertificatesData };
    }
    
    if (!dataToUse.gallery || !Array.isArray(dataToUse.gallery)) {
      console.warn('No certificate gallery data available');
      galleryContainer.innerHTML = '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No certificates to display. Please check certificates-data.js</p>';
      return;
    }

    try {
      // Determine category from certificate data or title
      const getCategory = (cert) => {
        // Use category from certificate data if available
        if (cert.category) {
          return cert.category;
        }
        // Fall back to title-based detection
        const lower = cert.title.toLowerCase();
        if (lower.includes('aws') || lower.includes('cloud')) return 'cloud';
        if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('ml')) return 'ai-ml';
        if (lower.includes('devops') || lower.includes('docker')) return 'devops';
        if (lower.includes('flutter') || lower.includes('mobile')) return 'mobile';
        if (lower.includes('java') || lower.includes('c language') || lower.includes('programming')) return 'programming';
        if (lower.includes('html') || lower.includes('css') || lower.includes('web')) return 'web-development';
        return 'all';
      };

      galleryContainer.innerHTML = dataToUse.gallery.map(cert => {
        if (!cert.title || !cert.description) {
          console.warn('Invalid certificate data:', cert);
          return '';
        }
        
        const category = getCategory(cert);
        
        return `
          <article class="certificate-flip-card tilt-card reveal-on-scroll" data-tilt data-category="${category}">
            <div class="certificate-flip-front">
              <div class="certificate-card">
                <div class="certificate-frame">
                  <img src="${cert.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'}" alt="${cert.alt || cert.title + ' certificate'}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';" />
                </div>
                <div class="certificate-content">
                  <h3>${cert.title}</h3>
                  <p>${cert.description}</p>
                  <p style="color: var(--accent); font-size: 0.85rem; margin-top: 12px;">Click to flip →</p>
                </div>
              </div>
            </div>
            <div class="certificate-flip-back">
              <h3>${cert.title}</h3>
              <p>${cert.description}</p>
              ${cert.viewLink ? `<a href="${cert.viewLink}" class="certificate-link" target="_blank">${cert.viewLinkText || 'View Credential'}</a>` : ''}
              <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: auto;">Click again to flip back</p>
            </div>
          </article>
        `;
      }).filter(html => html !== '').join('');

      // Re-initialize tilt, reveal, and flip cards for new elements
      initTilt();
      initReveal();
      initCertificateFlipCards();
      console.log(`Rendered ${certificatesData.gallery.length} certificate gallery items`);
    } catch (error) {
      console.error('Error rendering certificate gallery:', error);
      galleryContainer.innerHTML = '<p style="color: var(--accent); padding: 40px; text-align: center;">Error loading certificates. Check console for details.</p>';
    }
  };

  // Render Certificate Catalog
  const renderCertificateCatalog = () => {
    const catalogContainer = document.querySelector('[data-subpage="cert-catalog"] .catalog-list');
    if (!catalogContainer) {
      console.warn('Certificate catalog container not found');
      return;
    }
    
    if (!certificatesData.catalog || !Array.isArray(certificatesData.catalog)) {
      console.warn('No certificate catalog data available');
      catalogContainer.innerHTML = '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No certificates to display. Please check certificates-data.js</p>';
      return;
    }

    try {
      catalogContainer.innerHTML = certificatesData.catalog.map(cert => {
        if (!cert.title || !cert.description) {
          console.warn('Invalid certificate data:', cert);
          return '';
        }
        
        return `
          <div class="catalog-item tilt-card" data-tilt>
            <h3>${cert.title}</h3>
            <p>${cert.description}</p>
          </div>
        `;
      }).filter(html => html !== '').join('');

      // Re-initialize tilt for new elements
      initTilt();
      console.log(`Rendered ${certificatesData.catalog.length} certificate catalog items`);
    } catch (error) {
      console.error('Error rendering certificate catalog:', error);
      catalogContainer.innerHTML = '<p style="color: var(--accent); padding: 40px; text-align: center;">Error loading certificates. Check console for details.</p>';
    }
  };

  // Render Certificate Downloads
  const renderCertificateDownloads = () => {
    const downloadsContainer = document.querySelector('[data-subpage="cert-downloads"] .downloads-grid');
    if (!downloadsContainer) {
      console.warn('Certificate downloads container not found');
      return;
    }
    
    if (!certificatesData.downloads || !Array.isArray(certificatesData.downloads)) {
      console.warn('No certificate downloads data available');
      downloadsContainer.innerHTML = '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No certificates to display. Please check certificates-data.js</p>';
      return;
    }

    try {
      downloadsContainer.innerHTML = certificatesData.downloads.map(cert => {
        if (!cert.title || !cert.description) {
          console.warn('Invalid certificate data:', cert);
          return '';
        }
        
        return `
          <div class="download-card tilt-card" data-tilt>
            <h3>${cert.title}</h3>
            <p>${cert.description}</p>
            ${cert.downloadLink ? `<a href="${cert.downloadLink}" class="primary-btn">${cert.downloadText || 'Download'}</a>` : ''}
          </div>
        `;
      }).filter(html => html !== '').join('');

      // Re-initialize tilt for new elements
      initTilt();
      console.log(`Rendered ${certificatesData.downloads.length} certificate download items`);
    } catch (error) {
      console.error('Error rendering certificate downloads:', error);
      downloadsContainer.innerHTML = '<p style="color: var(--accent); padding: 40px; text-align: center;">Error loading certificates. Check console for details.</p>';
    }
  };

  // Initialize projects and certificates after everything is set up
  // Use a small delay to ensure DOM is fully ready
  setTimeout(() => {
    initProjects();
    initCertificates();
  }, 100);
});
