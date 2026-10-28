/**
 * GRAVITAS // Interactive Zero-G Physics Chamber
 * Physics engine simulating levitation, variable gravity, magnetic flux pinning, and zero-g inertia.
 */

class PhysicsChamber {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Physics parameters
    this.gravity = 0; // default Zero-G
    this.magneticPinning = true;
    this.vortexActive = false;
    this.friction = 0.985;
    this.bounce = 0.75;
    this.equilibriumY = 0.5; // fractional canvas height for magnetic lock

    // State
    this.particles = [];
    this.draggedEntity = null;
    this.mouse = { x: 0, y: 0, prevX: 0, prevY: 0, vx: 0, vy: 0, isDown: false };
    this.width = 0;
    this.height = 0;
    this.rafId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Populate initial entities
    this.spawnPreset();

    // Mouse & Touch bindings
    this.bindEvents();

    // Start simulation loop
    this.loop();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height || 480;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  spawnPreset() {
    this.particles = [];

    // Core superconducting disc
    this.particles.push(new QuantumEntity({
      x: this.width * 0.5,
      y: this.height * 0.45,
      radius: 36,
      mass: 8,
      type: 'superconductor',
      label: 'YBCO-Flux',
      color: '#00f0ff',
      glowColor: 'rgba(0, 240, 255, 0.6)'
    }));

    // Negative mass sphere
    this.particles.push(new QuantumEntity({
      x: this.width * 0.32,
      y: this.height * 0.55,
      radius: 28,
      mass: -4,
      type: 'negative-mass',
      label: 'Exotic-M',
      color: '#ff2a85',
      glowColor: 'rgba(255, 42, 133, 0.6)'
    }));

    // Casimir dynamic resonator
    this.particles.push(new QuantumEntity({
      x: this.width * 0.68,
      y: this.height * 0.5,
      radius: 26,
      mass: 5,
      type: 'casimir',
      label: 'Casimir-C',
      color: '#00ffa3',
      glowColor: 'rgba(0, 255, 163, 0.6)'
    }));

    // Micro quantum satellites
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const dist = 120 + Math.random() * 40;
      this.particles.push(new QuantumEntity({
        x: this.width * 0.5 + Math.cos(angle) * dist,
        y: this.height * 0.5 + Math.sin(angle) * dist,
        radius: 12 + Math.random() * 8,
        mass: 1.5,
        type: 'orb',
        label: `Orb-${i+1}`,
        color: '#b388ff',
        glowColor: 'rgba(179, 136, 255, 0.5)'
      }));
    }

