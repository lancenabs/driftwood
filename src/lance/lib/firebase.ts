// ============================================================================
// Firebase stub — Rehabit edition.
// The LANCE app's optional Firestore sync-backup layer is not wired in Rehabit
// (our durable layer is SQLite + the future companion bridge). This stub keeps
// the same exports so vendored components compile, and reports "not
// initialized" so they take their honest-degradation path — exactly what the
// real module does when fb-config.json holds placeholders.
// ============================================================================

const db: any = { _dummy: true };
const auth: any = {
  _dummy: true,
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    // Instantly pass null user to keep the app in local-storage mode.
    setTimeout(() => callback(null), 10);
    return () => {};
  }
};
const isFirebaseInitialized = false;

export { db, auth, isFirebaseInitialized };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
