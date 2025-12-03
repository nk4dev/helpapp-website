import { getApps, initializeApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Basic validation to help surface missing or empty env vars early
const requiredKeys = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
];
const missing = requiredKeys.filter(k => !process.env[k]);
if (missing.length) {
    // Use console.error instead of throwing to avoid crashing during partial setup
    // Invalid or missing apiKey will later surface as auth/invalid-api-key
    // This message makes the root cause clearer.
    console.error('[Firebase Config] Missing env vars:', missing.join(', '));
}
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY_HERE') {
    console.error('[Firebase Config] apiKey appears invalid or placeholder. Update NEXT_PUBLIC_FIREBASE_API_KEY in .env.local');
}

if (!getApps().length) {
    initializeApp(firebaseConfig);
}
const firebaseApp = getApp();
export const auth = getAuth(firebaseApp);
export default firebaseApp;