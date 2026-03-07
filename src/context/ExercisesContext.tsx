import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
} from "react";
import { fetchExercises } from "../services/api";
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
        error: null,
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
      return { ...state, isLoading: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

interface ExercisesContextType extends ExercisesState {
  toggleFavorite: (id: string) => void;
  loadExercises: () => Promise<void>;
}

const ExercisesContext = createContext<ExercisesContextType | undefined>(
  undefined,
);

export const ExercisesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(exercisesReducer, initialState);

  const loadData = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Parallel load
      const [exercises, storedFavorites] = await Promise.all([
        fetchExercises(),
        AsyncStorage.getItem(FAVORITES_KEY),
      ]);

      const favorites: string[] = storedFavorites
        ? JSON.parse(storedFavorites)
        : [];

      dispatch({
        type: "SET_INITIAL_DATA",
        payload: { exercises, favorites },
      });
    } catch (error) {
      console.error("Failed to load exercises data", error);
      dispatch({
        type: "SET_ERROR",
        payload:
          "Impossible de charger les exercices. Vérifiez votre connexion.",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save favorites whenever they change, BUT only if not loading
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

  const loadExercises = async () => {
    await loadData();
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
