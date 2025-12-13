// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- TEMPORARY FIX ---
// This is a temporary, insecure method to get your application running.
// The correct, secure method is to use the "Secrets" panel in your development environment.

// STEP 1: Go to your Firebase project settings -> "Your apps" -> Config.
// STEP 2: Copy the entire 'firebaseConfig' object.
// STEP 3: Replace the entire placeholder object below with the one you copied.

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE",
  measurementId: "PASTE_YOUR_MEASUREMENT_ID_HERE"
};

// After you paste your keys, hard-refresh the application (Ctrl+Shift+R or Cmd+Shift+R).

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


// --- Firestore Security Rules ---
// You must copy these rules into the "Rules" tab of your Firestore Database in the Firebase Console.
/*
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // --- HELPER FUNCTIONS ---
    function isSignedIn() { return request.auth != null; }
    function isOwner(userId) { return request.auth.uid == userId; }
    function isCreatingForSelf() { return request.auth.uid == request.resource.data.userId; }
    function isAdmin() { return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'; }

    // == USERS Collection ==
    match /users/{userId} {
      allow read: if isSignedIn() && (isOwner(userId) || isAdmin());
      allow create: if isSignedIn() && isOwner(userId);
      allow update: if isSignedIn() && ((isOwner(userId) && request.resource.data.role == resource.data.role) || isAdmin());
      allow delete: if isAdmin();
    }

    // == MEMORIALS Collection ==
    match /memorials/{memorialId} {
      allow read: if resource.data.status == 'active' || (isSignedIn() && (isOwner(resource.data.userId) || isAdmin()));
      allow create: if isSignedIn() && isCreatingForSelf() && request.resource.data.status in ['draft', 'active'];
      allow delete: if isSignedIn() && (isOwner(resource.data.userId) || isAdmin());
      allow update: if isSignedIn() && (
        // Full update for owners/admins
        isOwner(resource.data.userId) || isAdmin() ||
        // Limited update for adding donations
        (
            resource.data.status == 'active' &&
            request.resource.data.donations.size() == resource.data.donations.size() + 1 &&
            request.resource.data.diff(resource.data).affectedKeys().hasOnly(['donations'])
        )
      );

      // == TRIBUTES Sub-Collection ==
      match /tributes/{tributeId} {
        // Anyone signed in can create a tribute on an active memorial
        allow create: if isSignedIn() && get(/databases/$(database)/documents/memorials/$(memorialId)).data.status == 'active';
        // Everyone can read tributes
        allow read: if true;
        // Only the memorial owner or an admin can delete a tribute
        allow delete: if isSignedIn() && (isAdmin() || isOwner(get(/databases/$(database)/documents/memorials/$(memorialId)).data.userId));
        // No one can update a tribute after it's created (except for adding likes)
        allow update: if false;

        // == LIKES Sub-Collection ==
        match /likes/{userId} {
            // A user can only create or delete their own like document
            allow create, delete: if isSignedIn() && isOwner(userId);
            // Nobody needs to read the list of likes directly
            allow read, list: if false;
        }
      }
    }
  }
}
*/