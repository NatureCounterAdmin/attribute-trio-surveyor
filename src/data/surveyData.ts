
export interface Attribute {
  id: string;
  name: string;
  relatedAttributes: string[];
}

export const mainAttributes: Attribute[] = [
  { id: '1', name: 'Adaptability', relatedAttributes: ['Resilience', 'Emotion'] },
  { id: '2', name: 'Awareness', relatedAttributes: ['Focus', 'Cognition'] },
  { id: '3', name: 'Balance', relatedAttributes: ['Strength', 'Calmness'] },
  { id: '4', name: 'Breathing', relatedAttributes: ['Focus', 'Energy'] },
  { id: '5', name: 'Calmness', relatedAttributes: ['Vitality', 'Resilience'] },
  { id: '6', name: 'Cardiohealth', relatedAttributes: ['Endurance', 'Strength'] },
  { id: '7', name: 'Clarity', relatedAttributes: ['Focus', 'Mindfulness'] },
  { id: '8', name: 'Confidence', relatedAttributes: ['Selfhood', 'Assertiveness'] },
  { id: '9', name: 'Connection', relatedAttributes: ['Empathy', 'Community'] },
  { id: '10', name: 'Creativity', relatedAttributes: ['Imagination', 'Positivity'] },
  { id: '11', name: 'Curiosity', relatedAttributes: ['Awareness', 'Engagement'] },
  { id: '12', name: 'Digestion', relatedAttributes: ['Energy', 'Immunity'] },
  { id: '13', name: 'Empathy', relatedAttributes: ['Compassion', 'Community'] },
  { id: '14', name: 'Endurance', relatedAttributes: ['Circulation', 'Strength'] },
  { id: '15', name: 'Energy', relatedAttributes: ['Focus', 'Motivation'] },
  { id: '16', name: 'Esteem', relatedAttributes: ['Confidence', 'Selfhood'] },
  { id: '17', name: 'Expression', relatedAttributes: ['Confidence', 'Resilience'] },
  { id: '18', name: 'Focus', relatedAttributes: ['Adaptability', 'Mindfulness'] },
  { id: '19', name: 'Happiness', relatedAttributes: ['Positivity', 'Wellbeing'] },
  { id: '20', name: 'Hope', relatedAttributes: ['Optimism', 'Resilience'] },
  { id: '21', name: 'Immunity', relatedAttributes: ['Wellbeing', 'Energy'] },
  { id: '22', name: 'Inspiration', relatedAttributes: ['Creativity', 'Positivity'] },
  { id: '23', name: 'Longevity', relatedAttributes: ['Energy', 'Immunity'] },
  { id: '24', name: 'Memory', relatedAttributes: ['Focus', 'Cognition'] },
  { id: '25', name: 'Mindfulness', relatedAttributes: ['Calmness', 'Awareness'] },
  { id: '26', name: 'Mood', relatedAttributes: ['Positivity', 'Wellbeing'] },
  { id: '27', name: 'Patience', relatedAttributes: ['Calmness', 'Endurance'] },
  { id: '28', name: 'Positivity', relatedAttributes: ['Optimism', 'Energy'] },
  { id: '29', name: 'Relaxation', relatedAttributes: ['Calmness', 'Focus'] },
  { id: '30', name: 'Resilience', relatedAttributes: ['Emotion', 'Direction'] },
  { id: '31', name: 'Sleep', relatedAttributes: ['Energy', 'Calmness'] },
  { id: '32', name: 'Social', relatedAttributes: ['Emotion', 'Wellbeing'] },
  { id: '33', name: 'Strength', relatedAttributes: ['Endurance', 'Cardiohealth'] },
  { id: '34', name: 'Trust', relatedAttributes: ['Connection', 'Wellbeing'] },
  { id: '35', name: 'Wellbeing', relatedAttributes: ['Happiness', 'Immunity'] }
];

export interface SurveyResponse {
  timestamp: string;
  name: string;
  email: string;
  selectedAttributes: {
    mainAttribute: string;
    scores: { [attribute: string]: number };
  }[];
}
