import axios from "axios";
import { Exercise } from "../types/exercise";

// URL de base de l'API
const BASE_URL = "https://healthsphere-api.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper pour mapper la difficulté de l'API vers notre type interne
const mapDifficulty = (
  difficulty: string,
): "easy" | "medium" | "hard" | undefined => {
  switch (difficulty) {
    case "Beginner":
      return "easy";
    case "Intermediate":
      return "medium";
    case "Advanced":
      return "hard";
    default:
      return undefined;
  }
};
// ...
// Helper pour mapper la difficulté interne vers l'API
const mapDifficultyToApi = (
  difficulty?: "easy" | "medium" | "hard",
): string => {
  switch (difficulty) {
    case "easy":
      return "Beginner";
    case "medium":
      return "Intermediate";
    case "hard":
      return "Advanced";
    default:
      return "Beginner"; // Default to Beginner/Easy if undefined
  }
};
// ...

// ...
// Fonction pour récupérer tous les exercices
export const fetchExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await api.get("/exercises");

    // On suppose que la réponse a la forme { success: true, count: N, data: [...] }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map((item: any) => ({
        id: item._id, // Mapper _id (MongoDB) vers id
        name: item.name,
        description: item.description,
        category: item.category,
        difficulty: mapDifficulty(item.difficulty),
        muscleGroup: item.muscleGroup, // Peut être undefined
        imageUrl: item.imageUrl, // Peut être undefined
      }));
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des exercices:", error);
    // On propage l'erreur pour qu'elle puisse être gérée par le composant ou le context
    throw error;
  }
};
// ...

// Fonction pour récupérer un exercice par ID
export const fetchExerciseById = async (
  id: string,
): Promise<Exercise | null> => {
  try {
    const response = await api.get(`/exercises/${id}`);

    if (response.data && response.data.data) {
      const item = response.data.data;
      return {
        id: item._id,
        name: item.name,
        description: item.description,
        category: item.category,
        difficulty: mapDifficulty(item.difficulty),
        muscleGroup: item.muscleGroup,
        imageUrl: item.imageUrl,
      };
    }
    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'exercice ${id}:`, error);
    throw error;
  }
};

// ...
export const createExercise = async (
  exerciseData: Omit<Exercise, "id">,
): Promise<Exercise> => {
  try {
    const payload = {
      name: exerciseData.name,
      description: exerciseData.description,
      category: exerciseData.category,
      difficulty: mapDifficultyToApi(exerciseData.difficulty),
      muscleGroup: exerciseData.muscleGroup,
      imageUrl: exerciseData.imageUrl,
      duration: 10, // Default
    };
    const response = await api.post("/exercises", payload);
    // Sometimes backend returns created object directly or inside data
    const item = response.data.data || response.data;
    return {
      id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      difficulty: mapDifficulty(item.difficulty),
      muscleGroup: item.muscleGroup,
      imageUrl: item.imageUrl,
    };
  } catch (error) {
    console.error("Error creating exercise:", error);
    throw error;
  }
};

export const updateExercise = async (
  id: string,
  exerciseData: Partial<Exercise>,
): Promise<Exercise> => {
  try {
    const payload: any = { ...exerciseData };
    if (exerciseData.difficulty) {
      payload.difficulty = mapDifficultyToApi(exerciseData.difficulty);
    }
    const response = await api.put(`/exercises/${id}`, payload);
    const item = response.data.data || response.data;
    return {
      id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      difficulty: mapDifficulty(item.difficulty),
      muscleGroup: item.muscleGroup,
      imageUrl: item.imageUrl,
    };
  } catch (error) {
    console.error("Error updating exercise:", error);
    throw error;
  }
};

export const deleteExercise = async (id: string): Promise<void> => {
  try {
    await api.delete(`/exercises/${id}`);
  } catch (error) {
    console.error("Error deleting exercise:", error);
    throw error;
  }
};

// Favorites API

export const fetchFavorites = async (): Promise<
  { id: string; exerciseId: string }[]
> => {
  try {
    const response = await api.get("/favorites");

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data
        .filter((item: any) => item.exerciseId) // éviter null
        .map((item: any) => ({
          id: item._id,
          exerciseId:
            typeof item.exerciseId === "object"
              ? item.exerciseId._id
              : item.exerciseId,
        }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

export const addFavorite = async (
  exerciseId: string,
): Promise<{ id: string; exerciseId: string }> => {
  try {
    console.log("Adding favorite:", exerciseId);

    const response = await api.post("/favorites", { exerciseId });
    const item = response.data.data;
    return {
      id: item._id,
      exerciseId: item.exerciseId,
    };
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

export const removeFavorite = async (favoriteId: string): Promise<void> => {
  try {
    await api.delete(`/favorites/${favoriteId}`);
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};

export default api;
