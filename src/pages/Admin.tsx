// src/pages/Admin.tsx

import React, { useEffect, useState } from 'react';
import AdminDataViewer from '@/AdminDataViewer';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const Admin = () => {
  // Firebase state variables.
  const [db, setDb] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Initialize Firebase and handle authentication.
  useEffect(() => {
    try {
      // Access global variables provided by the Canvas environment.
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
      const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

      // Initialize Firebase app.
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestoreDb);
      setAuth(firebaseAuth);

      // Listen for authentication state changes.
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          // User is signed in.
          setUserId(user.uid);
        } else {
          // User is signed out, attempt to sign in anonymously or with custom token.
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(firebaseAuth, initialAuthToken);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          } catch (error) {
            console.error("Firebase authentication error:", error);
          }
        }
        setIsAuthReady(true); // Mark authentication as ready.
      });

      // Clean up the auth listener on component unmount.
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
    }
  }, []);

  if (!isAuthReady) {
    return <div className="flex justify-center items-center h-screen">Loading admin panel...</div>;
  }

  if (!db || !auth || !userId) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: Firebase not initialized or user not authenticated.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
        <p className="text-center text-gray-600 mb-6">User ID: <span className="font-mono text-sm break-all">{userId}</span></p>
        <AdminDataViewer db={db} auth={auth} userId={userId} />
      </div>
    </div>
  );
};

export default Admin;
