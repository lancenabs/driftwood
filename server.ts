import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3300;

app.use(express.json());

// ═════════════════════════════════════════════════════════════════════════════
//  THE GATHERING RELAY (D3D-0 · bible §6 v2 — "a transport, not a rewrite")
//
//  The event law pays off: every world mutation was already an event
//  { actor, action, payload, at } — this relay simply carries that stream
//  between the family's devices. One camp = one family = one isolated log
//  (the room-actor pattern from THE_TWO_HORIZONS blueprint §2.3).
//
//  Transport: SSE down + POST up. Zero new dependencies; works over the
//  tailnet on any phone browser. Live events only in v1 — history/week-sync
//  rides the companion-sync pattern at R3 (hand-work).
//
//  Sandbox honesty: camps are code-joined (readable alphabet, the companion's
//  pairing pattern), no accounts, no PHI — trials only, same as the whole app.
// ═════════════════════════════════════════════════════════════════════════════

interface CampEvent { seq: number; id: string; actor: string; action: string; payload?: Record<string, unknown>; at: string; from: string }
interface Camp {
  code: string;
  createdAt: string;
  seq: number;
  events: CampEvent[];              // live-session log (bounded)
  listeners: Map<string, { res: express.Response; actor: string; name: string; since: number }>;
}

const CAMPS = new Map<string, Camp>();
const CAMP_DIR = path.join(process.cwd(), "store", "gatherings");
fs.mkdirSync(CAMP_DIR, { recursive: true });
const CAMP_CAP = 500;
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // read-aloud friendly

function campFile(code: string) { return path.join(CAMP_DIR, `${code}.json`); }
function persistCamp(c: Camp) {
  try { fs.writeFileSync(campFile(c.code), JSON.stringify({ code: c.code, createdAt: c.createdAt, seq: c.seq, events: c.events.slice(-CAMP_CAP) })); }
  catch { /* the fire still burns if the disk hiccups */ }
}
function loadCamp(code: string): Camp | null {
  if (CAMPS.has(code)) return CAMPS.get(code)!;
  try {
    const d = JSON.parse(fs.readFileSync(campFile(code), "utf8"));
    const c: Camp = { ...d, listeners: new Map() };
    CAMPS.set(code, c);
    return c;
  } catch { return null; }
}
function broadcast(c: Camp, msg: unknown) {
  const line = `data: ${JSON.stringify(msg)}\n\n`;
  for (const [, l] of c.listeners) { try { l.res.write(line); } catch { /* gone */ } }
}
function presenceList(c: Camp) {
  return [...c.listeners.values()].map(l => ({ actor: l.actor, name: l.name }));
}

