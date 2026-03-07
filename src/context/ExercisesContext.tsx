import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
} from "react";
import { Exercise } from "../types/exercise";

// Types
interface ExercisesState {
  exercises: Exercise[];
  favorites: string[];
  isLoading: boolean;
  error: string | null;
}

type ExercisesAction =
  | {
      type: "SET_INITIAL_DATA";
      payload: { exercises: Exercise[]; favorites: string[] };
    }
  | { type: "ADD_FAVORITE"; payload: string }
  | { type: "REMOVE_FAVORITE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string };

const initialState: ExercisesState = {
  exercises: [],
  favorites: [],
  isLoading: true, // Initial state must be loading
  error: null,
};

const FAVORITES_KEY = "favorites_exercises";

const MOCK_EXERCISES: Exercise[] = [
  {
    id: "1",
    name: "Pompes (Push-ups)",
    description: "Exercice au poids du corps pour les pectoraux et triceps.",
    category: "Musculation",
    muscleGroup: "Pectoraux",
    difficulty: "medium",
  },
  {
    id: "2",
    name: "Squats",
    description: "Exercice fondamental pour les jambes et fessiers.",
    category: "Musculation",
    muscleGroup: "Jambes",
    difficulty: "medium",
  },
  {
    id: "3",
    name: "Planche (Plank)",
    description: "Gainage pour le tronc et les abdominaux.",
    category: "Gainage",
    muscleGroup: "Abdominaux",
    difficulty: "easy",
  },
  {
    id: "4",
    name: "Burpees",
    description: "Exercice complet cardio et musculaire.",
    category: "Cardio",
    muscleGroup: "Corps entier",
    difficulty: "hard",
  },
  {
    id: "5",
    name: "Fentes (Lunges)",
    description: "Exercice unilatéral pour les jambes.",
    category: "Musculation",
    muscleGroup: "Jambes",
    difficulty: "medium",
  },
];

const exercisesReducer = (
  state: ExercisesState,
  action: ExercisesAction,
): ExercisesState => {
  switch (action.type) {
    case "SET_INITIAL_DATA":
      return {
        ...state,
        exercises: action.payload.exercises,
        favorites: action.payload.favorites,
        isLoading: false,
      };
    case "ADD_FAVORITE":
      if (state.favorites.includes(action.payload)) return state;
      return { ...state, favorites: [...state.favorites, action.payload] };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

interface ExercisesContextType extends ExercisesState {
  toggleFavorite: (id: string) => void;
  loadExercises: () => void;
}

const ExercisesContext = createContext<ExercisesContextType | undefined>(
  undefined,
);

export const ExercisesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(exercisesReducer, initialState);

  useEffect(() => {
    const init = async () => {
      // Don't set loading here if it's already true from initialState,
      // but if re-running, maybe we want to. For init, just proceed.
      try {
        // Simulate API fetch delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Parallel load
        const [storedFavorites] = await Promise.all([
          AsyncStorage.getItem(FAVORITES_KEY),
        ]);

        const favorites: string[] = storedFavorites
          ? JSON.parse(storedFavorites)
          : [];

        dispatch({
          type: "SET_INITIAL_DATA",
          payload: { exercises: MOCK_EXERCISES, favorites },
        });
      } catch (error) {
        console.error("Failed to load exercises data", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Erreur de chargement des données",
        });
      }
    };

    init();
  }, []);

  // Save favorites whenever they change, BUT only if not loading to prevent overwrite
  // Since we use SET_INITIAL_DATA to unset isLoading, this effect should be safe
  // as users can't trigger ADD/REMOVE before init completes (unless UI exposed prematurely, but isLoading protects that)
  useEffect(() => {
    if (!state.isLoading) {
      AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(state.favorites),
      ).catch((e) => console.error(e));
    }
  }, [state.favorites, state.isLoading]);

  const toggleFavorite = (id: string) => {
    if (state.favorites.includes(id)) {
      dispatch({ type: "REMOVE_FAVORITE", payload: id });
    } else {
      dispatch({ type: "ADD_FAVORITE", payload: id });
    }
  };

  const loadExercises = () => {
    // Reload logic if needed, simplified for now
  };

  return (
    <ExercisesContext.Provider
      value={{ ...state, toggleFavorite, loadExercises }}
    >
      {children}
    </ExercisesContext.Provider>
  );
};

export const useExercises = () => {
  const context = useContext(ExercisesContext);
  if (context === undefined) {
    throw new Error("useExercises must be used within a ExercisesProvider");
  }
  return context;
};
