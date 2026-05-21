/* ============================================================
   PORTFOLIO — Premium Interactive JavaScript
   Pure vanilla ES6+ · Optimized for GSAP + Lenis Integration
   ============================================================ */

function _initPortfolio() {
  'use strict';

  /* ----------------------------------------------------------
     UTILITY HELPERS
  ---------------------------------------------------------- */

  /** Linear interpolation */
  const lerp = (a, b, t) => a + (b - a) * t;

  /** Clamp value between min and max */
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  /** Detect touch-primary device */
  const isTouchDevice = () =>
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches;

  /** Safe querySelector — returns null without throwing */
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /** easeOutQuart easing function */
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  /* ==========================================================
     2. CUSTOM CURSOR
  ========================================================== */
  (() => {
    if (isTouchDevice()) return;

    const dot = qs('.cursor-dot');
    const ring = qs('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    const INTERACTIVE =
      'a, button, .project-card, .skill-card, .nav-link, .btn-primary, .btn-secondary, .theme-toggle';

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Hover class management
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(INTERACTIVE)) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(INTERACTIVE)) ring.classList.remove('hover');
    });

    function updateCursor() {
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

      ringX = lerp(ringX, mouseX, 0.15);
      ringY = lerp(ringY, mouseY, 0.15);
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

      requestAnimationFrame(updateCursor);
    }

    requestAnimationFrame(updateCursor);
  })();

  /* ==========================================================
     3. SMOOTH SCROLL NAVIGATION + ACTIVE STATE
  ========================================================== */
  (() => {
    const navLinks = qsa('.nav-link');
    const sections = qsa('section[id]');
    if (!navLinks.length || !sections.length) return;

    // Smooth-scroll on click via Lenis (globally exposed)
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = qs(targetId);
        if (!target) return;

        if (window.lenis) {
          window.lenis.scrollTo(targetId, {
            duration: 1.2,
            force: true,
          });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Active state via IntersectionObserver
    const setActive = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${id}`
        );
      });
    };

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((sec) => navObserver.observe(sec));
  })();

  /* ==========================================================
     4. TYPING / ROTATING TEXT — .hero-roles
  ========================================================== */
  (() => {
    const container = qs('.hero-roles');
    if (!container) return;

    const roles = [
      'Full Stack Developer',
      'AI System Builder',
      'Creative Frontend Engineer',
      'Problem Solver',
      'Tech Innovator',
    ];

    let currentIndex = 0;

    function createRoleElement(text) {
      const el = document.createElement('span');
      el.classList.add('role-text');
      el.textContent = text;
      return el;
    }

    function rotateRole() {
      const current = qs('.role-text', container);

      // Slide current text up & out
      if (current) {
        current.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        current.style.transform = 'translateY(-100%)';
        current.style.opacity = '0';

        current.addEventListener(
          'transitionend',
          () => current.remove(),
          { once: true }
        );
      }

      // Advance index
      currentIndex = (currentIndex + 1) % roles.length;

      // Create new role text and slide it in
      const next = createRoleElement(roles[currentIndex]);
      next.style.transform = 'translateY(100%)';
      next.style.opacity = '0';
      container.appendChild(next);

      // Force reflow then animate in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          next.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
          next.style.transform = 'translateY(0)';
          next.style.opacity = '1';
        });
      });
    }

    // Initialise with first role already visible
    const initial = createRoleElement(roles[0]);
    initial.style.transform = 'translateY(0)';
    initial.style.opacity = '1';
    container.appendChild(initial);

    setInterval(rotateRole, 3000);
  })();

  /* ==========================================================
     5. 3D TILT EFFECT — .hero-image-wrapper (GSAP Decoupled)
  ========================================================== */
  (() => {
    const wrapper = qs('.hero-image-wrapper');
    if (!wrapper || typeof gsap === 'undefined') return;

    const MAX_ROT = 8; // degrees

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = (e.clientX - cx) / (rect.width / 2);   // -1 … 1
      const dy = (e.clientY - cy) / (rect.height / 2);   // -1 … 1

      const rotY = clamp(dx * MAX_ROT, -MAX_ROT, MAX_ROT);
      const rotX = clamp(-dy * MAX_ROT, -MAX_ROT, MAX_ROT);

      gsap.to(wrapper, {
        rotationX: rotX,
        rotationY: rotY,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    wrapper.addEventListener('mouseleave', () => {
      gsap.to(wrapper, {
        rotationX: 0,
        rotationY: 0,
        transformPerspective: 1000,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  })();

  /* ==========================================================
     6. PARTICLE SYSTEM — canvas inside .hero-visual
  ========================================================== */
  (() => {
    const heroVisual = qs('.hero-visual');
    if (!heroVisual) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    heroVisual.style.position = heroVisual.style.position || 'relative';
    heroVisual.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const COLORS = ['#A855F7', '#3B82F6', '#EC4899', '#00F0FF'];
    const PARTICLE_COUNT = 60;
    const CONNECT_DIST = 100;

    let W, H;
    let particles = [];

    function resize() {
      W = canvas.width = heroVisual.offsetWidth;
      H = canvas.height = heroVisual.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: 1 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.2 + Math.random() * 0.5),       // float upward
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const opacity = 1 - dist / CONNECT_DIST;
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity * 0.35})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Read particle boost from CSS variable (set by scroll-effects.js)
      const boost = parseFloat(getComputedStyle(canvas).getPropertyValue('--particle-boost')) || 0;

      // Particles
      particles.forEach((p) => {
        // Boost speed on scroll speed
        p.x += p.vx * (1 + boost * 0.5);
        p.y += p.vy * (1 + boost * 0.8);

        // Wrap around
        if (p.y + p.r < 0) p.y = H + p.r;
        if (p.y - p.r > H) p.y = -p.r;
        if (p.x + p.r < 0) p.x = W + p.r;
        if (p.x - p.r > W) p.x = -p.r;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    init();
    requestAnimationFrame(draw);
  })();

  /* ==========================================================
     7. ANIMATED COUNTERS — .stat-number[data-count]
  ========================================================== */
  (() => {
    const stats = qsa('.stat-number[data-count]');
    if (!stats.length) return;

    function animateCounter(el) {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;

      const DURATION = 2000;
      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / DURATION, 1);
        const eased = easeOutQuart(progress);

        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + (target === 100 ? '%' : '+');
        }
      }

      requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    stats.forEach((el) => counterObserver.observe(el));
  })();

  /* ==========================================================
     8. MAGNETIC BUTTON EFFECT
  ========================================================== */
  (() => {
    const buttons = qsa('.btn-primary, .btn-secondary');
    if (!buttons.length) return;

    const MAX_OFFSET = 5; // px

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = ((e.clientX - cx) / (rect.width / 2)) * MAX_OFFSET;
        const dy = ((e.clientY - cy) / (rect.height / 2)) * MAX_OFFSET;

        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.35s ease-out';
        btn.style.transform = 'translate(0, 0)';
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease-out';
      });
    });
  })();

  /* ==========================================================
     9. PROJECT CARD 3D TILT + GLOW (GSAP Decoupled)
  ========================================================== */
  (() => {
    const cards = qsa('.project-card');
    if (!cards.length || typeof gsap === 'undefined') return;

    const MAX_ROT = 5; // lighter tilt

    cards.forEach((card) => {
      card.style.position = card.style.position || 'relative';
      card.style.overflow = 'hidden';

      // Create glow overlay
      const glow = document.createElement('div');
      glow.classList.add('project-card-glow');
      glow.style.cssText = `
        position:absolute;inset:0;pointer-events:none;opacity:0;
        transition:opacity 0.3s ease;border-radius:inherit;z-index:1;
      `;
      card.appendChild(glow);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        const rotY = clamp(dx * MAX_ROT, -MAX_ROT, MAX_ROT);
        const rotX = clamp(-dy * MAX_ROT, -MAX_ROT, MAX_ROT);

        gsap.to(card, {
          rotationX: rotX,
          rotationY: rotY,
          scale: 1.02,
          transformPerspective: 800,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        // Dynamic gradient overlay based on cursor position
        const pctX = ((e.clientX - rect.left) / rect.width) * 100;
        const pctY = ((e.clientY - rect.top) / rect.height) * 100;

        glow.style.background =
          `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(168,85,247,0.2) 0%, transparent 60%)`;
        glow.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          transformPerspective: 800,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        glow.style.opacity = '0';
      });
    });
  })();

  /* ==========================================================
     10. CONTACT FORM — validation + ripple
  ========================================================== */
  (() => {
    const form = qs('form');
    const submitBtn = qs('.btn-submit');
    if (!form) return;

    // Ripple effect on submit button
    if (submitBtn) {
      submitBtn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);

        ripple.style.cssText = `
          position:absolute;border-radius:50%;
          background:rgba(255,255,255,0.35);
          width:${size}px;height:${size}px;
          left:${e.clientX - rect.left - size / 2}px;
          top:${e.clientY - rect.top - size / 2}px;
          transform:scale(0);animation:ripple-anim 0.6s ease-out forwards;
          pointer-events:none;
        `;

        this.style.position = this.style.position || 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        ripple.addEventListener('animationend', () => ripple.remove());
      });

      // Inject ripple keyframes if not present
      if (!qs('#ripple-keyframes')) {
        const style = document.createElement('style');
        style.id = 'ripple-keyframes';
        style.textContent = `
          @keyframes ripple-anim {
            to { transform: scale(4); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = qsa('.form-input, .form-textarea', form);
      let valid = true;

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          valid = false;
          input.classList.add('error');
          input.addEventListener(
            'input',
            () => input.classList.remove('error'),
            { once: true }
          );
        }
      });

      if (!valid) return;

      // Animated success message
      let msg = qs('.form-success', form);
      if (!msg) {
        msg = document.createElement('div');
        msg.classList.add('form-success');
        msg.style.cssText = `
          padding:1rem;margin-top:1rem;border-radius:0.5rem;
          background:rgba(168,85,247,0.15);color:#A855F7;
          text-align:center;font-weight:600;
          opacity:0;transform:translateY(10px);
          transition:opacity 0.4s ease,transform 0.4s ease;
        `;
        form.appendChild(msg);
      }

      msg.textContent = '🎉 Message sent successfully!';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          msg.style.opacity = '1';
          msg.style.transform = 'translateY(0)';
        });
      });

      // Clear fields
      inputs.forEach((input) => (input.value = ''));

      // Fade success out after 4 seconds
      setTimeout(() => {
        msg.style.opacity = '0';
        msg.style.transform = 'translateY(10px)';
      }, 4000);
    });
  })();

  /* ==========================================================
     11. THEME TOGGLE — light / dark
  ========================================================== */
  (() => {
    const toggle = qs('.theme-toggle');
    const themeIcon = qs('.theme-icon');
    if (!toggle) return;

    const STORAGE_KEY = 'portfolio-theme';

    // Restore saved preference
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light') {
      document.body.classList.add('light-theme');
      if (themeIcon) themeIcon.textContent = '☀️';
    } else {
      if (themeIcon) themeIcon.textContent = '🌙';
    }

    toggle.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      if (themeIcon) themeIcon.textContent = isLight ? '☀️' : '🌙';
      localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
    });
  })();

  /* ==========================================================
     12. EXPERIENCE CARD HOVER LIFT (GSAP Decoupled)
  ========================================================== */
  (() => {
    const cards = qsa('.experience-card');
    if (!cards.length || typeof gsap === 'undefined') return;

    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -6,
          boxShadow: '0 12px 40px rgba(168,85,247,0.15)',
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          boxShadow: '0px 0px 0px rgba(0,0,0,0)',
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });
  })();

  /* ==========================================================
     13. SKILL CARD HOVER TILT (GSAP Decoupled)
  ========================================================== */
  (() => {
    const cards = qsa('.skill-card');
    if (!cards.length || typeof gsap === 'undefined') return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

        gsap.to(card, {
          rotationX: -dy * 4,
          rotationY: dx * 4,
          scale: 1.03,
          transformPerspective: 600,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          transformPerspective: 600,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });
  })();

  // Safety net: ensure all .reveal elements become visible
  // even if scroll-effects.js fails to initialize
  setTimeout(() => {
    qsa('.reveal').forEach(el => {
      if (!el.classList.contains('active')) {
        el.classList.add('active');
      }
    });
  }, 3000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initPortfolio);
} else {
  _initPortfolio();
}
