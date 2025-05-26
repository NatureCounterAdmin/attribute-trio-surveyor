
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface AttributeRankingProps {
  mainAttribute: string;
  relatedAttributes: string[];
  onNext: (rankings: string[]) => void;
  selectionNumber: number;
}

const AttributeRanking = ({ mainAttribute, relatedAttributes, onNext, selectionNumber }: AttributeRankingProps) => {
  const allAttributes = [mainAttribute, ...relatedAttributes];
  const [rankings, setRankings] = useState<string[]>(allAttributes);

  const moveUp = (index: number) => {
    if (index > 0) {
      const newRankings = [...rankings];
      [newRankings[index], newRankings[index - 1]] = [newRankings[index - 1], newRankings[index]];
      setRankings(newRankings);
    }
  };

  const moveDown = (index: number) => {
    if (index < rankings.length - 1) {
      const newRankings = [...rankings];
      [newRankings[index], newRankings[index + 1]] = [newRankings[index + 1], newRankings[index]];
      setRankings(newRankings);
    }
  };

  const handleNext = () => {
    onNext(rankings);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Rank Your {selectionNumber === 1 ? 'First' : selectionNumber === 2 ? 'Second' : 'Third'} Selection
        </h2>
        <p className="text-gray-600">
          Arrange these attributes by importance to you (most important at the top)
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {rankings.map((attribute, index) => (
          <Card key={attribute} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                  {index + 1}
                </span>
                <span className="font-medium text-lg">{attribute}</span>
                {attribute === mainAttribute && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Main Attribute
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveDown(index)}
                  disabled={index === rankings.length - 1}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button onClick={handleNext} className="px-8 py-2">
          {selectionNumber === 3 ? 'Complete Survey' : 'Next Selection'}
        </Button>
      </div>
    </div>
  );
};

export default AttributeRanking;
