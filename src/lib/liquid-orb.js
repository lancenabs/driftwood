/**
 * LIQUID ORB — Pam's face.
 *
 * A raymarched sphere of oozing liquid blue metal. Chrome fresnel, studio-strip
 * reflections, a slow breath, and a swell + glow that rises while she talks.
 *
 * SOURCE OF TRUTH: lance-command-center/src/components/hq/liquid-orb.js
 * MIRROR:          ai-assistant-framework/public/liquid-orb.js   (keep in sync — byte-for-byte)
 *
 * Deliberately plain JS with zero imports so both the React command center and
 * Pam's hand-written HTML deck can run the exact same face.
 *
 *   const orb = createLiquidOrb(canvasEl, { size: 230 });
 *   orb.setState({ speaking: true });     // swells + glows
 *   orb.setState({ listening: true });    // tightens + ripples
 *   orb.setState({ busy: true });         // churns while she thinks
 *   orb.destroy();
 *
 * Falls back to an animated CSS gradient if WebGL is unavailable — she always
 * has a face.
 */

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uSpeak;   // 0..1  talking
uniform float uListen;  // 0..1  hearing you
uniform float uBusy;    // 0..1  thinking
uniform vec3  uTint;    // the alloy — blue by default, warm for Driftwood, steel for Voyager

// ── value noise ──────────────────────────────────────────────────────────────
float hash(vec3 p){
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x){
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                 mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                 mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 3; i++){ s += a * noise(p); p *= 2.03; a *= 0.5; }
  return s;
}

// ── the body ─────────────────────────────────────────────────────────────────
// A sphere that breathes slowly, swells when she speaks, and whose skin is
// dragged around by a domain-warped noise field — liquid metal, not a ball.
float radius(){
  float breathe = 0.030 * sin(uTime * 0.55);                       // always alive
  float swell   = uSpeak * (0.085 + 0.045 * sin(uTime * 1.7));     // slow grow/shrink as she talks
  float tighten = uListen * 0.035;
  return 0.92 + breathe + swell + tighten;
}
float amp(){
  return 0.115 + uSpeak * 0.075 + uBusy * 0.05 + uListen * 0.03;   // how much it oozes
}
float map(vec3 p){
  float t = uTime * (0.30 + 0.45 * uSpeak + 0.25 * uBusy);
  vec3  q = p * 2.15 + vec3(0.0, -t * 0.60, t * 0.35);
  float w = fbm(q * 0.55);                                          // warp the domain with itself
  float n = fbm(q + w * 1.60);
  return length(p) - radius() - (n - 0.5) * amp();
}
vec3 normalAt(vec3 p){
  vec2 e = vec2(0.012, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)));
}

// The room she is standing in. Chrome has no colour of its own — it is nothing
// but the room, bent. So the room must be HARD: near-black darks with a few
// blown-out strip lights. Soften this and she turns back into a plastic ball.
vec3 env(vec3 r){
  vec3 col = mix(vec3(0.004, 0.010, 0.035), vec3(0.03, 0.10, 0.26),
                 smoothstep(-0.9, 0.9, r.y));                    // dark room, lighter ceiling
  col += smoothstep(0.55, 0.80, sin(r.y * 5.5 + 1.0)) * vec3(0.75, 1.05, 1.45);   // key strip
  col += smoothstep(0.72, 0.94, sin(r.x * 4.0 - 0.7)) * vec3(0.30, 0.62, 1.15);   // side strip
  col += smoothstep(0.90, 1.00, sin((r.x + r.y) * 6.0 + 2.0)) * vec3(0.55, 0.80, 1.10) * 0.35;
  col += pow(max(0.0, 1.0 - abs(r.y)), 10.0) * vec3(0.10, 0.30, 0.70);            // horizon bloom
  return col;
}

