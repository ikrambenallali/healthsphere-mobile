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

// Fonction pour récupérer tous les exercices
export const fetchExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await api.get("/exercises");

    // On suppose que la réponse a la forme { success: true, data: [...] }
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

export default api;
