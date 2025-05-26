
export interface Attribute {
  id: string;
  name: string;
  relatedAttributes: string[];
}

export const mainAttributes: Attribute[] = [
  { id: '1', name: 'Leadership', relatedAttributes: ['Decision Making', 'Team Management'] },
  { id: '2', name: 'Creativity', relatedAttributes: ['Innovation', 'Artistic Expression'] },
  { id: '3', name: 'Communication', relatedAttributes: ['Public Speaking', 'Written Skills'] },
  { id: '4', name: 'Problem Solving', relatedAttributes: ['Analytical Thinking', 'Critical Analysis'] },
  { id: '5', name: 'Adaptability', relatedAttributes: ['Flexibility', 'Change Management'] },
  { id: '6', name: 'Empathy', relatedAttributes: ['Understanding Others', 'Emotional Support'] },
  { id: '7', name: 'Organization', relatedAttributes: ['Time Management', 'Planning'] },
  { id: '8', name: 'Technical Skills', relatedAttributes: ['Programming', 'Software Proficiency'] },
  { id: '9', name: 'Research', relatedAttributes: ['Data Analysis', 'Information Gathering'] },
  { id: '10', name: 'Networking', relatedAttributes: ['Relationship Building', 'Social Connections'] },
  { id: '11', name: 'Teaching', relatedAttributes: ['Knowledge Transfer', 'Mentoring'] },
  { id: '12', name: 'Sales', relatedAttributes: ['Persuasion', 'Customer Relations'] },
  { id: '13', name: 'Financial Management', relatedAttributes: ['Budgeting', 'Investment Planning'] },
  { id: '14', name: 'Project Management', relatedAttributes: ['Resource Allocation', 'Timeline Management'] },
  { id: '15', name: 'Design', relatedAttributes: ['Visual Design', 'User Experience'] },
  { id: '16', name: 'Writing', relatedAttributes: ['Content Creation', 'Storytelling'] },
  { id: '17', name: 'Marketing', relatedAttributes: ['Brand Strategy', 'Digital Marketing'] },
  { id: '18', name: 'Customer Service', relatedAttributes: ['Client Support', 'Issue Resolution'] },
  { id: '19', name: 'Strategy', relatedAttributes: ['Long-term Planning', 'Vision Development'] },
  { id: '20', name: 'Quality Assurance', relatedAttributes: ['Testing', 'Process Improvement'] },
  { id: '21', name: 'Negotiation', relatedAttributes: ['Conflict Resolution', 'Deal Making'] },
  { id: '22', name: 'Innovation', relatedAttributes: ['Idea Generation', 'Product Development'] },
  { id: '23', name: 'Risk Management', relatedAttributes: ['Risk Assessment', 'Mitigation Strategies'] },
  { id: '24', name: 'Cultural Awareness', relatedAttributes: ['Diversity Understanding', 'Global Perspective'] },
  { id: '25', name: 'Health & Wellness', relatedAttributes: ['Fitness Coaching', 'Nutrition Knowledge'] },
  { id: '26', name: 'Environmental Sustainability', relatedAttributes: ['Green Practices', 'Conservation'] },
  { id: '27', name: 'Legal Knowledge', relatedAttributes: ['Compliance', 'Contract Review'] },
  { id: '28', name: 'Data Science', relatedAttributes: ['Statistical Analysis', 'Machine Learning'] },
  { id: '29', name: 'Event Planning', relatedAttributes: ['Logistics Coordination', 'Vendor Management'] },
  { id: '30', name: 'Photography', relatedAttributes: ['Visual Composition', 'Photo Editing'] },
  { id: '31', name: 'Music', relatedAttributes: ['Performance', 'Composition'] },
  { id: '32', name: 'Cooking', relatedAttributes: ['Recipe Development', 'Food Presentation'] },
  { id: '33', name: 'Travel Planning', relatedAttributes: ['Itinerary Design', 'Budget Management'] },
  { id: '34', name: 'Language Skills', relatedAttributes: ['Translation', 'Cultural Communication'] },
  { id: '35', name: 'Physical Fitness', relatedAttributes: ['Exercise Programming', 'Athletic Performance'] }
];

export interface SurveyResponse {
  timestamp: string;
  name: string;
  email: string;
  selectedAttributes: {
    mainAttribute: string;
    rankings: string[];
  }[];
}