    this.updateReadout();
  }

  spawnRandom() {
    const types = [
      { type: 'superconductor', color: '#00f0ff', glow: 'rgba(0,240,255,0.6)', label: 'Super-C' },
      { type: 'negative-mass', color: '#ff2a85', glow: 'rgba(255,42,133,0.6)', label: 'Neg-M' },
      { type: 'casimir', color: '#00ffa3', glow: 'rgba(0,255,163,0.6)', label: 'Casimir' },
      { type: 'orb', color: '#ffd166', glow: 'rgba(255,209,102,0.6)', label: 'Aether' }
    ];
    const t = types[Math.floor(Math.random() * types.length)];

    const newEntity = new QuantumEntity({
      x: 60 + Math.random() * (this.width - 120),
      y: 60 + Math.random() * (this.height - 120),
      radius: 16 + Math.random() * 18,
      mass: (Math.random() > 0.3 ? 1 : -1) * (2 + Math.random() * 5),
      type: t.type,
      label: t.label,
      color: t.color,
      glowColor: t.glow
    });

    newEntity.vx = (Math.random() - 0.5) * 6;
    newEntity.vy = (Math.random() - 0.5) * 6;

    this.particles.push(newEntity);
    this.updateReadout();
  }

  bindEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const onDown = (e) => {
      const pos = getPos(e);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      this.mouse.prevX = pos.x;
      this.mouse.prevY = pos.y;
      this.mouse.isDown = true;

      // Find hit entity
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        const dist = Math.hypot(p.x - pos.x, p.y - pos.y);
        if (dist <= p.radius + 10) {
          this.draggedEntity = p;
          p.isGrabbed = true;
          break;
        }
      }
    };

    const onMove = (e) => {
      const pos = getPos(e);
      this.mouse.prevX = this.mouse.x;
      this.mouse.prevY = this.mouse.y;
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      this.mouse.vx = this.mouse.x - this.mouse.prevX;
      this.mouse.vy = this.mouse.y - this.mouse.prevY;

      if (this.draggedEntity) {
        this.draggedEntity.x = pos.x;
        this.draggedEntity.y = pos.y;
        this.draggedEntity.vx = this.mouse.vx * 0.8;
        this.draggedEntity.vy = this.mouse.vy * 0.8;
      }
    };

    const onUp = () => {
      if (this.draggedEntity) {
        this.draggedEntity.isGrabbed = false;
        this.draggedEntity.vx = this.mouse.vx * 1.1;
        this.draggedEntity.vy = this.mouse.vy * 1.1;
        this.draggedEntity = null;
      }
      this.mouse.isDown = false;
    };

    this.canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      onDown(e);
    }, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
  }

  setGravity(val) {
    this.gravity = parseFloat(val);
    const label = document.getElementById('chamber-gravity-val');
    if (label) label.textContent = `${this.gravity.toFixed(2)} G`;
    this.updateReadout();
  }

  togglePinning(active) {
    this.magneticPinning = active;
    this.updateReadout();
  }

  toggleVortex(active) {
    this.vortexActive = active;
    this.updateReadout();
  }

  updateReadout() {
    const elObjects = document.getElementById('chamber-obj-count');
    const elEnergy = document.getElementById('chamber-kinetic-energy');
    const elVector = document.getElementById('chamber-vector');

    if (elObjects) elObjects.textContent = this.particles.length;

    let totalKinetic = 0;
    this.particles.forEach(p => {
      totalKinetic += 0.5 * Math.abs(p.mass) * (p.vx * p.vx + p.vy * p.vy);
    });

    if (elEnergy) elEnergy.textContent = `${Math.round(totalKinetic)} J`;
    if (elVector) {
      if (this.gravity === 0) elVector.textContent = 'WEIGHTLESS (0-G)';
      else if (this.gravity < 0) elVector.textContent = `INVERTED (${this.gravity}G UP)`;
      else elVector.textContent = `DOWNWARD (${this.gravity}G)`;
    }
  }

  loop() {
    this.update();
    this.draw();
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  update() {
    const eqY = this.height * this.equilibriumY;
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.5;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.isGrabbed) continue;

      // 1. Gravity force
      // Scale: 1G = 0.22 acceleration downwards; negative G is upwards!
      p.vy += this.gravity * 0.22;

      // 2. Magnetic Pinning (Meissner Flux Equilibrium)
      if (this.magneticPinning) {
        const distToEq = eqY - p.y;
        // Restoring spring-like magnetic force toward levitation plane
        const magneticForce = distToEq * 0.012;
        p.vy += magneticForce;
      }

      // 3. Spacetime Vortex effect
      if (this.vortexActive) {
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.hypot(dx, dy) || 1;
        const angle = Math.atan2(dy, dx);
        const tangentialForce = 1.2;
        p.vx += -Math.sin(angle) * tangentialForce;
        p.vy += Math.cos(angle) * tangentialForce;
        // slight inward pull
        p.vx -= (dx / dist) * 0.15;
        p.vy -= (dy / dist) * 0.15;
      }

      // 4. Object-Object Repulsion / Interaction (quantum diamagnetic repulsion)
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p2.x - p.x;
        const dy = p2.y - p.y;
        const dist = Math.hypot(dx, dy);
        const minDist = p.radius + p2.radius + 15;

        if (dist < minDist && dist > 0) {
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;

          // Repulsive force
          const force = overlap * 0.08;
          p.vx -= nx * force;
          p.vy -= ny * force;
          p2.vx += nx * force;
          p2.vy += ny * force;
        }
      }

      // 5. Integrate velocity
      p.x += p.vx;
      p.y += p.vy;

      // 6. Natural vacuum drag/friction
      p.vx *= this.friction;
      p.vy *= this.friction;
      p.rotation += p.vRot;

      // 7. Wall boundaries (elastic zero-g bounce)
      if (p.x - p.radius < 0) {
        p.x = p.radius;
        p.vx = -p.vx * this.bounce;
      } else if (p.x + p.radius > this.width) {
        p.x = this.width - p.radius;
        p.vx = -p.vx * this.bounce;
      }

      if (p.y - p.radius < 0) {
        p.y = p.radius;
        p.vy = -p.vy * this.bounce;
      } else if (p.y + p.radius > this.height) {
        p.y = this.height - p.radius;
        p.vy = -p.vy * this.bounce;
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Levitating Equilibrium Line / Magnetic Grid
    if (this.magneticPinning) {
      const eqY = this.height * this.equilibriumY;
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      this.ctx.setLineDash([6, 6]);
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(0, eqY);
      this.ctx.lineTo(this.width, eqY);
      this.ctx.stroke();

      this.ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      this.ctx.font = '10px "JetBrains Mono", monospace';
      this.ctx.fillText('SUPERCONDUCTING FLUX PINNING PLANE', 15, eqY - 8);
      this.ctx.restore();
    }

    // Draw field distortion lines between nearby particles
    this.ctx.save();
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.35;
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.restore();

    // Draw all entities
    this.particles.forEach(p => p.draw(this.ctx));
  }
}

