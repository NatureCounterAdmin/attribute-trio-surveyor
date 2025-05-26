
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { mainAttributes, SurveyResponse, Attribute } from '@/data/surveyData';
import ProgressBar from '@/components/ProgressBar';
import UserInfoForm from '@/components/UserInfoForm';
import AttributeSelector from '@/components/AttributeSelector';
import AttributeRanking from '@/components/AttributeRanking';
import ThankYou from '@/components/ThankYou';

type SurveyStep = 'userInfo' | 'selectAttribute' | 'rankAttributes' | 'thankYou';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<SurveyStep>('userInfo');
  const [stepNumber, setStepNumber] = useState(1);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [selectedAttributes, setSelectedAttributes] = useState<Attribute[]>([]);
  const [currentSelection, setCurrentSelection] = useState(1);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse['selectedAttributes']>([]);
  const [availableAttributes, setAvailableAttributes] = useState<Attribute[]>(mainAttributes);

  const totalSteps = 8; // userInfo(1) + select1(2) + rank1(3) + select2(4) + rank2(5) + select3(6) + rank3(7) + thankYou(8)

  const handleUserInfo = (name: string, email: string) => {
    setUserInfo({ name, email });
    setCurrentStep('selectAttribute');
    setStepNumber(2);
    console.log('User info collected:', { name, email });
  };

  const handleAttributeSelection = (attribute: Attribute) => {
    setSelectedAttributes([...selectedAttributes, attribute]);
    setAvailableAttributes(availableAttributes.filter(attr => attr.id !== attribute.id));
    setCurrentStep('rankAttributes');
    setStepNumber(stepNumber + 1);
    console.log('Attribute selected:', attribute.name);
  };

  const handleRanking = (rankings: string[]) => {
    const currentAttribute = selectedAttributes[currentSelection - 1];
    const newResponse = {
      mainAttribute: currentAttribute.name,
      rankings: rankings
    };
    
    setSurveyResponses([...surveyResponses, newResponse]);
    console.log('Rankings submitted:', rankings);

    if (currentSelection === 3) {
      // Survey complete
      const finalResponse: SurveyResponse = {
        timestamp: new Date().toISOString(),
        name: userInfo.name,
        email: userInfo.email,
        selectedAttributes: [...surveyResponses, newResponse]
      };
      
      // Store in localStorage
      const existingResponses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
      localStorage.setItem('surveyResponses', JSON.stringify([...existingResponses, finalResponse]));
      
      console.log('Survey completed:', finalResponse);
      toast({
        title: "Survey Completed!",
        description: "Your responses have been saved successfully.",
      });
      
      setCurrentStep('thankYou');
      setStepNumber(8);
    } else {
      // Move to next selection
      setCurrentSelection(currentSelection + 1);
      setCurrentStep('selectAttribute');
      setStepNumber(stepNumber + 1);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('userInfo');
    setStepNumber(1);
    setUserInfo({ name: '', email: '' });
    setSelectedAttributes([]);
    setCurrentSelection(1);
    setSurveyResponses([]);
    setAvailableAttributes(mainAttributes);
    console.log('Survey reset');
  };

  const getCurrentAttribute = () => {
    return selectedAttributes[currentSelection - 1];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {currentStep !== 'thankYou' && (
          <ProgressBar currentStep={stepNumber} totalSteps={totalSteps} />
        )}
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 'userInfo' && (
            <UserInfoForm onNext={handleUserInfo} />
          )}
          
          {currentStep === 'selectAttribute' && (
            <AttributeSelector
              attributes={availableAttributes}
              onSelect={handleAttributeSelection}
              selectionNumber={currentSelection}
              totalSelections={3}
            />
          )}
          
          {currentStep === 'rankAttributes' && (
            <AttributeRanking
              mainAttribute={getCurrentAttribute().name}
              relatedAttributes={getCurrentAttribute().relatedAttributes}
              onNext={handleRanking}
              selectionNumber={currentSelection}
            />
          )}
          
          {currentStep === 'thankYou' && (
            <ThankYou onStartOver={handleStartOver} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
