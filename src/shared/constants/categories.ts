export const STUDY_CATEGORIES = [
  { id: 'all', label: '🌟 All', rawName: 'All', icon: '🌟' },
  { id: 'daily', label: '☕ Daily & Greetings', rawName: 'Daily', icon: '☕' },
  { id: 'food', label: '🍲 Food & Dining', rawName: 'Food', icon: '🍲' },
  { id: 'emotions', label: '💖 Emotions & Caring', rawName: 'Emotions', icon: '💖' },
  { id: 'travel', label: '✈️ Travel & Directions', rawName: 'Travel', icon: '✈️' },
  { id: 'social', label: '💬 Social & Talk', rawName: 'Social', icon: '💬' },
] as const;

export type CategoryId = typeof STUDY_CATEGORIES[number]['id'];
