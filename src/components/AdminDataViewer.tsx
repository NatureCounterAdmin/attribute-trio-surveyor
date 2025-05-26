
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SurveyResponse } from '@/data/surveyData';
import { Eye, EyeOff, Download, Trash2 } from 'lucide-react';

const AdminDataViewer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyResponse[]>([]);

  const loadSurveyData = () => {
    const storedData = localStorage.getItem('surveyResponses');
    if (storedData) {
      setSurveyData(JSON.parse(storedData));
    }
    setIsVisible(!isVisible);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to delete all survey responses? This action cannot be undone.')) {
      localStorage.removeItem('surveyResponses');
      setSurveyData([]);
      console.log('All survey data cleared');
    }
  };

  const exportToCsv = () => {
    if (surveyData.length === 0) return;

    const headers = ['Timestamp', 'Name', 'Email'];
    
    // Add headers for each selection (main attribute + scores)
    for (let i = 1; i <= 3; i++) {
      headers.push(`Main Attribute ${i}`);
      headers.push(`Main Attribute ${i} Score`);
      headers.push(`Related Attribute ${i}A`);
      headers.push(`Related Attribute ${i}A Score`);
      headers.push(`Related Attribute ${i}B`);
      headers.push(`Related Attribute ${i}B Score`);
    }
    
    const csvContent = [
      headers.join(','),
      ...surveyData.map(response => {
        const row = [
          new Date(response.timestamp).toLocaleString(),
          response.name,
          response.email
        ];
        
        // Add data for each selection
        for (let i = 0; i < 3; i++) {
          const selection = response.selectedAttributes[i];
          if (selection) {
            row.push(selection.mainAttribute);
            row.push(selection.scores[selection.mainAttribute]?.toString() || '');
            
            // Find related attributes (non-main attributes)
            const relatedAttrs = Object.keys(selection.scores).filter(attr => attr !== selection.mainAttribute);
            row.push(relatedAttrs[0] || '');
            row.push(selection.scores[relatedAttrs[0]]?.toString() || '');
            row.push(relatedAttrs[1] || '');
            row.push(selection.scores[relatedAttrs[1]]?.toString() || '');
          } else {
            // Fill empty columns if selection doesn't exist
            row.push('', '', '', '', '', '');
          }
        }
        
        return row.map(field => `"${field}"`).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `survey-responses-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-6">
      <div className="flex gap-2 mb-4">
        <Button 
          onClick={loadSurveyData} 
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
            <Button onClick={clearAllData} variant="destructive" className="flex items-center gap-2">
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

export default AdminDataViewer;
