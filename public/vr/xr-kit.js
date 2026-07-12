// ═══════════════════════════════════════════════════════════════════════════
//  XR-KIT — the shared comfort + locomotion module for every L.A.N.C.E. world.
//  CANONICAL HOME: ~/vr-lance-2026-07-06-github/xr-kit.js (the island repo,
//  the mature donor). Other worlds carry a copy; their deploy scripts ship it
//  alongside index.html. Before editing a copy, diff against this file.
//
//  Extracted 2026-07-10 from the island's proven build (the comfort store,
//  the wrist panel, the vignette, snap-turn locomotion, the 20-min nudge).
//  No build step, no package — one ES module, importmap-friendly.
//
//  THE XR LAW (org SOP): every world ships with (a) its crisis surface,
//  (b) this comfort kit, (c) honest data, (d) a desktop fallback so the
//  build stays Playwright-verifiable. This module is (b) and helps (d).
// ═══════════════════════════════════════════════════════════════════════════
import * as THREE from 'three';

/**
 * createXRKit({ THREE-free deps }) → the comfort kit + locomotion.
 *  renderer, camera, rig : the world's own three objects (rig contains camera)
 *  storageKey            : per-world comfort persistence key
 *  accent                : hex string for the wrist panel highlight
 *  onSessionNudge        : called once at 20 minutes in-headset (gentle exit cue)
 */
