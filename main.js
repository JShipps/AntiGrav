/**
 * GRAVITAS // Principles of Anti-Gravity Website Controller
 * Includes ambient canvas, gravity mode switcher, audio feedback, and harmonic visualizer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Ambient Canvas (Levitating Dust & Upward Drift)
  initAmbientCanvas();

  // 2. Initialize Zero-G Physics Chamber
  const chamber = new window.PhysicsChamber('physics-canvas');

  // 3. Initialize Global Gravity Switcher
  initGravityController(chamber);

  // 4. Initialize Harmonic Frequency Visualizer
  initHarmonicVisualizer();

  // 5. Initialize 3D Card Hover Tilt
  init3DCardTilt();

  // 6. Navigation Scrollspy & Floating Navbar
  initNavbarScroll();

  // 7. Interactive Form Toast Feedback
  initFormInteractions();
});

/* ==========================================================================
   Ambient Background Canvas (Upward Floating Quantum Dust)
   ========================================================================== */
let ambientSpeedMultiplier = 1;
let ambientDirection = -1; // -1 = upward (anti-gravity)

function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(80, Math.floor(window.innerWidth / 18));
  const particles = [];

  const mouse = { x: -1000, y: -1000, radius: 120 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 2.5,
      baseVy: 0.2 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 0,
      alpha: 0.2 + Math.random() * 0.6,
      hue: Math.random() > 0.3 ? 185 : 270 // Cyan or Violet
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Vertical drift governed by ambientDirection & ambientSpeedMultiplier
      p.vy = ambientDirection * p.baseVy * ambientSpeedMultiplier;

      // Mouse repulsion / spatial distortion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);

      if (dist < mouse.radius && dist > 0) {
        const force = (1 - dist / mouse.radius) * 2;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around viewport edges
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.hue === 185
        ? `rgba(0, 240, 255, ${p.alpha})`
        : `rgba(142, 45, 226, ${p.alpha * 0.8})`;
      ctx.shadowBlur = p.size * 3;
      ctx.shadowColor = p.hue === 185 ? '#00f0ff' : '#8e2de2';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   Web Audio API Synthesizer (Sci-Fi Sound FX)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function playSciFiChime(type) {
  if (!soundEnabled) return;

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    const now = audioCtx.currentTime;

    if (type === 'anti') {
      // Ascending frequency sweep (anti-gravity lift)
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    } else if (type === 'zero') {
      // Ethereal chord shimmer
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.4);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    } else if (type === 'lunar') {
      // Gentle floating tone
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    } else {
      // Standard Earth ground tone
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    }

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  } catch (err) {
    console.warn('Audio not supported or blocked:', err);
  }
}

/* ==========================================================================
   Global Gravity Controller
   ========================================================================== */