void main(){
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;

  vec3 ro = vec3(0.0, 0.0, 3.10);
  vec3 rd = normalize(vec3(uv, -2.35));

  float t = 0.0, dmin = 1e9;
  bool  hit = false;
  for (int i = 0; i < 56; i++){
    vec3  p = ro + rd * t;
    float d = map(p);
    dmin = min(dmin, d);
    if (d < 0.0015){ hit = true; break; }
    t += d * 0.62;                 // noise breaks the Lipschitz bound — step short
    if (t > 5.5) break;
  }

  // the halo: light bleeding off her skin, brighter the more she has to say.
  // It follows the alloy, so a warm orb glows warm and a steel orb glows cool.
  float haloI = exp(-5.5 * max(dmin, 0.0)) * (0.30 + 0.80 * uSpeak + 0.25 * uListen + 0.20 * uBusy);
  vec3  halo  = uTint * (0.55 * haloI);

  if (!hit){
    gl_FragColor = vec4(halo, clamp(haloI * 0.85, 0.0, 1.0));
    return;
  }

  vec3 p = ro + rd * t;
  vec3 n = normalAt(p);
  vec3 L = normalize(vec3(-0.55, 0.85, 0.60));

  float fres = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 2.6);
  vec3  refl = reflect(rd, n);

  // A metal's colour IS its reflection, tinted by the alloy. Multiply — never add,
  // or the tint becomes a matte coat of paint over the mirror.
  vec3 col = env(refl) * mix(0.55, 1.60, fres);
  col *= uTint;                                                    // the alloy (blue / warm / steel)

  col += vec3(1.0, 0.98, 0.95)
       * pow(max(dot(reflect(-L, n), -rd), 0.0), 60.0) * 1.60;     // hot specular (white — all metals spark white)
  col += uTint * (0.62 * pow(fres, 1.6) * (0.55 + 0.60 * uSpeak)); // rim light follows the alloy
  col += uTint * (0.12 * uSpeak);                                  // she lights from inside as she talks
  col += halo * 0.20;

  col = col / (1.0 + col * 0.60);                                  // gentle rolloff, keeps the highlights hot
  col = pow(col, vec3(0.4545));
  col = clamp((col - 0.5) * 1.16 + 0.5, 0.0, 1.0);                 // a touch of contrast — chrome is punchy

  gl_FragColor = vec4(col, 1.0);
}
`;

// The alloy per world. Blue is the ecosystem default; wood is the warm
// amber-bronze of Driftwood; steel is the cool desaturated metal of Voyager.
const TINTS = {
  blue:  [0.42, 0.72, 1.05],
  wood:  [1.05, 0.66, 0.32],
  steel: [0.74, 0.82, 0.94],
};
const CSS_FALLBACKS = {
  blue:  'radial-gradient(circle at 38% 32%, #7fd0ff 0%, #2f8fe0 26%, #1858a8 52%, #0a2a5c 78%, #061634 100%)',
  wood:  'radial-gradient(circle at 38% 32%, #ffd9a0 0%, #d98a3a 30%, #9a5a1e 60%, #3d2410 100%)',
  steel: 'radial-gradient(circle at 38% 32%, #dfe8f2 0%, #9fb2c6 30%, #5f7488 60%, #2c3947 100%)',
};

// Turn any colour into an alloy that keeps the chrome punch. The named tints
// have their brightest channel near ~1.05 (that's what makes the metal pop);
// so for an arbitrary hex we keep the HUE and rescale so its brightest channel
// lands at ~1.05. Every agent can have its own colour and it still reads as the
// same liquid-metal orb — just tinted.
function hexToAlloy(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  let r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b, 0.001);
  const k = 1.05 / max;                 // rescale so the brightest channel pops
  return [r * k, g * k, b * k];
}

// tint may be: a name ('blue'|'wood'|'steel'), a hex string ('#ff4b4b'), or an
// [r,g,b] alloy array (already normalised). Returns { alloy, css }.
function resolveTint(tint) {
  if (Array.isArray(tint) && tint.length === 3) {
    const hex = '#' + tint.map(c => Math.round(Math.min(1, c / 1.05) * 255).toString(16).padStart(2, '0')).join('');
    return { alloy: tint, css: `radial-gradient(circle at 38% 32%, ${hex} 0%, #0a1020 90%)` };
  }
  if (typeof tint === 'string' && tint[0] === '#') {
    const alloy = hexToAlloy(tint);
    if (alloy) return { alloy, css: `radial-gradient(circle at 38% 32%, ${tint} 0%, #0a1020 90%)` };
  }
  const name = (typeof tint === 'string' && TINTS[tint]) ? tint : 'blue';
  return { alloy: TINTS[name], css: CSS_FALLBACKS[name] };
}

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error('liquid-orb shader: ' + log);
  }
  return s;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ size?: number, dpr?: number }} [opts]
 */
