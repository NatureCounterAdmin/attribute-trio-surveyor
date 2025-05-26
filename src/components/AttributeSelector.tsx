
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Attribute } from '@/data/surveyData';

interface AttributeSelectorProps {
  attributes: Attribute[];
  onSelect: (attribute: Attribute) => void;
  selectionNumber: number;
  totalSelections: number;
}

const AttributeSelector = ({ attributes, onSelect, selectionNumber, totalSelections }: AttributeSelectorProps) => {
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);

  const handleSelect = (attribute: Attribute) => {
    setSelectedAttribute(attribute);
  };

  const handleNext = () => {
    if (selectedAttribute) {
      onSelect(selectedAttribute);
    }
  };

  const remainingAttributes = attributes.length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Select Your {selectionNumber === 1 ? 'First' : selectionNumber === 2 ? 'Second' : 'Third'} Main Attribute
        </h2>
        <p className="text-gray-600">
          Choose from {remainingAttributes} remaining attributes ({totalSelections - selectionNumber + 1} more to go)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {attributes.map((attribute) => (
          <Card
            key={attribute.id}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedAttribute?.id === attribute.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSelect(attribute)}
          >
            <h3 className="font-semibold text-lg mb-2">{attribute.name}</h3>
            <div className="text-sm text-gray-600">
              <p>Related attributes:</p>
              <ul className="list-disc list-inside">
                {attribute.relatedAttributes.map((related, index) => (
                  <li key={index}>{related}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={handleNext}
          disabled={!selectedAttribute}
          className="px-8 py-2"
        >
          Continue to Ranking
        </Button>
      </div>
    </div>
  );
};

export default AttributeSelector;