function initGravityController(chamberInstance) {
  const dockPills = document.querySelectorAll('.dock-pill-btn');
  const telemetryNetMass = document.getElementById('hero-net-mass');
  const telemetryCurvature = document.getElementById('hero-curvature');
  const telemetryStability = document.getElementById('hero-field-stab');
  const chamberSlider = document.getElementById('chamber-gravity-slider');
  const soundBtn = document.getElementById('dock-sound-btn');

  // Sound toggle button
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.classList.toggle('active', soundEnabled);
      soundBtn.innerHTML = soundEnabled
        ? '<i class="bi bi-volume-up-fill"></i>'
        : '<i class="bi bi-volume-mute-fill"></i>';
      if (soundEnabled) playSciFiChime('zero');
    });
  }

  // Handle Gravity Mode Selection
  function setGravityMode(mode) {
    document.body.classList.remove('gravity-normal', 'gravity-lunar', 'gravity-zero', 'gravity-anti', 'gravity-quantum');
    document.body.classList.add(`gravity-${mode}`);

    dockPills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-gravity') === mode);
    });

    switch (mode) {
      case 'normal':
        ambientDirection = 1; // downward pull
        ambientSpeedMultiplier = 0.8;
        if (chamberInstance) chamberInstance.setGravity(1.0);
        if (chamberSlider) chamberSlider.value = 1.0;
        if (telemetryNetMass) telemetryNetMass.textContent = '100% (Earth G)';
        if (telemetryCurvature) telemetryCurvature.textContent = 'Standard';
        if (telemetryStability) telemetryStability.textContent = 'Nominal (1.00)';
        playSciFiChime('normal');
        break;

      case 'lunar':
        ambientDirection = -1;
        ambientSpeedMultiplier = 0.5;
        if (chamberInstance) chamberInstance.setGravity(0.16);
        if (chamberSlider) chamberSlider.value = 0.16;
        if (telemetryNetMass) telemetryNetMass.textContent = '16.5% Net Mass';
        if (telemetryCurvature) telemetryCurvature.textContent = 'Low-Tensor';
        if (telemetryStability) telemetryStability.textContent = 'Stable 99.4%';
        playSciFiChime('lunar');
        break;

      case 'zero':
        ambientDirection = -1;
        ambientSpeedMultiplier = 0.9;
        if (chamberInstance) chamberInstance.setGravity(0.0);
        if (chamberSlider) chamberSlider.value = 0.0;
        if (telemetryNetMass) telemetryNetMass.textContent = '0.00 kg (Weightless)';
        if (telemetryCurvature) telemetryCurvature.textContent = 'Zero-G Flat';
        if (telemetryStability) telemetryStability.textContent = 'Perfect 100%';
        playSciFiChime('zero');
        break;

      case 'anti':
        ambientDirection = -1; // Strong upward levitation
        ambientSpeedMultiplier = 2.4;
        if (chamberInstance) chamberInstance.setGravity(-1.0);
        if (chamberSlider) chamberSlider.value = -1.0;
        if (telemetryNetMass) telemetryNetMass.textContent = '-100% (Inverted)';
        if (telemetryCurvature) telemetryCurvature.textContent = 'Inverse Metric';
        if (telemetryStability) telemetryStability.textContent = 'Exotic Active';
        playSciFiChime('anti');
        break;

      case 'quantum':
        ambientDirection = -1;
        ambientSpeedMultiplier = 1.4;
        if (chamberInstance) chamberInstance.setGravity(-0.35);
        if (chamberSlider) chamberSlider.value = -0.35;
        if (telemetryNetMass) telemetryNetMass.textContent = 'Oscillating';
        if (telemetryCurvature) telemetryCurvature.textContent = 'Casimir Flux';
        if (telemetryStability) telemetryStability.textContent = 'Fluctuating';
        playSciFiChime('anti');
        break;
    }
  }

  dockPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const mode = pill.getAttribute('data-gravity');
      setGravityMode(mode);
    });
  });

  // Sync Chamber Slider with Global
  if (chamberSlider && chamberInstance) {
    chamberSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      chamberInstance.setGravity(val);
      if (val === 0) setGravityMode('zero');
      else if (val < 0) {
        ambientDirection = -1;
        ambientSpeedMultiplier = Math.abs(val) * 2;
      } else {
        ambientDirection = 1;
        ambientSpeedMultiplier = val * 0.8;
      }
    });
  }

  // Interactive Chamber Control Buttons
  const btnPinning = document.getElementById('btn-toggle-pinning');
  const btnVortex = document.getElementById('btn-toggle-vortex');
  const btnSpawn = document.getElementById('btn-spawn-entity');
  const btnReset = document.getElementById('btn-reset-chamber');

  if (btnPinning && chamberInstance) {
    let pinningState = true;
    btnPinning.addEventListener('click', () => {
      pinningState = !pinningState;
      chamberInstance.togglePinning(pinningState);
      btnPinning.classList.toggle('active', pinningState);
      btnPinning.innerHTML = pinningState
        ? '<i class="bi bi-magnet-fill me-1"></i> Flux Lock: ON'
        : '<i class="bi bi-magnet me-1"></i> Flux Lock: OFF';
    });
  }

  if (btnVortex && chamberInstance) {
    let vortexState = false;
    btnVortex.addEventListener('click', () => {
      vortexState = !vortexState;
      chamberInstance.toggleVortex(vortexState);
      btnVortex.classList.toggle('active', vortexState);
      btnVortex.innerHTML = vortexState
        ? '<i class="bi bi-arrow-repeat me-1"></i> Vortex: ACTIVE'
        : '<i class="bi bi-arrow-repeat me-1"></i> Vortex: OFF';
    });
  }

  if (btnSpawn && chamberInstance) {
    btnSpawn.addEventListener('click', () => {
      chamberInstance.spawnRandom();
      playSciFiChime('lunar');
    });
  }

  if (btnReset && chamberInstance) {
    btnReset.addEventListener('click', () => {
      chamberInstance.spawnPreset();
      setGravityMode('zero');
    });
  }
}

