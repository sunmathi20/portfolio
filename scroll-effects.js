/* ============================================================
   CINEMATIC SCROLL EXPERIENCE
   Lenis + GSAP ScrollTrigger — Premium Motion System
   ============================================================ */

function _initCinematicScroll() {
  'use strict';

  /* ----------------------------------------------------------
     GUARD: Ensure GSAP & Lenis loaded
  ---------------------------------------------------------- */
  if (typeof gsap === 'undefined' || typeof Lenis === 'undefined') {
    console.warn('GSAP or Lenis not loaded — scroll effects disabled.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ==========================================================
     1. LENIS SMOOTH SCROLL — Ultra Buttery Inertia
  ========================================================== */
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.5,
  });

  // Expose lenis globally for smooth navigation integration
  window.lenis = lenis;

  // Connect Lenis → GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Signal to CSS that GSAP is managing animations
  document.documentElement.classList.add('lenis', 'lenis-smooth', 'gsap-active');

  /* ==========================================================
     2. SCROLL VELOCITY TRACKER
  ========================================================== */
  let scrollVelocity = 0;
  let scrollDirection = 1;

  lenis.on('scroll', ({ velocity, direction }) => {
    scrollVelocity = Math.abs(velocity);
    scrollDirection = direction;
  });

  /* ==========================================================
     3. BACKGROUND MORPHING — Gradients morph on scroll
  ========================================================== */
  const blobs = document.querySelectorAll('.gradient-blob');

  blobs.forEach((blob, i) => {
    const speed = [0.15, -0.1, 0.08, -0.12][i] || 0.1;
    const rotSpeed = [15, -20, 10, -8][i] || 10;

    gsap.to(blob, {
      y: () => speed * ScrollTrigger.maxScroll(window),
      rotation: rotSpeed,
      scale: 1.15,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    });

    // Color morphing per blob
    const hueShift = [30, -40, 50, -25][i] || 20;
    gsap.to(blob, {
      filter: `hue-rotate(${hueShift}deg) blur(80px)`,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      }
    });
  });

  // Mesh overlay parallax
  const mesh = document.querySelector('.mesh-overlay');
  if (mesh) {
    gsap.to(mesh, {
      backgroundPosition: '50px 100px',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 3,
      }
    });
  }

  /* ==========================================================
     4. SECTION CINEMATIC ENTRIES — blur → focus + float
  ========================================================== */
  const sections = document.querySelectorAll('.section');

  sections.forEach((section) => {
    // Skip hero — it's visible by default
    if (section.id === 'hero') return;

    gsap.set(section, {
      opacity: 0.3,
      filter: 'blur(6px)',
      y: 60,
      scale: 0.97,
    });

    gsap.to(section, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'top 30%',
        scrub: 0.8,
      }
    });
  });

  /* ==========================================================
     5. SECTION HEADERS — Cinematic text reveal
  ========================================================== */
  document.querySelectorAll('.section-header').forEach((header) => {
    const label = header.querySelector('.section-label');
    const title = header.querySelector('.section-title');

    if (label) {
      gsap.from(label, {
        letterSpacing: '12px',
        opacity: 0,
        filter: 'blur(4px)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    if (title) {
      gsap.from(title, {
        y: 40,
        opacity: 0,
        filter: 'blur(8px)',
        scale: 0.92,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    }
  });

  /* ==========================================================
     6. HERO SCROLL — Cinematic camera movement
  ========================================================== */
  const heroSection = document.querySelector('#hero');
  const heroText = document.querySelector('.hero-text');
  const heroVisual = document.querySelector('.hero-visual');
  const heroImageWrapper = document.querySelector('.hero-image-wrapper');
  const heroGlow = document.querySelector('.hero-image-glow');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (heroText) {
    gsap.to(heroText, {
      y: -80,
      opacity: 0.2,
      scale: 0.9,
      filter: 'blur(3px)',
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: '60% top',
        scrub: 0.5,
      }
    });
  }

  if (heroVisual) {
    gsap.to(heroVisual, {
      y: -120,
      rotationY: 8,
      rotationX: -5,
      scale: 0.85,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: '70% top',
        scrub: 0.7,
      }
    });
  }

  if (heroGlow) {
    gsap.to(heroGlow, {
      opacity: 0.9,
      filter: 'blur(30px)',
      scale: 1.3,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: '50% top',
        scrub: 1,
      }
    });
  }

  // Floating elements parallax
  document.querySelectorAll('.hero-float-element').forEach((el, i) => {
    gsap.to(el, {
      y: -50 - (i * 20),
      x: (i % 2 === 0 ? 15 : -15),
      rotation: (i % 2 === 0 ? 5 : -5),
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: '60% top',
        scrub: 0.5 + (i * 0.2),
      }
    });
  });

  // Scroll indicator fade
  if (scrollIndicator) {
    gsap.to(scrollIndicator, {
      opacity: 0,
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: '5% top',
        end: '15% top',
        scrub: true,
      }
    });
  }

  /* ==========================================================
     7. ABOUT SECTION — Timeline + Stats animation
  ========================================================== */
  // Stats cards staggered entry
  document.querySelectorAll('.stat-card').forEach((card, i) => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      scale: 0.85,
      filter: 'blur(6px)',
      duration: 0.8,
      delay: i * 0.12,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: card.closest('.about-stats'),
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });
  });

  // Timeline progressive reveal
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      gsap.from(item, {
        x: -40,
        opacity: 0,
        filter: 'blur(4px)',
        duration: 0.9,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      });

      // Glow node activation
      gsap.from(item, {
        '--node-glow': '0',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          onEnter: () => item.classList.add('node-active'),
          onLeaveBack: () => item.classList.remove('node-active'),
        }
      });
    });
  }

  /* ==========================================================
     8. SKILL CARDS — Floating depth + glow activation
  ========================================================== */
  document.querySelectorAll('.skill-card').forEach((card, i) => {
    // Cinematic entry
    gsap.from(card, {
      y: 80,
      opacity: 0,
      scale: 0.8,
      filter: 'blur(8px)',
      rotationX: 15,
      duration: 0.9,
      delay: i * 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card.closest('.skills-grid'),
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });

    // Continuous floating while in view
    gsap.to(card, {
      y: `+=${4 + (i % 3) * 2}`,
      duration: 2 + (i % 3) * 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
      }
    });
  });

  // Skill bars — scroll-linked fill
  document.querySelectorAll('.skill-level-bar[data-level]').forEach((bar) => {
    const level = bar.dataset.level;
    gsap.fromTo(bar,
      { width: '0%' },
      {
        width: `${level}%`,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bar.closest('.skill-card'),
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  });

  /* ==========================================================
     9. PROJECT CARDS — Cinematic blur reveal + depth
  ========================================================== */
  // Featured project
  const featured = document.querySelector('.featured-project');
  if (featured) {
    gsap.from(featured, {
      y: 80,
      opacity: 0,
      filter: 'blur(12px)',
      scale: 0.92,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: featured,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });

    // Screen lines animate in
    featured.querySelectorAll('.screen-line, .screen-block').forEach((line, i) => {
      gsap.from(line, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: 'left center',
        duration: 0.6,
        delay: 0.3 + i * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featured,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        }
      });
    });
  }

  // Project cards
  document.querySelectorAll('.project-card').forEach((card, i) => {
    gsap.from(card, {
      y: 100,
      opacity: 0,
      filter: 'blur(10px)',
      scale: 0.88,
      rotationY: i % 2 === 0 ? -5 : 5,
      duration: 1.1,
      delay: i * 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });

    // Horizontal parallax while scrolling past
    gsap.to(card, {
      x: i % 2 === 0 ? 15 : -15,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  });

  /* ==========================================================
     10. EXPERIENCE CARDS — Layered cinematic entry
  ========================================================== */
  document.querySelectorAll('.experience-card').forEach((card, i) => {
    gsap.from(card, {
      x: -60,
      opacity: 0,
      filter: 'blur(8px)',
      scale: 0.9,
      duration: 1,
      delay: i * 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });

    // Accent bar glow on entry
    gsap.from(card, {
      '--accent-opacity': 0,
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        onEnter: () => card.classList.add('glow-active'),
        onLeaveBack: () => card.classList.remove('glow-active'),
      }
    });
  });

  /* ==========================================================
     11. CONTACT SECTION — Cinematic atmosphere
  ========================================================== */
  const contactSection = document.querySelector('#contact');
  if (contactSection) {
    // Form fields sequential reveal
    contactSection.querySelectorAll('.form-group, .btn-submit').forEach((el, i) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        filter: 'blur(4px)',
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      });
    });

    // Social links float in
    contactSection.querySelectorAll('.social-link').forEach((link, i) => {
      gsap.from(link, {
        y: 30,
        opacity: 0,
        scale: 0.5,
        rotation: -15,
        duration: 0.6,
        delay: 0.4 + i * 0.1,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: link.closest('.social-links'),
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      });
    });

    // Background intensifies at contact
    gsap.to(blobs, {
      opacity: 0.6,
      scale: 1.3,
      ease: 'none',
      scrollTrigger: {
        trigger: contactSection,
        start: 'top 80%',
        end: 'bottom bottom',
        scrub: 2,
      }
    });
  }

  /* ==========================================================
     12. RESUME CARD — Float entry
  ========================================================== */
  const resumeCard = document.querySelector('.resume-card');
  if (resumeCard) {
    gsap.from(resumeCard, {
      y: 50,
      opacity: 0,
      scale: 0.9,
      filter: 'blur(6px)',
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: resumeCard,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });
  }

  /* ==========================================================
     13. SCROLL VELOCITY EFFECTS
  ========================================================== */
  // Velocity-reactive glow on body
  const glowOverlay = document.createElement('div');
  glowOverlay.className = 'scroll-velocity-glow';
  document.body.appendChild(glowOverlay);

  gsap.ticker.add(() => {
    // Decay velocity so effects fade when scrolling stops
    scrollVelocity *= 0.92;
    if (scrollVelocity < 0.01) scrollVelocity = 0;

    const intensity = Math.min(scrollVelocity / 8, 0.3);
    glowOverlay.style.opacity = intensity;

    // Blur streaks during fast scroll
    if (scrollVelocity > 3) {
      document.body.style.setProperty('--scroll-blur', `${Math.min(scrollVelocity * 0.3, 2)}px`);
    } else {
      document.body.style.setProperty('--scroll-blur', '0px');
    }
  });

  /* ==========================================================
     14. DYNAMIC LIGHTING — Glow follows scroll position
  ========================================================== */
  const dynamicGlow = document.createElement('div');
  dynamicGlow.className = 'dynamic-glow-light';
  document.body.appendChild(dynamicGlow);

  gsap.to(dynamicGlow, {
    top: '100%',
    left: '60%',
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2,
    }
  });

  /* ==========================================================
     15. FLOATING PARTICLES — React to scroll speed
  ========================================================== */
  const heroCanvas = document.querySelector('.hero-visual canvas');
  if (heroCanvas) {
    // Boost particle speed during scroll
    lenis.on('scroll', () => {
      heroCanvas.style.setProperty('--particle-boost', Math.min(scrollVelocity, 5));
    });
  }

  /* ==========================================================
     16. NAVBAR — Scroll-linked background
  ========================================================== */
  const navBar = document.querySelector('.nav-bar');
  if (navBar) {
    ScrollTrigger.create({
      start: 50,
      onUpdate: (self) => {
        if (self.scroll() > 50) {
          navBar.classList.add('scrolled');
        } else {
          navBar.classList.remove('scrolled');
        }
      }
    });
  }

  /* ==========================================================
     17. MINI STATS — Counter animation on scroll
  ========================================================== */
  document.querySelectorAll('.mini-stat-num').forEach((num) => {
    gsap.from(num, {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)',
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: num,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      }
    });
  });

  /* ==========================================================
     18. ABOUT TEXT — Paragraph soft reveal
  ========================================================== */
  document.querySelectorAll('.about-text').forEach((p, i) => {
    gsap.from(p, {
      y: 30,
      opacity: 0,
      filter: 'blur(3px)',
      duration: 1,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: p,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });
  });

  /* ==========================================================
     19. HERO BADGE + CTA — Stagger entry
  ========================================================== */
  const heroBadge = document.querySelector('.hero-badge');
  const heroName = document.querySelector('.hero-name');
  const heroRoles = document.querySelector('.hero-roles');
  const heroDesc = document.querySelector('.hero-description');
  const heroCta = document.querySelector('.hero-cta');
  const heroStats = document.querySelector('.hero-stats-mini');

  const heroTimeline = gsap.timeline({ delay: 0.2 });

  if (heroBadge) heroTimeline.from(heroBadge, { y: 20, opacity: 0, filter: 'blur(4px)', duration: 0.7, ease: 'power3.out' });
  if (heroName) heroTimeline.from(heroName, { y: 40, opacity: 0, filter: 'blur(8px)', scale: 0.95, duration: 1, ease: 'power3.out' }, '-=0.4');
  if (heroRoles) heroTimeline.from(heroRoles, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5');
  if (heroDesc) heroTimeline.from(heroDesc, { y: 20, opacity: 0, filter: 'blur(3px)', duration: 0.8, ease: 'power2.out' }, '-=0.3');
  if (heroCta) heroTimeline.from(heroCta, { y: 20, opacity: 0, scale: 0.9, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4');
  if (heroStats) heroTimeline.from(heroStats, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

  // Hero image intro
  if (heroImageWrapper) {
    heroTimeline.from(heroImageWrapper, {
      scale: 0.8,
      opacity: 0,
      rotationY: -15,
      filter: 'blur(10px)',
      duration: 1.2,
      ease: 'power3.out',
    }, 0.3);
  }

  /* ==========================================================
     20. CURSOR GLOW TRAIL
  ========================================================== */
  let lastTrailTime = 0;
  document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastTrailTime < 50) return; // Throttle: max ~20 trails/sec
    lastTrailTime = now;

    const trail = document.createElement('div');
    trail.className = 'cursor-glow-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    document.body.appendChild(trail);

    gsap.to(trail, {
      opacity: 0,
      scale: 2,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => trail.remove(),
    });
  });

  /* ==========================================================
     OVERRIDE: Remove old .reveal system — GSAP handles all
  ========================================================== */
  document.querySelectorAll('.reveal').forEach((el) => {
    el.classList.add('active');
    el.style.opacity = '';
    el.style.transform = '';
  });

  /* ==========================================================
     REFRESH ScrollTrigger after everything is set
  ========================================================== */
  ScrollTrigger.refresh();

  // Also refresh on images loaded
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  console.log('✨ Cinematic scroll experience initialized');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initCinematicScroll);
} else {
  _initCinematicScroll();
}
