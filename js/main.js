(function () {
  'use strict';

  /* ── Particle canvas ── */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  const COUNT = 80;
  const CONNECT_DIST = 140;
  const MOUSE = { x: null, y: null, radius: 180 };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.r = Math.random() * 2 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;

      if (MOUSE.x !== null) {
        const dx = this.x - MOUSE.x;
        const dy = this.y - MOUSE.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE.radius) {
          const force = (MOUSE.radius - dist) / MOUSE.radius;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(110, 231, 255, 0.5)';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(110, 231, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  window.addEventListener('mousemove', e => {
    MOUSE.x = e.clientX;
    MOUSE.y = e.clientY;
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
  });
  resize();
  initParticles();
  animate();

  /* ── Typing effect ── */
  const phrases = [
    'Full-Stack Developer',
    'Open Source Enthusiast',
    'Problem Solver',
    'Code Architect',
    'Digital Explorer'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const typedEl = document.getElementById('typed');

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
  }
  typeLoop();

  /* ── Scroll reveal ── */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach(el => observer.observe(el));

  /* ── Skill bars animation ── */
  const skillObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.fill').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

  /* ── Counter animation ── */
  const statObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const duration = 1500;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          }
          requestAnimationFrame(tick);
          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

  /* ── Mobile nav ── */
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  toggle.addEventListener('click', () => nav.classList.toggle('open'));

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  /* ── Smooth active nav highlight on scroll ── */
  const sections = document.querySelectorAll('section[id], .hero');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    document.querySelectorAll('.nav-links a').forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      if (section && scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        link.style.color = 'var(--accent)';
      } else {
        link.style.color = '';
      }
    });
  });
})();
