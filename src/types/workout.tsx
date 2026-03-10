export type Workout = {
  id: string;
  activity: string;
  duration: number;
  intensity: 'faible' | 'moyenne' | 'élevée';
  date: string;
  notes?: string;
 
};