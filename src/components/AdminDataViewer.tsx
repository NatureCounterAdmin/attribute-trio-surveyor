// src/AdminDataViewer.tsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SurveyResponse } from '@/data/surveyData';
import { Eye, EyeOff, Download, Trash2 } from 'lucide-react';
import { Firestore, collection, onSnapshot, query, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

interface AdminDataViewerProps {
  db: Firestore; // Firestore instance passed as prop.
  auth: Auth;     // Auth instance passed as prop.
  userId: string; // Current user ID passed as prop.
}

const AdminDataViewer = ({ db, auth, userId }: AdminDataViewerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyResponse[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State for custom confirmation modal.

  // Effect to load survey data from Firestore when component mounts or visibility changes.
  useEffect(() => {
    let unsubscribe: () => void;
    if (isVisible && db) {
      try {
        // Define the collection path for public data.
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const collectionPath = `artifacts/${appId}/public/data/surveyResponses`;
        const q = query(collection(db, collectionPath));

        // Set up a real-time listener for survey responses.
        unsubscribe = onSnapshot(q, (snapshot) => {
          const data: SurveyResponse[] = [];
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() } as SurveyResponse);
          });
          setSurveyData(data);
        }, (error) => {
          console.error("Error fetching survey data: ", error);
        });
      } catch (error) {
        console.error("Error setting up Firestore listener: ", error);
      }
    }

    // Cleanup function to unsubscribe from the listener when the component unmounts or becomes invisible.
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isVisible, db]); // Re-run effect if visibility or db instance changes.

  // Toggle visibility of survey data.
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Show the custom confirmation modal before clearing data.
  const handleClearAllData = () => {
    setShowConfirmModal(true);
  };

  // Confirm and clear all survey data from Firestore.
  const confirmClearAllData = async () => {
    if (!db) {
      console.error("Firestore not initialized.");
      return;
    }

    try {
      // Define the collection path.
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const collectionPath = `artifacts/${appId}/public/data/surveyResponses`;
      const q = query(collection(db, collectionPath));
      const querySnapshot = await getDocs(q);

      // Create a batch to delete all documents efficiently.
      const batch = writeBatch(db);
      querySnapshot.forEach((document) => {
        batch.delete(doc(db, collectionPath, document.id));
      });
      await batch.commit(); // Commit the batch delete operation.

      setSurveyData([]); // Clear local state.
      console.log('All survey data cleared from Firestore');
      setShowConfirmModal(false); // Close the modal.
    } catch (error) {
      console.error("Error clearing survey data: ", error);
      setShowConfirmModal(false); // Close the modal even on error.
    }
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
            // Fill empty columns if selection doesn't exist (e.g., user didn't complete all 3 selections).
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
      <div className="flex gap-2 mb-4">
        <Button
          onClick={toggleVisibility}
          variant="secondary"
          className="flex items-center gap-2"
        >
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {isVisible ? 'Hide Survey Data' : 'View Survey Data'}
        </Button>

        {surveyData.length > 0 && (
          <>
            <Button onClick={exportToCsv} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button onClick={handleClearAllData} variant="destructive" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </Button>
          </>
        )}
      </div>

      {isVisible && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Survey Responses ({surveyData.length})</h3>
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
                                {/* Display scores for each attribute */}
                                {attr.scores && Object.entries(attr.scores).map(([attribute, score]) => (
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

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete all survey responses? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setShowConfirmModal(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={confirmClearAllData} variant="destructive">
                Delete All
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDataViewer;
