// src/pages/Index.tsx

import React, { useState, useEffect } from 'react';
import UserInfoForm from '@/UserInfoForm';
import AttributeSelector from '@/AttributeSelector';
import AttributeRanking from '@/AttributeRanking';
import ThankYou from '@/ThankYou';
import ProgressBar from '@/ProgressBar';
import { attributes, Attribute, SelectedAttribute, SurveyResponse } from '@/data/surveyData';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Define the steps of the survey.
const TOTAL_STEPS = 5; // UserInfoForm, 3x Attribute Selection/Ranking, ThankYou

const Index = () => {
  // State variables for the survey flow.
  const [currentStep, setCurrentStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [availableAttributes, setAvailableAttributes] = useState<Attribute[]>(attributes);
  const [selectedAttributesData, setSelectedAttributesData] = useState<SelectedAttribute[]>([]);

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

  // Handle user info submission.
  const handleUserInfoSubmit = (name: string, email: string) => {
    setUserName(name);
    setUserEmail(email);
    setCurrentStep(2); // Move to attribute selection.
  };

  // Handle attribute selection.
  const handleAttributeSelect = (attribute: Attribute) => {
    // Remove the selected attribute from the available list.
    setAvailableAttributes(prev => prev.filter(attr => attr.id !== attribute.id));
    // Store the main attribute for the current selection.
    setSelectedAttributesData(prev => [
      ...prev,
      { mainAttribute: attribute.name, scores: {} } // Initialize scores as empty.
    ]);
    setCurrentStep(currentStep + 1); // Move to attribute ranking.
  };

  // Handle attribute ranking submission.
  const handleAttributeRanking = (scores: { [attribute: string]: number }) => {
    setSelectedAttributesData(prev => {
      const lastSelectionIndex = prev.length - 1;
      const updatedSelections = [...prev];
      // Update the scores for the last selected attribute.
      updatedSelections[lastSelectionIndex].scores = scores;
      return updatedSelections;
    });

    if (currentStep < TOTAL_STEPS - 1) { // If not the last ranking step.
      setCurrentStep(currentStep + 1);
    } else {
      // If all selections are done, save the survey data and move to thank you.
      saveSurveyData();
      setCurrentStep(TOTAL_STEPS);
    }
  };

  // Save survey data to Firestore.
  const saveSurveyData = async () => {
    if (!db || !userId || !isAuthReady) {
      console.error("Firestore not initialized or user not authenticated.");
      return;
    }

    try {
      const surveyResponse: SurveyResponse = {
        timestamp: Date.now(),
        name: userName,
        email: userEmail,
        selectedAttributes: selectedAttributesData,
      };

      // Define the collection path for public data.
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const collectionPath = `artifacts/${appId}/public/data/surveyResponses`;

      // Add the document to the 'surveyResponses' collection.
      await addDoc(collection(db, collectionPath), surveyResponse);
      console.log("Survey data saved to Firestore!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Reset the survey to start over.
  const handleStartOver = () => {
    setCurrentStep(1);
    setUserName('');
    setUserEmail('');
    setAvailableAttributes(attributes);
    setSelectedAttributesData([]);
  };

  // Render the appropriate component based on the current step.
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UserInfoForm onNext={handleUserInfoSubmit} />;
      case 2:
      case 3:
      case 4:
        const currentSelectionIndex = currentStep - 2; // 0-indexed for selectedAttributesData.
        const currentMainAttribute = selectedAttributesData[currentSelectionIndex]?.mainAttribute;
        const currentRelatedAttributes = attributes.find(attr => attr.name === currentMainAttribute)?.relatedAttributes || [];

        if (currentMainAttribute && currentRelatedAttributes.length > 0 && Object.keys(selectedAttributesData[currentSelectionIndex].scores).length === 0) {
          // If a main attribute is selected but not yet ranked, show ranking.
          return (
            <AttributeRanking
              mainAttribute={currentMainAttribute}
              relatedAttributes={currentRelatedAttributes}
              onNext={handleAttributeRanking}
              selectionNumber={currentSelectionIndex + 1}
            />
          );
        } else {
          // Otherwise, show attribute selection.
          return (
            <AttributeSelector
              attributes={availableAttributes}
              onSelect={handleAttributeSelect}
              selectionNumber={currentSelectionIndex + 1}
              totalSelections={3}
            />
          );
        }
      case TOTAL_STEPS:
        return <ThankYou onStartOver={handleStartOver} />;
      default:
        return <UserInfoForm onNext={handleUserInfoSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        {currentStep > 1 && currentStep < TOTAL_STEPS && (
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        )}
        {renderStep()}
      </div>
    </div>
  );
};

export default Index;
