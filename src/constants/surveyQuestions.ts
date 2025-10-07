export const surveyQuestions = [
  // Overall Experience
  { id: 'overall_satisfied', text: 'I am satisfied with my overall experience at Recovery Point.', category: 'Overall Experience' },
  { id: 'safe_environment', text: 'I feel safe and secure in this environment.', category: 'Overall Experience' },
  { id: 'program_helping', text: 'This program is helping me in my recovery journey.', category: 'Overall Experience' },
  
  // Staff & Support
  { id: 'staff_respectful', text: 'Staff members treat me with dignity and respect.', category: 'Staff & Support' },
  { id: 'staff_available', text: 'Staff are available when I need support or have questions.', category: 'Staff & Support' },
  { id: 'staff_knowledgeable', text: 'Staff are knowledgeable and helpful in my recovery.', category: 'Staff & Support' },
  { id: 'concerns_addressed', text: 'My concerns and complaints are addressed in a timely manner.', category: 'Staff & Support' },
  
  // Program Structure
  { id: 'rules_fair', text: 'The program rules and restrictions are fair and necessary for recovery.', category: 'Program Structure' },
  { id: 'daily_structure', text: 'The daily structure and schedule supports my recovery goals.', category: 'Program Structure' },
  { id: 'counseling_helpful', text: 'Individual counseling sessions are helpful and meaningful.', category: 'Program Structure' },
  { id: 'group_valuable', text: 'Group therapy sessions provide value to my recovery.', category: 'Program Structure' },
  { id: 'activities_engaging', text: 'Program activities and classes are engaging and beneficial.', category: 'Program Structure' },
  
  // Living Conditions
  { id: 'housing_adequate', text: 'The housing accommodations meet my basic needs.', category: 'Living Conditions' },
  { id: 'food_satisfactory', text: 'The food quality and meal options are satisfactory.', category: 'Living Conditions' },
  { id: 'facility_clean', text: 'The facility is clean and well-maintained.', category: 'Living Conditions' },
  { id: 'personal_space', text: 'I have adequate personal space and privacy when needed.', category: 'Living Conditions' },
  
  // Personal Growth
  { id: 'coping_skills', text: 'I am developing better coping skills for life challenges.', category: 'Personal Growth' },
  { id: 'relationships_improving', text: 'My relationships with family and others are improving.', category: 'Personal Growth' },
  { id: 'future_hopeful', text: 'I feel hopeful about my future after completing this program.', category: 'Personal Growth' },
  { id: 'making_progress', text: 'I can see positive changes in myself since starting the program.', category: 'Personal Growth' },
  
  // Communication & Resources
  { id: 'info_clear', text: 'Information about program expectations and progress is communicated clearly.', category: 'Communication & Resources' },
  { id: 'resources_available', text: 'Educational and support resources are readily available when I need them.', category: 'Communication & Resources' },
  { id: 'tech_adequate', text: 'The kiosk system provides adequate access for my needs.', category: 'Communication & Resources' },
  
  // Recovery Environment
  { id: 'peers_supportive', text: 'My peers in the program are generally supportive of recovery.', category: 'Recovery Environment' },
  { id: 'triggers_managed', text: 'The program helps me identify and manage my triggers effectively.', category: 'Recovery Environment' },
  { id: 'spiritual_supported', text: 'My spiritual or personal beliefs are respected and supported.', category: 'Recovery Environment' },
  { id: 'prepared_transition', text: 'I feel the program is preparing me for successful transition after completion.', category: 'Recovery Environment' }
];

export const ratingLabels: { [key: string]: string } = {
  '1': 'Strongly Disagree',
  '2': 'Disagree',
  '3': 'Neutral',
  '4': 'Agree',
  '5': 'Strongly Agree'
};

export const getRatingColor = (rating: string): string => {
  switch (rating) {
    case '1':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case '2':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case '3':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    case '4':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case '5':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
