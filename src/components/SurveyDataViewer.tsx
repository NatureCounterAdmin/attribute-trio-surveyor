// src/SurveyDataViewer.tsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SurveyResponse } from '@/data/surveyData';
import { Eye, EyeOff, Download } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query } from 'firebase/firestore';

const SurveyDataViewer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyResponse[]>([]);
  const [db, setDb] = useState<any>(null); // Firestore instance.
  const [isAuthReady, setIsAuthReady] = useState(false); // Auth readiness.

  // Initialize Firebase and set up listener for survey data.
  useEffect(() => {
    let unsubscribe: () => void;
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

      // Listen for authentication state changes.
      const authUnsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (!user) {
          // If user is not signed in, attempt to sign in anonymously or with custom token.
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

      // Set up real-time listener for survey responses if DB is ready and visible.
      if (isVisible && firestoreDb && isAuthReady) {
        // Define the collection path for public data.
        const collectionPath = `artifacts/${appId}/public/data/surveyResponses`;
        const q = query(collection(firestoreDb, collectionPath));

        unsubscribe = onSnapshot(q, (snapshot) => {
          const data: SurveyResponse[] = [];
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() } as SurveyResponse);
          });
          setSurveyData(data);
        }, (error) => {
          console.error("Error fetching survey data: ", error);
        });
      }

      // Cleanup function for both auth and data listeners.
      return () => {
        authUnsubscribe();
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } catch (error) {
      console.error("Failed to initialize Firebase or set up listener:", error);
    }
  }, [isVisible, db, isAuthReady]); // Re-run effect if visibility, db, or auth readiness changes.

  // Toggle visibility of survey data.
  const loadSurveyData = () => {
    setIsVisible(!isVisible);
  };

  // Export survey data to a CSV file.
  const exportToCsv = () => {
    if (surveyData.length === 0) return;

    const headers = ['Timestamp', 'Name', 'Email'];

    // Dynamically add headers for each selection (main attribute + scores).
    // Assuming a maximum of 3 selections based on the survey flow.
    for (let i = 1; i <= 3; i++) {
      headers.push(`Main Attribute ${i}`);
      headers.push(`Main Attribute ${i} Score`);
      headers.push(`Related Attribute ${i}A`);
      headers.push(`Related Attribute ${i}A Score`);
      headers.push(`Related Attribute ${i}B`);
      headers.push(`Related Attribute ${i}B Score`);
    }

    const csvContent = [
      headers.join(','), // Join headers with comma.
      ...surveyData.map(response => {
        const row = [
          new Date(response.timestamp).toLocaleString(), // Format timestamp.
          response.name,
          response.email
        ];

        // Add data for each selection.
        for (let i = 0; i < 3; i++) {
          const selection = response.selectedAttributes[i];
          if (selection) {
            row.push(selection.mainAttribute); // Main attribute name.
            row.push(selection.scores[selection.mainAttribute]?.toString() || ''); // Main attribute score.

            // Filter out the main attribute to get related attributes.
            const relatedAttrs = Object.keys(selection.scores).filter(attr => attr !== selection.mainAttribute);
            row.push(relatedAttrs[0] || ''); // First related attribute name.
            row.push(selection.scores[relatedAttrs[0]]?.toString() || ''); // First related attribute score.
            row.push(relatedAttrs[1] || ''); // Second related attribute name.
            row.push(selection.scores[relatedAttrs[1]]?.toString() || ''); // Second related attribute score.
          } else {
            // Fill empty columns if selection doesn't exist.
            row.push('', '', '', '', '', '');
          }
        }
        // Enclose each field in double quotes to handle commas within data.
        return row.map(field => `"${field}"`).join(',');
      })
    ].join('\n'); // Join rows with newline.

    // Create a Blob and download the CSV file.
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `survey-responses-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden'; // Hide the link.
    document.body.appendChild(link); // Append to body to make it clickable.
    link.click(); // Programmatically click the link to trigger download.
    document.body.removeChild(link); // Remove the link after download.
  };

  return (
    <div className="mt-6">
      <Button
        onClick={loadSurveyData}
        variant="secondary"
        className="mb-4 flex items-center gap-2"
      >
        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {isVisible ? 'Hide Survey Data' : 'View Survey Data'}
      </Button>

      {isVisible && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Survey Responses ({surveyData.length})</h3>
            {surveyData.length > 0 && (
              <Button onClick={exportToCsv} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            )}
          </div>

          {surveyData.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No survey responses found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Attributes & Scores</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surveyData.map((response, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">
                        {new Date(response.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{response.name}</TableCell>
                      <TableCell>{response.email}</TableCell>
                      <TableCell>
                        <div className="space-y-3">
                          {response.selectedAttributes.map((attr, attrIndex) => (
                            <div key={attrIndex} className="text-sm border-l-2 border-blue-200 pl-3">
                              <span className="font-semibold text-blue-700">{attr.mainAttribute} (Main)</span>
                              <div className="ml-4 space-y-1">
                                {Object.entries(attr.scores).map(([attribute, score]) => (
                                  <div key={attribute} className="flex justify-between">
                                    <span className={attribute === attr.mainAttribute ? 'font-medium' : 'text-gray-600'}>
                                      {attribute}:
                                    </span>
                                    <span className="font-semibold">{score}/5</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SurveyDataViewer;
