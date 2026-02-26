import React, { createContext, useContext, useEffect, useState } from 'react';
import { Workout } from '../types/workout';
import { loadWorkouts, saveWorkouts } from '../storage/WorkoutStorage';

type WorkoutContextType = {
  workouts: Workout[];
  loading: boolean;
  addWorkout: (workout: Workout) => void;
  removeWorkout: (id: string) => void;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const data = await loadWorkouts();
      setWorkouts(data);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    saveWorkouts(workouts);
  }, [workouts]);

  const addWorkout = (workout: Workout) => {
    setWorkouts(prev => [...prev, workout]);
  };

  const removeWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  return (
    <WorkoutContext.Provider
      value={{ workouts, loading, addWorkout, removeWorkout }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkouts must be used inside WorkoutProvider');
  }
  return context;
};