# 🌌 GRAVITAS // Principles of Anti-Gravity Website Template

A website template built with **HTML5** and **Bootstrap 5**, centered entirely around the aesthetics, physics, and architectural concepts of **Anti-Gravity, Levitation, and Weightlessness**.

---

## 🚀 Aesthetic & Concept Overview

The template embodies the visual and physical feeling of **defying gravity**:
- **Zero-G Weightlessness**: Upward-drifting quantum dust, floating navigation islands, and gentle bobbing elements operating with decoupled float frequencies.
- **Quantum Levitation Centerpiece**: Pure CSS 3D nested superconducting gimbal rings spinning along X, Y, and Z axes with an illuminated levitating core and an inverse floor shadow that proves suspension.
- **Dynamic Gravity Mode Modulation**: An interactive floating dock HUD enabling visitors to switch gravity fields in real time:
  - 🌍 **1.0G Earth**: Standard downward acceleration.
  - 🌕 **0.16G Moon**: Slow, graceful lunar drifting.
  - 🪐 **0.0G Zero-G**: Total weightlessness with free-floating inertia.
  - ⚡ **-1.0G Anti-G**: Inverted buoyancy where particles accelerate upward defying Earth's gravity.
  - 🌀 **Quantum Wave**: Casimir flux oscillations.
- **Sci-Fi Acoustic Synthesizer**: Built using the native Web Audio API, generating ethereal resonance tones and frequency sweeps when gravity vectors modulate (toggleable with mute/unmute).
- **Glassmorphism & Neon Aura Palette**: Deep cosmos background (`#040711`), frosted glass surfaces (`backdrop-filter: blur(20px)`), electric cyan (`#00f0ff`), quantum violet (`#8e2de2`), and superconductor emerald (`#00ffa3`).

---

## 🧪 Key Features & Interactive Sections

### 1. Central Levitation Core (`#hero`)
- Concentric 3D rotating rings illustrating magnetic field flux lines.
- Floating telemetry badges (`Net Mass: 0.00 kg`, `Curvature: Zero-G Flat`, `Flux Coherence: Stable 100%`).
- Floating annotation callout nodes hovering around the core.

### 2. The 4 Fundamental Principles of Anti-Gravity (`#principles`)
Interactive 3D tilt cards reacting to mouse perspective, detailing the 4 physics pillars:
1. **Superconducting Quantum Levitation**: Meissner-Ochsenfeld effect & Abrikosov vortex pinning in Type-II superconductors.
2. **Metric Spacetime Engineering**: Alcubierre tensors contracting space ahead and expanding behind to maintain zero-g freefall.
3. **Negative Energy & Casimir Inversion**: Quantum vacuum fluctuations between plates generating negative radiation pressure.
4. **Asymmetric Electrohydrodynamic Drift**: Biefeld-Brown high-voltage field gradients producing net directional buoyant thrust.

### 3. Interactive Zero-G Physics Chamber (`#chamber`)
An in-browser HTML5 Canvas physics sandbox:
- Grab, fling, and bump levitating quantum bodies (superconductors, negative mass spheroids, Casimir resonators).
- Real-time gravity slider (`-1.0G` to `+1.0G`).
- Toggleable **Superconducting Flux Lock** (locks objects in a 3D magnetic equilibrium plane).
- Toggleable **Spacetime Vortex Swirl**.
- Mass spawning button and kinetic energy telemetry readout.

### 4. Speculative Systems & Floating Architecture (`#applications`)
- Atmospheric Geodesic Cloud Habitats (Buckminster Fuller cloud-nine spheres).
- Sub-Orbital Mag-Warp Evacuated Transit (Mach 6.8 frictionless capsules).
- Reactionless Space Mass Drivers.
- Wearable Exo-Gravity Harness for personal levitation.
- Includes **Bootstrap Modals with SVG technical schematics**.

### 5. Gravitational Harmonic Waveform Tuner (`#waveform`)
- Real-time HTML5 Canvas wave interference simulator.
- Demonstrates phase cancellation of Earth's 9.81 Hz gravitational field using an adjustable anti-phase wave ($\Delta\phi = 180^\circ$) and amplitude slider, displaying a real-time **Cancellation Efficiency %**.

### 6. Technical Propulsion & Levitation Matrix (`#specifications`)
- High-tech Bootstrap comparison table contrasting Aerodynamic Airfoils, Chemical Rocketry, Superconducting Maglev, Electrohydrodynamic Lift, and Metric Anti-Gravity across propellant need, vacuum ability, g-stress, and speed.

### 7. Theoretical Archive & Relativistic FAQ (`#archive`)
- Dark glassmorphism Bootstrap Accordion addressing Conservation of Energy, Casimir vacuum measurements, gyroscopic anomalies, and the distinction between magnetic levitation and true gravitational inversion.

### 8. Research Dispatch / Inquiry Form (`#contact`)
- Futuristic form with glowing inputs, theoretical domain selector, and animated dispatch telemetry with Bootstrap toast notification.

---

## 📂 File Structure

```
c:\Users\jship\Documents\Projects\AntiGrav\
├── index.html            # Main HTML5 & Bootstrap 5 webpage
├── style.css             # Anti-gravity aesthetics, animations, glows, & glassmorphism
├── physics-chamber.js    # Canvas Zero-G physics engine (Verlet/Euler simulation)
├── main.js               # Ambient particle canvas, gravity dock HUD, audio synth, & wave tuner
└── README.md             # Project documentation & reference
```

---

## 🛠️ How to View & Run

No build step or complex package manager is required! The template uses vanilla modern JavaScript, HTML5, and Bootstrap 5 via high-speed CDN.

### Option 1: Direct Browser Launch
Simply double-click `index.html` or right-click and open with your preferred browser (Chrome, Edge, Firefox, Brave, Safari).

### Option 2: Local HTTP Server (VS Code Live Server or Node)
If you prefer running a local development server:
```bash
# Using Node's npx (http-server)
npx http-server -p 8080 -o

# Or with Python
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your web browser.

---

## 🎨 Customizing the Aesthetics

All visual variables are defined in the `:root` block inside `style.css`:

```css
:root {
  --cyan: #00f0ff;          /* Primary levitation glow */
  --violet: #8e2de2;        /* Casimir / anti-phase accent */
  --emerald: #00ffa3;       /* Superconductor stable status */
  --rose: #ff2a85;          /* Negative mass warning color */
  --float-drift: -18px;     /* Default levitation bob distance */
  --float-duration: 6s;     /* Floating cycle period */
}
```

Adjust `--float-drift` to increase or decrease how high elements float, or swap accent colors to fit your custom branding.

---

## 📜 Credits & License
- **Framework**: Bootstrap 5.3.3 & Bootstrap Icons 1.11.3
- **Typography**: Orbitron, Space Grotesk, Inter, JetBrains Mono (via Google Fonts)
- **License**: MIT Open Source License.