export function createXRKit({ renderer, camera, rig, storageKey = 'xr_comfort_v1', accent = '#7FD98C', onSessionNudge = null }) {
  // ── The comfort store: persisted; defaults are the safe ones ──────────────
  const comfort = (() => {
    let c = { muted: false, seated: false, vignette: true, snapOnly: true };
    try { c = { ...c, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; } catch { /* defaults */ }
    return c;
  })();
  const saveComfort = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(comfort)); } catch { /* session-only */ }
  };

  // Absolute mute: every audio element the world makes through the kit obeys.
  const allAudio = [];
  function mkAudio(src) {
    const el = new Audio(src);
    el.muted = comfort.muted;
    allAudio.push(el);
    if (allAudio.length > 40) allAudio.splice(0, allAudio.length - 40);
    return el;
  }
  const muteHooks = [];
  function applyMute() {
    for (const el of allAudio) el.muted = comfort.muted;
    for (const fn of muteHooks) { try { fn(comfort.muted); } catch { /* hook's problem */ } }
  }

  // Seated mode: the rig rises so a chair-bound user stands at deck height.
  let seatedApplied = 0;
  function applySeated() {
    const want = comfort.seated ? 0.45 : 0;
    rig.position.y += want - seatedApplied;
    seatedApplied = want;
  }
  applySeated();

  // ── The wrist panel: four cells on the left forearm ───────────────────────
  const wrist = { canvas: null, ctx: null, tex: null, cells: [], sessionStart: performance.now(), nudged: false };
  {
    wrist.canvas = document.createElement('canvas');
    wrist.canvas.width = 512; wrist.canvas.height = 160;
    wrist.ctx = wrist.canvas.getContext('2d');
    wrist.tex = new THREE.CanvasTexture(wrist.canvas);
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.069),
      new THREE.MeshBasicMaterial({ map: wrist.tex, transparent: true, depthWrite: false })
    );
    panel.position.set(0, 0.04, 0.09);
    panel.rotation.x = -Math.PI / 3;
    const leftCtrl = renderer.xr.getController(0);
    leftCtrl.add(panel);
    const labels = ['mute', 'seated', 'vignette', 'snap'];
    labels.forEach((key, i) => {
      const cell = new THREE.Mesh(
        new THREE.PlaneGeometry(0.05, 0.06),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      cell.position.set(-0.0825 + i * 0.055, 0.04, 0.091);
      cell.rotation.x = -Math.PI / 3;
      cell.userData.comfortKey = key;
      leftCtrl.add(cell);
      wrist.cells.push(cell);
    });
    // Self-contained selection: the RIGHT controller's trigger ray hits a cell.
    const ray = new THREE.Raycaster();
    const rightCtrl = renderer.xr.getController(1);
    rightCtrl.addEventListener('selectstart', () => {
      const origin = rightCtrl.getWorldPosition(new THREE.Vector3());
      const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(rightCtrl.getWorldQuaternion(new THREE.Quaternion()));
      ray.set(origin, dir); ray.far = 1.2;
      const hit = ray.intersectObjects(wrist.cells, false)[0];
      if (!hit) return;
      const key = hit.object.userData.comfortKey;
      if (key === 'mute') { comfort.muted = !comfort.muted; applyMute(); }
      if (key === 'seated') { comfort.seated = !comfort.seated; applySeated(); }
      if (key === 'vignette') comfort.vignette = !comfort.vignette;
      if (key === 'snap') comfort.snapOnly = !comfort.snapOnly;
      saveComfort();
      drawWrist();
    });
    drawWrist();
  }
  function drawWrist() {
    const g = wrist.ctx;
    g.clearRect(0, 0, 512, 160);
    g.fillStyle = 'rgba(4,12,10,0.88)';
    g.beginPath(); g.roundRect(2, 2, 508, 156, 26); g.fill();
    const cells = [
      ['🔊', '🔇', comfort.muted, 'sound'],
      ['🧍', '🪑', comfort.seated, 'seated'],
      ['◯', '◉', comfort.vignette, 'tunnel'],
      ['〰', '⇥', comfort.snapOnly, 'snap'],
    ];
    cells.forEach(([off, on, active, label], i) => {
      const x = 12 + i * 124;
      g.fillStyle = active ? 'rgba(127,217,140,0.22)' : 'rgba(255,255,255,0.05)';
      g.beginPath(); g.roundRect(x, 12, 116, 100, 18); g.fill();
      if (active) { g.strokeStyle = accent; g.lineWidth = 3; g.beginPath(); g.roundRect(x, 12, 116, 100, 18); g.stroke(); }
      g.font = '54px system-ui'; g.textAlign = 'center'; g.fillStyle = '#E8FFF2';
      g.fillText(active ? on : off, x + 58, 82);
      g.font = '700 21px system-ui'; g.fillStyle = active ? '#AEF7C4' : 'rgba(220,240,230,0.55)';
      g.fillText(label, x + 58, 142);
    });
    wrist.tex.needsUpdate = true;
  }

  // ── The vignette: a soft tunnel that closes only while moving ─────────────
  const vignetteMesh = (() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 256;
    const g = cv.getContext('2d');
    const grad = g.createRadialGradient(128, 128, 60, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.72, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.92)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 0.6),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, opacity: 0, depthTest: false })
    );
    m.position.z = -0.28;
    m.renderOrder = 998;
    camera.add(m);
    return m;
  })();
  let vignetteTarget = 0;

  // ── Locomotion: island-proven scheme. Left stick moves (vignette follows);
  //    right stick turns — snap by default for this kit's clinical worlds,
  //    smooth only when the wrist panel allows it. ──────────────────────────
  let snapCooldown = false;
  function locomotion(speedScale = 1) {
    const session = renderer.xr.getSession();
    if (!session) return;
    for (const src of session.inputSources) {
      if (!src.gamepad) continue;
      const axes = src.gamepad.axes;
      const DEAD = 0.12;
      if (src.handedness === 'left') {
        if (Math.abs(axes[2] ?? 0) > DEAD || Math.abs(axes[3] ?? 0) > DEAD) {
          if (comfort.vignette) vignetteTarget = 1;
          const q = renderer.xr.getCamera().quaternion;
          const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(q); fwd.y = 0; fwd.normalize();
          const right = new THREE.Vector3(1, 0, 0).applyQuaternion(q); right.y = 0; right.normalize();
          if (Math.abs(axes[3]) > DEAD) rig.position.addScaledVector(fwd, -axes[3] * 0.05 * speedScale);
          if (Math.abs(axes[2]) > DEAD) rig.position.addScaledVector(right, axes[2] * 0.05 * speedScale);
        }
      }
      if (src.handedness === 'right') {
        const x = axes[2] ?? 0;
        if (Math.abs(x) > DEAD) {
          if (!snapCooldown && Math.abs(x) > 0.7) {
            rig.rotation.y -= Math.sign(x) * (Math.PI / 4);
            snapCooldown = true;
            setTimeout(() => { snapCooldown = false; }, 350);
          } else if (Math.abs(x) <= 0.7 && !comfort.snapOnly) {
            if (comfort.vignette) vignetteTarget = 1;
            rig.rotation.y -= x * 0.025;
          }
        }
      }
    }
  }

  // ── Per-frame update: vignette follow + the 20-minute session nudge ───────
  function update(now = performance.now()) {
    vignetteMesh.material.opacity += (vignetteTarget - vignetteMesh.material.opacity) * 0.12;
    vignetteTarget = 0;
    if (!wrist.nudged && renderer.xr.isPresenting && now - wrist.sessionStart > 20 * 60 * 1000) {
      wrist.nudged = true;
      if (onSessionNudge) { try { onSessionNudge(); } catch { /* the world's problem */ } }
    }
  }

  return {
    comfort,
    mkAudio,
    onMuteChange: (fn) => muteHooks.push(fn),
    locomotion,
    update,
    flagMoving: () => { if (comfort.vignette) vignetteTarget = 1; },
  };
}
