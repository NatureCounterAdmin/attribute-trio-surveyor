// src/data/surveyData.ts

// Interface for a single attribute, defining its structure.
export interface Attribute {
  id: string; // Unique identifier for the attribute.
  name: string; // Display name of the attribute.
  relatedAttributes: string[]; // List of attributes related to this main attribute.
}

// Interface for an attribute selected by the user, including its scores.
export interface SelectedAttribute {
  mainAttribute: string; // The primary attribute chosen by the user.
  scores: { [attribute: string]: number }; // Scores given to the main attribute and its related attributes.
}

// Interface for a complete survey response.
export interface SurveyResponse {
  timestamp: number; // Timestamp when the survey was completed.
  name: string; // Name of the survey taker.
  email: string; // Email of the survey taker.
  selectedAttributes: SelectedAttribute[]; // Array of selected attributes and their scores.
}

// Predefined list of attributes for the survey.
export const attributes: Attribute[] = [
  {
    id: 'innovation',
    name: 'Innovation',
    relatedAttributes: ['Creativity', 'Problem Solving'],
  },
  {
    id: 'customer_focus',
    name: 'Customer Focus',
    relatedAttributes: ['Empathy', 'Service Orientation'],
  },
  {
    id: 'teamwork',
    name: 'Teamwork',
    relatedAttributes: ['Collaboration', 'Communication'],
  },
  {
    id: 'adaptability',
    name: 'Adaptability',
    relatedAttributes: ['Flexibility', 'Resilience'],
  },
  {
    id: 'integrity',
    name: 'Integrity',
    relatedAttributes: ['Honesty', 'Ethics'],
  },
  {
    id: 'efficiency',
    name: 'Efficiency',
    relatedAttributes: ['Productivity', 'Organization'],
  },
  {
    id: 'quality',
    name: 'Quality',
    relatedAttributes: ['Accuracy', 'Attention to Detail'],
  },
  {
    id: 'leadership',
    name: 'Leadership',
    relatedAttributes: ['Motivation', 'Decision Making'],
  },
  {
    id: 'strategic_thinking',
    name: 'Strategic Thinking',
    relatedAttributes: ['Vision', 'Planning'],
  },
];
