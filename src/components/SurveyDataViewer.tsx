
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SurveyResponse } from '@/data/surveyData';
import { Eye, EyeOff, Download } from 'lucide-react';

const SurveyDataViewer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyResponse[]>([]);

  const loadSurveyData = () => {
    const storedData = localStorage.getItem('surveyResponses');
    if (storedData) {
      setSurveyData(JSON.parse(storedData));
    }
    setIsVisible(!isVisible);
  };

  const exportToCsv = () => {
    if (surveyData.length === 0) return;

    const headers = ['Timestamp', 'Name', 'Email', 'Main Attribute 1', 'Rankings 1', 'Main Attribute 2', 'Rankings 2', 'Main Attribute 3', 'Rankings 3'];
    
    const csvContent = [
      headers.join(','),
      ...surveyData.map(response => [
        new Date(response.timestamp).toLocaleString(),
        response.name,
        response.email,
        response.selectedAttributes[0]?.mainAttribute || '',
        response.selectedAttributes[0]?.rankings.join('; ') || '',
        response.selectedAttributes[1]?.mainAttribute || '',
        response.selectedAttributes[1]?.rankings.join('; ') || '',
        response.selectedAttributes[2]?.mainAttribute || '',
        response.selectedAttributes[2]?.rankings.join('; ') || ''
      ].map(field => `"${field}"`).join(','))
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
                    <TableHead>Attributes & Rankings</TableHead>
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
                        <div className="space-y-2">
                          {response.selectedAttributes.map((attr, attrIndex) => (
                            <div key={attrIndex} className="text-sm">
                              <span className="font-semibold">{attr.mainAttribute}:</span>
                              <span className="ml-2 text-gray-600">
                                {attr.rankings.join(' → ')}
                              </span>
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
