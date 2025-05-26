
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AttributeRankingProps {
  mainAttribute: string;
  relatedAttributes: string[];
  onNext: (scores: { [attribute: string]: number }) => void;
  selectionNumber: number;
}

const AttributeRanking = ({ mainAttribute, relatedAttributes, onNext, selectionNumber }: AttributeRankingProps) => {
  const allAttributes = [mainAttribute, ...relatedAttributes];
  const [scores, setScores] = useState<{ [attribute: string]: number }>({});

  const handleScoreChange = (attribute: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [attribute]: score
    }));
  };

  const handleNext = () => {
    if (allAttributes.every(attr => scores[attr])) {
      onNext(scores);
    }
  };

  const isComplete = allAttributes.every(attr => scores[attr]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Score Your {selectionNumber === 1 ? 'First' : selectionNumber === 2 ? 'Second' : 'Third'} Selection
        </h2>
        <p className="text-gray-600">
          Rate each attribute from 1 (lowest) to 5 (highest) based on their importance to you
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {allAttributes.map((attribute) => (
          <Card key={attribute} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-lg">{attribute}</span>
                {attribute === mainAttribute && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Main Attribute
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => handleScoreChange(attribute, score)}
                    className={`w-10 h-10 rounded-full border-2 font-semibold transition-all ${
                      scores[attribute] === score
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          onClick={handleNext} 
          disabled={!isComplete}
          className="px-8 py-2"
        >
          {selectionNumber === 3 ? 'Complete Survey' : 'Next Selection'}
        </Button>
      </div>
    </div>
  );
};

export default AttributeRanking;
