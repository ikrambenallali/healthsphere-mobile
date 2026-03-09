import AsyncStorage from "@react-native-async-storage/async-storage";
import { Exercise } from "../types/exercise";

const EXERCISES_KEY = "EXERCISES_CACHE";

export const saveExercisesCache = async (data: Exercise[]) => {
  try {
    await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(data));
  } catch (error) {
    console.log("Cache save error", error);
  }
};

export const loadExercisesCache = async (): Promise<Exercise[]> => {
  try {
    const data = await AsyncStorage.getItem(EXERCISES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Cache load error", error);
    return [];
  }
};