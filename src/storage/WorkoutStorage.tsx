import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../types/workout';

const STORAGE_KEY = 'WORKOUTS';

export const saveWorkouts = async (workouts: Workout[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Erreur sauvegarde workouts', error);
  }
};

export const loadWorkouts = async (): Promise<Workout[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur chargement workouts', error);
    return [];
  }
};