export function createLiquidOrb(canvas, opts) {
  const size = (opts && opts.size) || 230;
  // She is expensive per-pixel. Cap the pixel ratio — nobody can see the
  // difference on a sphere and the fans stay quiet.
  const dpr = Math.min((opts && opts.dpr) || window.devicePixelRatio || 1, 1.5);
  const resolved = resolveTint(opts && opts.tint);
  const tint = resolved.alloy;
  const cssFallback = resolved.css;

  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';

  const target = { speaking: 0, listening: 0, busy: 0 };
  const now = { speaking: 0, listening: 0, busy: 0 };

  let gl = null;
  try {
    gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false }) ||
         canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
  } catch (_) { gl = null; }

  if (!gl) {
    // No WebGL — she still gets a face, just a simpler one.
    canvas.style.background = cssFallback;
    canvas.style.borderRadius = '50%';
    canvas.style.transition = 'transform .6s ease, box-shadow .6s ease';
    const paint = () => {
      const s = 1 + now.speaking * 0.08 + now.listening * 0.03;
      canvas.style.transform = 'scale(' + s.toFixed(3) + ')';
      canvas.style.boxShadow = '0 0 ' + (24 + now.speaking * 46) + 'px rgba(64,150,255,' + (0.35 + now.speaking * 0.45).toFixed(2) + ')';
    };
    paint();
    return {
      setState(next) { Object.assign(target, next && normalize(next)); Object.assign(now, target); paint(); },
      resize() {},
      destroy() {},
      webgl: false,
    };
  }

  let prog = null;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error('liquid-orb link: ' + gl.getProgramInfoLog(prog));
    }
  } catch (err) {
    // Shader refused to build on this GPU/driver — degrade rather than go dark.
    console.warn(err);
    canvas.style.background = cssFallback;
    canvas.style.borderRadius = '50%';
    return {
      setState(next) { Object.assign(now, normalize(next || {})); },
      resize() {}, destroy() {}, webgl: false,
    };
  }

  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uSpeak = gl.getUniformLocation(prog, 'uSpeak');
  const uListen = gl.getUniformLocation(prog, 'uListen');
  const uBusy = gl.getUniformLocation(prog, 'uBusy');
  const uTint = gl.getUniformLocation(prog, 'uTint');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const t0 = performance.now();
  let raf = 0;
  let alive = true;

  function frame(ts) {
    if (!alive) return;
    if (gl.isContextLost()) return;   // GPU reset / tab evicted — stop, don't spin
    raf = requestAnimationFrame(frame);

    // Ease toward the target so she never snaps — she rises and settles.
    for (const k of ['speaking', 'listening', 'busy']) {
      now[k] += (target[k] - now[k]) * 0.055;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (ts - t0) / 1000);
    gl.uniform1f(uSpeak, now.speaking);
    gl.uniform1f(uListen, now.listening);
    gl.uniform1f(uBusy, now.busy);
    gl.uniform3f(uTint, tint[0], tint[1], tint[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  raf = requestAnimationFrame(frame);

  // Don't burn a GPU on a tab nobody is looking at.
  const onVis = () => {
    if (document.hidden) { cancelAnimationFrame(raf); }
    else if (alive) { raf = requestAnimationFrame(frame); }
  };
  document.addEventListener('visibilitychange', onVis);

  return {
    setState(next) { Object.assign(target, normalize(next || {})); },
    resize(px) {
      canvas.width = Math.round(px * dpr);
      canvas.height = Math.round(px * dpr);
      canvas.style.width = px + 'px';
      canvas.style.height = px + 'px';
    },
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      // Deliberately NOT calling WEBGL_lose_context here. A canvas only ever has
      // ONE context: force-losing it kills the canvas for good, and React's
      // StrictMode double-mount (create → destroy → create on the same element)
      // would then rebuild the orb on a dead context and she'd render nothing.
      // Dropping the rAF is enough; the browser reclaims the context with the
      // canvas.
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    },
    webgl: true,
  };
}

function normalize(s) {
  const out = {};
  if ('speaking' in s) out.speaking = s.speaking ? 1 : 0;
  if ('listening' in s) out.listening = s.listening ? 1 : 0;
  if ('busy' in s) out.busy = s.busy ? 1 : 0;
  return out;
}
