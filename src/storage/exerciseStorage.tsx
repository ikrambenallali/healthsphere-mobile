import AsyncStorage from "@react-native-async-storage/async-storage";
import { Exercise } from "../types/exercise";

const EXERCISES_KEY = "EXERCISES_CACHE";

export const saveExercisesCache = async (data: {
  exercises: any[];
  favorites: string[];
  favoritesMap: Record<string, string>;
}) => {
  try {
    await AsyncStorage.setItem(
      "exercises_cache",
      JSON.stringify(data)
    );
  } catch (error) {
    console.log("Error saving cache", error);
  }
};

export const loadExercisesCache = async () => {
  try {
    const data = await AsyncStorage.getItem("exercises_cache");

    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.log("Error loading cache", error);
    return null;
  }
};