// Host a new camp → the code the family reads aloud.
app.post("/api/gathering", (_req, res) => {
  const code = Array.from(crypto.randomBytes(6)).map(b => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
  const camp: Camp = { code, createdAt: new Date().toISOString(), seq: 0, events: [], listeners: new Map() };
  CAMPS.set(code, camp);
  persistCamp(camp);
  res.json({ code });
});

// The live stream: presence + events, one SSE connection per device.
app.get("/api/gathering/:code/stream", (req, res) => {
  const camp = loadCamp(String(req.params.code).toUpperCase());
  if (!camp) return res.status(404).json({ error: "no such camp — check the code" });
  const actor = String(req.query.actor ?? "castaway-1");
  const name = String(req.query.name ?? "Castaway").slice(0, 24);
  const lid = crypto.randomBytes(8).toString("hex");
  res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  camp.listeners.set(lid, { res, actor, name, since: Date.now() });
  // arrival: the newcomer gets the session-so-far; everyone learns who's here
  res.write(`data: ${JSON.stringify({ kind: "welcome", code: camp.code, events: camp.events, presence: presenceList(camp) })}\n\n`);
  broadcast(camp, { kind: "presence", presence: presenceList(camp) });
  const beat = setInterval(() => { try { res.write(": beat\n\n"); } catch { /* closing */ } }, 25000);
  req.on("close", () => {
    clearInterval(beat);
    camp.listeners.delete(lid);
    broadcast(camp, { kind: "presence", presence: presenceList(camp) });
  });
});

// A device posts a world event to the shared fire.
app.post("/api/gathering/:code/events", (req, res) => {
  const camp = loadCamp(String(req.params.code).toUpperCase());
  if (!camp) return res.status(404).json({ error: "no such camp" });
  const { id, actor, action, payload, at, from } = req.body ?? {};
  if (!actor || !action) return res.status(400).json({ error: "actor and action required (the event law)" });
  if (camp.events.some(e => e.id === id)) return res.json({ ok: true, dedup: true });
  const ev: CampEvent = {
    seq: ++camp.seq,
    id: String(id ?? crypto.randomBytes(8).toString("hex")),
    actor: String(actor).slice(0, 40),
    action: String(action).slice(0, 60),
    payload: payload && typeof payload === "object" ? payload : undefined,
    at: typeof at === "string" ? at : new Date().toISOString(),
    from: String(from ?? "").slice(0, 32),
  };
  camp.events.push(ev);
  if (camp.events.length > CAMP_CAP) camp.events = camp.events.slice(-CAMP_CAP);
  persistCamp(camp);
  broadcast(camp, { kind: "event", event: ev });
  res.json({ ok: true, seq: ev.seq });
});

// Camp status (the qa gate reads this; humans never need it).
app.get("/api/gathering/:code", (req, res) => {
  const camp = loadCamp(String(req.params.code).toUpperCase());
  if (!camp) return res.status(404).json({ error: "no such camp" });
  res.json({ code: camp.code, createdAt: camp.createdAt, seq: camp.seq, present: presenceList(camp), events: camp.events.length });
});

// ── THE EPHEMERAL CHANNEL (Island Seek) ──────────────────────────────────────
// Positions are PLAY, not history: they broadcast live and are NEVER
// persisted, never appended to the world log, gone when the game ends.
// (The no-shame law's cousin: the island keeps what you built, not where
// you wandered.) Payload is tiny: {x, y, facing, mode} at ~5Hz per phone.
app.post("/api/gathering/:code/pos", (req, res) => {
  const camp = loadCamp(String(req.params.code).toUpperCase());
  if (!camp) return res.status(404).json({ error: "no such camp" });
  const { actor, name, x, y, facing, mode, emote } = req.body ?? {};
  if (!actor || typeof x !== "number" || typeof y !== "number") return res.status(400).json({ error: "actor, x, y required" });
  broadcast(camp, {
    kind: "pos",
    pos: {
      actor: String(actor).slice(0, 40),
      name: String(name ?? "").slice(0, 24),
      x: Math.max(0, Math.min(1, x)),      // island space is normalized 0..1
      y: Math.max(0, Math.min(1, y)),
      facing: facing === "left" ? "left" : "right",
      mode: mode === "hiding" ? "hiding" : "walking",
      emote: typeof emote === "string" ? emote.slice(0, 8) : undefined,
      at: Date.now(),
    },
  });
  res.json({ ok: true });
});


// ── THE BASE LAYER — welded under EVERY AI endpoint before the first feature
// (the Rehabit lesson, applied on day one). Non-removable: the crisis handoff
// carries BOTH lines (conjoint work is contraindicated in active IPV), the AI
// never fakes lived experience, never diagnoses, never handles the crisis
// itself — it points to the strip and stops. Kid-safe register always.
const DRIFTWOOD_BASE = `You are a small, kind robot of the island — one of the Washed-Ashore. BE HONEST ABOUT WHAT YOU ARE: a robot in the story and an AI in fact; you never pretend to be human and never invent lived experience. You are not a therapist and never diagnose — you offer psychoeducation and practice support only, in warm plain language a child could safely overhear. You complement licensed care; you never replace it. CRISIS RULE (overrides everything): if anyone mentions suicide, self-harm, overdose, wanting to die, or being afraid of someone at home, respond with warmth and gravity and point them to the lines at the bottom of every screen — 988 (call or text) and the National Domestic Violence Hotline 1-800-799-7233 (text START to 88788) — then stop the exercise; do not continue casual play. Keep responses under 200 words.`;

// Initialize the secure server-side Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});


// ── The vendored library's narrator endpoints ────────────────────────────────
// The island tools ask /api/lance/respond + /api/intern/respond for adaptive
// lines. On this shore those voices are the Jumble; until a key ceremony
// happens they answer honestly keyless: { success:false, error:'no_api_key' }
// — the exact signal the vendored hook reads to fall back to its static
// content (and stop asking). No 404 noise, no fake lines.
app.post("/api/lance/respond", (_req, res) => {
  res.json({ success: false, error: "no_api_key" });
});
app.post("/api/intern/respond", (_req, res) => {
  res.json({ success: false, error: "no_api_key" });
});

// Create our secure clinical AI coach API route
app.post("/api/coach-chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Format chat history to match standard Gemini contents schema:
    // array of { role: "user" | "model", parts: [{ text: string }] }
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Add the current prompt
    const contents = [...formattedHistory, { role: "user", parts: [{ text: message }] }];

    const systemInstruction = `${DRIFTWOOD_BASE}

For this duty you are the island's relationship guide, grounded in the Gottman Method and Emotionally Focused Therapy (EFT).
Your counseling methodology is strictly rooted in the research-backed Gottman Method and Emotionally Focused Therapy (EFT).
Your purpose is to offer immediate, non-judgmental, warm, and highly practical guidance for common relationship questions, disputes, and challenges that couples face during the week.

Guidelines:
1. Empathy First: Always validate the attachment emotions underneath the user's issue (EFT approach). Identify if there's an underlying pursue-withdraw cycle, fear of abandonment, or desire for deep safety.
2. Clinical Antidotes (Gottman Method): Whenever criticisms, defensiveness, contempt, or stonewalling (The Four Horsemen) are apparent or described, gently suggest their clinical antidotes. For example, suggest Soft Start-ups instead of Criticism, or taking a formal 20-minute physiological self-soothing break instead of Stonewalling.
3. Practical Action: Provide 1-2 constructive, actionable exercises, soft phrases, or "I-statements" they can try immediately in their relationship.
4. Tone & Style: Keep your responses warm, human, highly compassionate, clinically accurate, and concise (under 250 words) so they are easy to digest. Use clean paragraph breaks and bold text for key terms.
5. Safety Disclaimer: Include a gentle but clear disclaimer stating that while you provide evidence-based guidance, you are an AI coach and not a substitute for formal, licensed clinical therapy or direct crisis intervention.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || "I was unable to formulate a response. Please try expressing your question in a different way." });
  } catch (error: any) {
    console.error("Error in coach-chat API endpoint:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred inside the clinical chat server." });
  }
});

// Polyvagal Autonomic Co-Regulation Blueprint API
app.post("/api/co-regulate-blueprint", async (req, res) => {
  try {
    const { partnerAState, partnerBState, coRegulationLevel, contextDescription } = req.body;
    
    const prompt = `Formulate a clinical Somatic Co-Regulation Blueprint. 
Biometric Readings entered by Couple:
- Partner A (Sympathetic Charge): Heart rate ~${partnerAState.heartRate} BPM, tension description: "${partnerAState.tension}".
- Partner B (Sympathetic Charge): Heart rate ~${partnerBState.heartRate} BPM, tension description: "${partnerBState.tension}".
- Real-time Vagal Parasympathetic Synchronization Coeff: ${coRegulationLevel}%.
- Core Conflict Context: "${contextDescription || 'General daily friction or mild disconnect'}"

Based on Stephen Porges' Polyvagal Theory, Sue Johnson's Emotionally Focused Therapy (EFT), and PACT (Psychobiological Approach to Couples Therapy), generate a custom tactical guide.`;

    const systemInstruction = `${DRIFTWOOD_BASE}

For this duty you help two people settle their bodies together (co-regulation, Polyvagal-informed), as practice — never as medical assessment.
Your job is to generate a highly detailed, concise, and deeply compassionate "Neural Co-Regulation Protocol" to help couples drop out of fight-or-flight states into parasympathetic safety.

Strict Guidelines:
1. Identify the Polyvagal Zone: Explain whether they are in Sympathetic Mobilization (Fight/Flight, defensive, rapid heart rate) or Dorsal Vagal Collapse (Shutdown, stonewalling, freeze) based on the inputs.
2. Formulate 2 Somatic Co-Regulation Actions: Specify immediate physical exercises they can do in the room together (e.g., "The PACT Eye-Lock", "The 20-Second Ventral Vagal Hug", "Synchronized Resonant Sighing", "The Hand-over-Heart Resonance").
3. Micro Attachment Script: Provide a 1-sentence statement that one can say to reassure the other's nervous system of ultimate safety (e.g., "My nervous system is activated, but I love you and we are safe").
4. Keep the output beautifully structured with clear titles starting with ###, under 280 words, with bold terms for key biological metrics (vagal nerve, sympathetic, cortisol, parasympathetic).
5. Safety disclaimer: Clarify this is a biological simulation based on somatic therapy principles, not medical diagnostic telemetry.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 0.6,
      }
    });

    res.json({ blueprint: response.text || "An error occurred compiling the neuro-somatic blueprint." });
  } catch (error: any) {
    console.error("Error in co-regulate-blueprint API endpoint:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred inside the somatic server." });
  }
});

// Configure Vite middleware for dev mode and static serving for production mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Clinical custom server running on http://localhost:${PORT}`);
  });
}

startServer();