/**
 * Individual Quantum Physics Entity
 */
class QuantumEntity {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.radius = cfg.radius || 24;
    this.mass = cfg.mass || 1;
    this.type = cfg.type || 'orb';
    this.label = cfg.label || 'Entity';
    this.color = cfg.color || '#00f0ff';
    this.glowColor = cfg.glowColor || 'rgba(0, 240, 255, 0.5)';
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.rotation = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 0.03;
    this.isGrabbed = false;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Glowing aura
    const gradient = ctx.createRadialGradient(0, 0, this.radius * 0.2, 0, 0, this.radius * 1.8);
    gradient.addColorStop(0, this.glowColor);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#070f26';
    ctx.fill();
    ctx.lineWidth = this.isGrabbed ? 3 : 2;
    ctx.strokeStyle = this.color;
    ctx.stroke();

    // Geometric detail based on type
    if (this.type === 'superconductor') {
      // Concentric inner ring and crosshairs
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-this.radius * 0.8, 0);
      ctx.lineTo(this.radius * 0.8, 0);
      ctx.moveTo(0, -this.radius * 0.8);
      ctx.lineTo(0, this.radius * 0.8);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.stroke();
    } else if (this.type === 'negative-mass') {
      // Inverted triangle
      ctx.beginPath();
      ctx.moveTo(0, -this.radius * 0.6);
      ctx.lineTo(this.radius * 0.55, this.radius * 0.45);
      ctx.lineTo(-this.radius * 0.55, this.radius * 0.45);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 42, 133, 0.35)';
      ctx.fill();
      ctx.strokeStyle = '#ff2a85';
      ctx.stroke();
    } else if (this.type === 'casimir') {
      // Double parallel plates
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ffa3';
      ctx.strokeRect(-this.radius * 0.5, -this.radius * 0.5, this.radius, this.radius);
    } else {
      // Core dot
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    // Label tag
    ctx.rotate(-this.rotation); // un-rotate label for readability
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.textAlign = 'center';
    ctx.fillText(this.label, 0, this.radius + 14);

    ctx.restore();
  }
}

// Global expose
window.PhysicsChamber = PhysicsChamber;
