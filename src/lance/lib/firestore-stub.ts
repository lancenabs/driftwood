// Local stand-in for the 'firebase/firestore' module (aliased in vite.config +
// tsconfig paths). Rehabit does not ship Firebase; vendored LANCE components
// that import Firestore APIs get inert functions and follow their built-in
// honest-degradation path (they already check isFirebaseInitialized === false).
export const doc = (..._args: any[]): any => ({ _dummy: true });
export const setDoc = async (..._args: any[]): Promise<void> => {};
export const updateDoc = async (..._args: any[]): Promise<void> => {};
export const deleteDoc = async (..._args: any[]): Promise<void> => {};
export const getDoc = async (..._args: any[]): Promise<any> => ({ exists: () => false, data: () => undefined });
export const getDocFromServer = async (..._args: any[]): Promise<any> => ({ exists: () => false, data: () => undefined });
export const onSnapshot = (..._args: any[]): (() => void) => () => {};