/* ==========================================================================
   Harmonic Frequency Visualizer (Spacetime Waveform Tuner)
   ========================================================================== */
function initHarmonicVisualizer() {
  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = canvas.parentElement.clientWidth);
  let height = (canvas.height = 220);

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = 220;
  });

  const phaseSlider = document.getElementById('wave-phase-slider');
  const ampSlider = document.getElementById('wave-amp-slider');
  const freqSlider = document.getElementById('wave-freq-slider');
  const readoutEfficiency = document.getElementById('cancellation-efficiency');

  let phaseOffset = 180; // degrees
  let ampValue = 1.0;
  let freqValue = 9.81;
  let time = 0;

  if (phaseSlider) {
    phaseSlider.addEventListener('input', (e) => {
      phaseOffset = parseFloat(e.target.value);
      const span = document.getElementById('wave-phase-val');
      if (span) span.textContent = `${phaseOffset}°`;
      updateEfficiency();
    });
  }

  if (ampSlider) {
    ampSlider.addEventListener('input', (e) => {
      ampValue = parseFloat(e.target.value);
      const span = document.getElementById('wave-amp-val');
      if (span) span.textContent = `${ampValue.toFixed(2)}x`;
      updateEfficiency();
    });
  }

  if (freqSlider) {
    freqSlider.addEventListener('input', (e) => {
      freqValue = parseFloat(e.target.value);
      const span = document.getElementById('wave-freq-val');
      if (span) span.textContent = `${freqValue.toFixed(1)} Hz`;
    });
  }

  function updateEfficiency() {
    const phaseDiff = Math.abs(phaseOffset - 180);
    const ampDiff = Math.abs(ampValue - 1.0);
    const eff = Math.max(0, 100 - (phaseDiff * 0.45 + ampDiff * 45));
    if (readoutEfficiency) {
      readoutEfficiency.textContent = `${eff.toFixed(1)}%`;
      readoutEfficiency.style.color = eff > 85 ? 'var(--emerald)' : (eff > 50 ? 'var(--cyan)' : 'var(--rose)');
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const midY = height / 2;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    const radPhase = (phaseOffset * Math.PI) / 180;
    const waveScale = 38;

    // 1. Earth Gravity Baseline Wave (Red)
    ctx.strokeStyle = 'rgba(255, 90, 95, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const angle = (x / width) * Math.PI * 4 * (freqValue / 9.81) + time;
      const y = midY + Math.sin(angle) * waveScale;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Anti-Phase Wave (Violet)
    ctx.strokeStyle = 'rgba(142, 45, 226, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const angle = (x / width) * Math.PI * 4 * (freqValue / 9.81) + time + radPhase;
      const y = midY + Math.sin(angle) * (waveScale * ampValue);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. Resultant Synthesized Field (Cyan)
    ctx.strokeStyle = 'var(--cyan)';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f0ff';
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const angle1 = (x / width) * Math.PI * 4 * (freqValue / 9.81) + time;
      const angle2 = angle1 + radPhase;
      const yEarth = Math.sin(angle1) * waveScale;
      const yAnti = Math.sin(angle2) * (waveScale * ampValue);
      const yResult = midY + (yEarth + yAnti);

      if (x === 0) ctx.moveTo(x, yResult);
      else ctx.lineTo(x, yResult);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    time += 0.04;
    requestAnimationFrame(draw);
  }

  draw();
  updateEfficiency();
}

/* ==========================================================================
   3D Card Hover Tilt Effect
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.principle-card, .tilt-effect');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================================
   Navbar Scrollspy & Sticky Styling
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-custom');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-custom');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Form Handling & Futuristic Feedback Toasts
   ========================================================================== */
function initFormInteractions() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> TRANSMITTING ENCRYPTED TELEMETRY...';

    setTimeout(() => {
      btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i> TELEMETRY DISPATCHED';
      btn.classList.add('btn-gravitas-glow');
      form.reset();

      const toastEl = document.getElementById('telemetry-toast');
      if (toastEl && window.bootstrap) {
        const toast = new window.bootstrap.Toast(toastEl);
        toast.show();
      }

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.classList.remove('btn-gravitas-glow');
      }, 4000);
    }, 1200);
  });
}
