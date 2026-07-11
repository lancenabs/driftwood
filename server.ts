import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3300;

app.use(express.json());


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
