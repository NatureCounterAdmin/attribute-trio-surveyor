
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ThankYouProps {
  onStartOver: () => void;
}

const ThankYou = ({ onStartOver }: ThankYouProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <Card className="p-8">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-700 mb-2">Thank You!</h2>
          <p className="text-gray-600 text-lg">
            Your survey responses have been successfully recorded.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-2">What happens next?</h3>
          <p className="text-gray-600">
            Your responses will help us better understand your preferences and attributes. 
            Thank you for taking the time to complete this comprehensive survey.
          </p>
        </div>

        <Button onClick={onStartOver} variant="outline" className="px-8 py-2">
          Take Survey Again
        </Button>
      </Card>
    </div>
  );
};

export default ThankYou;
