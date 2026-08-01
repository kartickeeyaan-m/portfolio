document.addEventListener('DOMContentLoaded', () => {

  // Accessibility query checking reduced motion settings
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* -----------------------------------------------------------
     STICKY NAVIGATION & ACTIVE SECTION HIGHLIGHT
     ----------------------------------------------------------- */
  const header = document.getElementById('header-nav');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Highlight links depending on page scroll position
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -55% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => navObserver.observe(sec));

  // Mobile Menu toggle mechanics
  const navToggle = document.getElementById('nav-toggle');
  const navLinksList = document.getElementById('nav-links');

  if (navToggle && navLinksList) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinksList.classList.toggle('open');
    });

    // Close menu when clicking link items
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinksList.classList.remove('open');
      });
    });
  }

  /* -----------------------------------------------------------
     NEURAL NETWORK CANVAS BACKGROUND
     ----------------------------------------------------------- */
  const canvas = document.getElementById('neural-canvas');
  const hero = document.getElementById('hero');

  if (canvas && hero && !motionQuery.matches) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 80;
    const connectionDistance = 110;
    const mouse = { x: null, y: null, radius: 160 };

    const resizeCanvas = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2 + 1.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.55)';
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - dist / connectionDistance) * 0.12;
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Mouse connection draw logic
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            const opacity = (1 - dist / mouse.radius) * 0.22;
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Gentle magnetic pull
            particles[i].x -= dx * 0.006;
            particles[i].y -= dy * 0.006;
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawConnections();
      requestAnimationFrame(animate);
    };

    // Event Hookups
    hero.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
  }

  /* -----------------------------------------------------------
     TYPEWRITER CYCLING EFFECT
     ----------------------------------------------------------- */
  const typewriterElement = document.getElementById('typewriter-role');
  const typewriterRoles = ["AI & ML Engineer", "Python Developer", "Problem Solver"];

  if (typewriterElement) {
    if (motionQuery.matches) {
      typewriterElement.textContent = typewriterRoles[0];
    } else {
      let roleIndex = 0;
      let charIndex = typewriterRoles[0].length;
      let isDeleting = true; // Start deleting the initial role text
      let speed = 100;

      const runTypewriter = () => {
        const currentRole = typewriterRoles[roleIndex];

        if (isDeleting) {
          typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
          charIndex--;
          speed = 50;
        } else {
          typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
          charIndex++;
          speed = 120;
        }

        if (!isDeleting && charIndex === currentRole.length) {
          // Word typing completed, hold
          speed = 2200;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          // Deletion completed, move to next role
          isDeleting = false;
          roleIndex = (roleIndex + 1) % typewriterRoles.length;
          speed = 400;
        }

        setTimeout(runTypewriter, speed);
      };

      // Delay starting cycle
      setTimeout(runTypewriter, 2000);
    }
  }

  /* -----------------------------------------------------------
     SCROLL REVEALS (FADE + SLIDE IN)
     ----------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length > 0) {
    if (motionQuery.matches) {
      reveals.forEach(r => r.classList.add('revealed'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      reveals.forEach(r => revealObserver.observe(r));
    }
  }

  /* -----------------------------------------------------------
     SKILLS TAB SYSTEM & INTERACTIVE CANVAS ANIMATIONS
     ----------------------------------------------------------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetTabId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Micro-canvas neural animation inside skill cards
  const skillCards = document.querySelectorAll('.skill-card-interactive');

  skillCards.forEach(card => {
    const canvas = card.querySelector('.skill-card-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let particles = [];
    let cardMouse = { x: null, y: null };
    let isHovered = false;

    const initParticles = () => {
      particles = [];
      const count = 15; // performant count
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 1.5 + 1
        });
      }
    };

    const drawLoop = () => {
      if (!isHovered) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.45)';
        ctx.fill();
      });

      // Draw connections between close particles
      const maxDist = 45;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const alpha = (maxDist - dist) / maxDist * 0.2;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw connections to card mouse
      if (cardMouse.x !== null && cardMouse.y !== null) {
        const mouseMaxDist = 70;
        particles.forEach(p => {
          const dx = p.x - cardMouse.x;
          const dy = p.y - cardMouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouseMaxDist) {
            const alpha = (mouseMaxDist - dist) / mouseMaxDist * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(cardMouse.x, cardMouse.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(drawLoop);
    };

    // Event listeners
    card.addEventListener('mouseenter', () => {
      if (motionQuery.matches) return;
      isHovered = true;

      canvas.width = card.offsetWidth;
      canvas.height = card.offsetHeight;

      initParticles();
      drawLoop();
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--spotlight-x', `${x}px`);
      card.style.setProperty('--spotlight-y', `${y}px`);

      cardMouse.x = x;
      cardMouse.y = y;
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      cardMouse = { x: null, y: null };
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  });

  /* -----------------------------------------------------------
     PROJECT 3D CARDS (MOBILE TAP COMPATIBILITY)
     ----------------------------------------------------------- */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicked item is GitHub or live link, don't flip
      if (e.target.closest('.project-link')) return;

      card.classList.toggle('flipped');
    });
  });

  /* -----------------------------------------------------------
     EXPERIENCE TIMELINE DRAWING LINE
     ----------------------------------------------------------- */
  const timelineActiveLine = document.getElementById('timeline-active-line');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const experienceSection = document.getElementById('experience');

  const drawTimelineLine = () => {
    if (!timelineActiveLine || !experienceSection) return;

    const rect = experienceSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Timeline elements container heights
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;

    const containerRect = timelineContainer.getBoundingClientRect();
    const containerHeight = containerRect.height;

    // Line draws downward as scroll intersects timeline height space
    const triggerOffset = viewportHeight * 0.65;
    const distancePassed = triggerOffset - containerRect.top;

    let scrollPercentage = distancePassed / containerHeight;
    scrollPercentage = Math.min(Math.max(scrollPercentage, 0), 1);

    if (motionQuery.matches) {
      timelineActiveLine.style.height = '100%';
      timelineItems.forEach(item => item.classList.add('active'));
    } else {
      timelineActiveLine.style.height = `${scrollPercentage * 100}%`;

      timelineItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < triggerOffset) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', drawTimelineLine);
  window.addEventListener('resize', drawTimelineLine);

  /* -----------------------------------------------------------
     ACHIEVEMENTS STAT COUNT UP
     ----------------------------------------------------------- */
  const achievementsSection = document.getElementById('achievements');
  const counters = document.querySelectorAll('.counter');
  let statsCounted = false;

  const runCountUp = (counter) => {
    const targetVal = parseInt(counter.getAttribute('data-target'), 10);
    if (isNaN(targetVal)) return;

    if (motionQuery.matches) {
      counter.textContent = targetVal;
      return;
    }

    const countDuration = 1800; // Total count duration in ms
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(countDuration / frameRate);
    let currentFrame = 0;

    const animateCounter = () => {
      currentFrame++;
      const progress = currentFrame / totalFrames;

      // Easing easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentVal = Math.floor(easedProgress * targetVal);

      counter.textContent = currentVal;

      if (currentFrame < totalFrames) {
        requestAnimationFrame(animateCounter);
      } else {
        counter.textContent = targetVal;
      }
    };

    requestAnimationFrame(animateCounter);
  };

  const achievementsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        counters.forEach(c => runCountUp(c));
      }
    });
  }, { threshold: 0.2 });

  if (achievementsSection) {
    achievementsObserver.observe(achievementsSection);
  }

  /* -----------------------------------------------------------
     GLOBAL SOFT GLOW CUSTOM CURSOR
     ----------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursor-glow');

  if (cursorGlow && !motionQuery.matches) {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const updateGlowPosition = () => {
      // LERP tracking factor for lag/smoothing
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;

      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;

      requestAnimationFrame(updateGlowPosition);
    };

    requestAnimationFrame(updateGlowPosition);

    // Expand glow on hovering interactive objects
    const clickables = document.querySelectorAll('a, button, .project-card-container, .timeline-content, .achievement-card, input, textarea');
    clickables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '550px';
        cursorGlow.style.height = '550px';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(0, 212, 255, 0.12) 0%, rgba(0, 212, 255, 0) 70%)';
      });

      item.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '400px';
        cursorGlow.style.height = '400px';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, rgba(0, 212, 255, 0) 70%)';
      });
    });
  }

  /* -----------------------------------------------------------
     CONTACT FORM REAL SUBMISSION (WEB3FORMS API)
     ----------------------------------------------------------- */
  // Paste your Web3Forms access key here. Get one for free from https://web3forms.com/
  const WEB3FORMS_ACCESS_KEY = "f90d42fd-48a6-4a26-867e-f1ffeb100544";

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      // Hide previous status message
      formStatus.style.display = 'none';
      formStatus.className = 'form-status';

      // Simple email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill out all required fields.';
        formStatus.classList.add('error');
        formStatus.style.display = 'block';
        return;
      }

      if (!emailRegex.test(email)) {
        formStatus.textContent = 'Please provide a valid email address.';
        formStatus.classList.add('error');
        formStatus.style.display = 'block';
        return;
      }

      // If the developer key is not set yet, fallback to simulation alert so the site doesn't break
      if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
        formStatus.innerHTML = 'Form Submission Simulator: To receive emails in Gmail, please obtain an Access Key from <a href="https://web3forms.com/" target="_blank" style="text-decoration: underline; color: inherit;">Web3Forms</a> and paste it into the <code>WEB3FORMS_ACCESS_KEY</code> variable in <code>script.js</code>.';
        formStatus.classList.add('error');
        formStatus.style.display = 'block';
        return;
      }

      // Disable button and start submission
      const submitBtn = contactForm.querySelector('.submit-btn');
      const btnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending... <span class="spinner"></span>';
      submitBtn.disabled = true;

      // Real submission to Web3Forms API
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: name,
          email: email,
          message: message,
          from_name: 'Portfolio Contact Form',
          subject: 'New Message from ' + name + ' on Portfolio'
        })
      })
        .then(async (response) => {
          const json = await response.json();
          if (response.status === 200) {
            formStatus.textContent = 'Thank you! Your message has been sent successfully.';
            formStatus.classList.add('success');
            contactForm.reset();
          } else {
            console.error(json);
            formStatus.textContent = json.message || 'Something went wrong. Please try again.';
            formStatus.classList.add('error');
          }
        })
        .catch(error => {
          console.error(error);
          formStatus.textContent = 'Network error. Please check your connection and try again.';
          formStatus.classList.add('error');
        })
        .then(() => {
          formStatus.style.display = 'block';
          submitBtn.innerHTML = btnText;
          submitBtn.disabled = false;

          // Automatically hide status banner after a delay
          setTimeout(() => {
            formStatus.style.display = 'none';
          }, 8000);
        });
    });
  }
});