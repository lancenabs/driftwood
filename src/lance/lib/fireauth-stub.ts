// Local stand-in for the 'firebase/auth' module (aliased in vite.config +
// tsconfig paths). Only reached behind `isFirebaseInitialized` checks, which
// are always false in Rehabit — these exist so imports type-check and any
// stray call is inert.
export type User = any;
export const onAuthStateChanged = (_auth: any, callback: any): (() => void) => {
  setTimeout(() => callback(null), 10);
  return () => {};
};
export const signInWithPopup = async (..._args: any[]): Promise<any> => {
  throw new Error('Sign-in unavailable: cloud sync is not configured in Rehabit.');
};
export const signOut = async (..._args: any[]): Promise<void> => {};
export class GoogleAuthProvider {}
