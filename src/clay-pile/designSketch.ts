// ═════════════════════════════════════════════════════════════════════════════
//  CLAY PILE — the design sketch (quarantined dev fiction, NEVER client-facing).
//  This block arrived from the AI-Studio scaffold describing a future audited
//  architecture as if it were the running app. It is kept (clay rule: keep
//  everything, subtract later) but it lives HERE, renders nowhere, and makes
//  no claim about the sandbox. The crisis gate excludes only this directory.
// ═════════════════════════════════════════════════════════════════════════════
import { DataModelSketch } from '../types';

export const DESIGN_SKETCH_DOCS = {
  summary: "SANDBOX TRUTH: entries live on this device; no accounts, no recordings, no cloud copies; no compliance certification is claimed. The schema below is a DESIGN SKETCH for a future, properly audited build — it describes intent, not the running app.",
  dataModel: [
    {
      table: "users_auth (Identity Registry)",
      fields: [
        { name: "id", type: "UUID (Primary Key)", securityEncryption: "No (Indexed)", description: "Globally unique internal user ID." },
        { name: "email_hash", type: "VARCHAR(256)", securityEncryption: "SHA-256 Hashed + Salted", description: "Hashed version of the user email to mask true identity." },
        { name: "password_hash", type: "VARCHAR(512)", securityEncryption: "Argon2id KDF", description: "Highly secure, modern cryptographically salted password hash." },
        { name: "mfa_secret", type: "VARCHAR(128)", securityEncryption: "AES-256 Key Envelope", description: "Encrypted secret key for Multi-Factor Authentication (TOTP)." }
      ]
    },
    {
      table: "user_profiles (Demographics)",
      fields: [
        { name: "id", type: "UUID (Primary Key)", securityEncryption: "No", description: "Links to users_auth." },
        { name: "display_name_encrypted", type: "VARCHAR(256)", securityEncryption: "AES-256-GCM Field-Level", description: "Encrypted nickname or chosen display name of the user." },
        { name: "assigned_role", type: "VARCHAR(50)", securityEncryption: "No", description: "User type (Partner_A, Partner_B, Therapist, Admin)." },
        { name: "active_bond_id", type: "UUID", securityEncryption: "No", description: "Points to the shared family_bonds record if active." }
      ]
    },
    {
      table: "family_bonds (Co-op Contracts)",
      fields: [
        { name: "id", type: "UUID (Primary Key)", securityEncryption: "No", description: "Unique co-op connection code." },
        { name: "member_1_id", type: "UUID", securityEncryption: "No (Foreign Key)", description: "Profile ID of the first family participant." },
        { name: "member_2_id", type: "UUID", securityEncryption: "No (Foreign Key)", description: "Profile ID of the second family participant." },
        { name: "consent_status", type: "JSONB", securityEncryption: "AES-256-GCM Row-Level", description: "Tracks active co-op consent, safety overrides, and HIPAA access logs." },
        { name: "created_at", type: "TIMESTAMP", securityEncryption: "No", description: "Audit trail timestamp of contract establishment." }
      ]
    },
    {
      table: "lesson_progress (Psychoeducation)",
      fields: [
        { name: "id", type: "UUID (Primary Key)", securityEncryption: "No", description: "Unique identifier for course progress logs." },
        { name: "user_profile_id", type: "UUID", securityEncryption: "No", description: "Points to the user_profiles owner." },
        { name: "lesson_id", type: "VARCHAR(100)", securityEncryption: "No", description: "Target lesson code (e.g., 'gottman-ratio-5-1')." },
        { name: "completed_at", type: "TIMESTAMP", securityEncryption: "No", description: "Completion timestamp." },
        { name: "reflection_response_encrypted", type: "TEXT", securityEncryption: "AES-256-GCM Row-Level", description: "User's written self-reflection responses, locked from external view." }
      ]
    },
    {
      table: "simulation_history (Co-op Metrics)",
      fields: [
        { name: "id", type: "UUID (Primary Key)", securityEncryption: "No", description: "Primary simulation record index." },
        { name: "bond_id", type: "UUID", securityEncryption: "No", description: "Active co-op group identifier." },
        { name: "scenario_id", type: "VARCHAR(100)", securityEncryption: "No", description: "Active theme key (e.g., 'dirty-dish-dilemma')." },
        { name: "overall_empathy_index", type: "INT", securityEncryption: "No", description: "Aggregated empathy rating (0-100) for therapist review." },
        { name: "overall_safety_score", type: "INT", securityEncryption: "No", description: "Aggregated safety score (0-100) for therapeutic compliance check." },
        { name: "streak_value", type: "INT", securityEncryption: "No", description: "User's active motivational streak counter at completed time." }
      ]
    },
    {
      table: "feedback_data (Clinical Nudges)",
      fields: [
        { name: "id", type: "UUID (Primary Key)", securityEncryption: "No", description: "Unique ID for the feedback row." },
        { name: "simulation_history_id", type: "UUID", securityEncryption: "No", description: "Links to the simulation_history master row." },
        { name: "selected_choice_text_encrypted", type: "TEXT", securityEncryption: "AES-256-GCM Row-Level", description: "Dialogue choices selected by the user, planned as protected data in the audited build." },
        { name: "npc_reaction_text", type: "TEXT", securityEncryption: "No", description: "Branching NPC reactive response statement." },
        { name: "coach_nudge_text", type: "TEXT", securityEncryption: "No", description: "AI Therapist Coach constructive micro-correction feedback." },
        { name: "clinical_analysis_encrypted", type: "TEXT", securityEncryption: "AES-256-GCM Row-Level", description: "Highly private, clinically detailed Gottman/EFT loop analysis logs." }
      ]
    }
  ],
  securityRules: `
// Design sketch: future row-level security rules (no claim about the running app)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Profiles: Users can only read and update their own medical demographics profile
    match /user_profiles/{profileId} {
      allow read, update: if request.auth != null && request.auth.uid == profileId;
      allow create: if request.auth != null;
    }
    
    // Family Bonds: Co-op partners can only access if they belong to the active bond
    match /family_bonds/{bondId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.member_1_id || request.auth.uid == resource.data.member_2_id);
      allow create, update: if request.auth != null && 
        (request.resource.data.member_1_id == request.auth.uid || request.resource.data.member_2_id == request.auth.uid);
    }
    
    // Lesson Progress: Locked strictly to the individual user profile
    match /lesson_progress/{progressId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_profile_id;
      allow create: if request.auth != null && request.resource.data.user_profile_id == request.auth.uid;
    }
    
    // Simulation Logs: Accessible ONLY to members of the corresponding family bond OR verified practitioners
    match /simulation_history/{simId} {
      allow read: if request.auth != null && (
        exists(/databases/$(database)/documents/family_bonds/$(resource.data.bond_id)) &&
        (get(/databases/$(database)/documents/family_bonds/$(resource.data.bond_id)).data.member_1_id == request.auth.uid ||
         get(/databases/$(database)/documents/family_bonds/$(resource.data.bond_id)).data.member_2_id == request.auth.uid)
        || request.auth.token.role == "verified_therapist"
      );
      allow create: if request.auth != null;
    }
  }
}
  `
};
