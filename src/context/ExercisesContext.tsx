import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  addFavorite,
  createExercise,
  deleteExercise,
  fetchExercises,
  fetchFavorites,
  removeFavorite,
} from "../services/api";
import { Exercise } from "../types/exercise";
import { loadExercisesCache, saveExercisesCache } from "../storage/exerciseStorage";
import { isConnected } from "../utils/network";
// Types
interface ExercisesState {
  exercises: Exercise[];
  favorites: string[];
  favoritesMap: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
}

type ExercisesAction =
  | {
    type: "SET_INITIAL_DATA";
    payload: {
      exercises: Exercise[];
      favorites: string[];
      favoritesMap: Record<string, string>;
    };
  }
  | {
    type: "ADD_FAVORITE_SUCCESS";
    payload: { exerciseId: string; favoriteId: string };
  }
  | { type: "REMOVE_FAVORITE_SUCCESS"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "DELETE_EXERCISE"; payload: string }
  | { type: "ADD_EXERCISE"; payload: Exercise }
  | { type: "SET_OFFLINE"; payload: boolean };

const initialState: ExercisesState = {
  exercises: [],
  favorites: [],
  favoritesMap: {},
  isLoading: true, // Initial state must be loading
  error: null,
  isOffline: false,
};

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
        favoritesMap: action.payload.favoritesMap,
        isLoading: false,
        error: null,
      };
    case "ADD_FAVORITE_SUCCESS":
      return {
        ...state,
        favorites: [...state.favorites, action.payload.exerciseId],
        favoritesMap: {
          ...state.favoritesMap,
          [action.payload.exerciseId]: action.payload.favoriteId,
        },
      };
    case "REMOVE_FAVORITE_SUCCESS":
      const { [action.payload]: _, ...newMap } = state.favoritesMap;
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
        favoritesMap: newMap,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "DELETE_EXERCISE":
      return {
        ...state,
        exercises: state.exercises.filter((e) => e.id !== action.payload),
      };
    case "ADD_EXERCISE":
      return { ...state, exercises: [...state.exercises, action.payload] };
    case "SET_OFFLINE":
      return {
        ...state,
        isOffline: action.payload,
      };
    default:
      return state;
  }
};

interface ExercisesContextType extends ExercisesState {
  toggleFavorite: (id: string) => Promise<void>;
  loadExercises: () => Promise<void>;
  addExercise: (data: Omit<Exercise, "id">) => Promise<void>;
  delExercise: (id: string) => Promise<void>;
}

const ExercisesContext = createContext<ExercisesContextType | undefined>(
  undefined,
);

export const ExercisesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(exercisesReducer, initialState);

  const loadData = async () => {
  dispatch({ type: "SET_LOADING", payload: true });

  //  Charger cache
  const cachedExercises = await loadExercisesCache();
  if (cachedExercises.length > 0) {
    dispatch({
      type: "SET_INITIAL_DATA",
      payload: {
        exercises: cachedExercises,
        favorites: [],       // ou charger les favoris en cache si tu les stockes
        favoritesMap: {},
      },
    });
  }

  //  Vérifier connexion
  const online = await isConnected();

  if (!online) {
    // si pas de connexion, on reste avec le cache
    dispatch({ type: "SET_OFFLINE", payload: true });
    dispatch({ type: "SET_LOADING", payload: false });
    return;
  }

  //  Si online, fetch API
  try {
    const [exercises, favoritesData] = await Promise.all([
      fetchExercises(),
      fetchFavorites(),
    ]);

    const favoritesList = favoritesData.map((f) => f.exerciseId);
    const favoritesMap = favoritesData.reduce(
      (acc, curr) => ({ ...acc, [curr.exerciseId]: curr.id }),
      {}
    );

    //  Sauvegarder cache
    await saveExercisesCache(exercises);

    dispatch({
      type: "SET_INITIAL_DATA",
      payload: {
        exercises,
        favorites: favoritesList,
        favoritesMap,
      },
    });

    dispatch({ type: "SET_OFFLINE", payload: false });
  } catch (error) {
    dispatch({
      type: "SET_ERROR",
      payload: "Impossible de charger les exercices.",
    });
  }
};

  useEffect(() => {
    loadData();
  }, []);

  const toggleFavorite = async (exerciseId: string) => {
    try {
      if (state.favorites.includes(exerciseId)) {
        // Remove
        const favoriteId = state.favoritesMap[exerciseId];
        if (favoriteId) {
          await removeFavorite(favoriteId);
          dispatch({ type: "REMOVE_FAVORITE_SUCCESS", payload: exerciseId });
        }
      } else {
        // Add
        const response = await addFavorite(exerciseId);
        dispatch({
          type: "ADD_FAVORITE_SUCCESS",
          payload: { exerciseId, favoriteId: response.id },
        });
      }
    } catch (error) {
      console.error("Error toggling favorite", error);
    }
  };

  const addExercise = async (data: Omit<Exercise, "id">) => {
    try {
      const newExercise = await createExercise(data);
      dispatch({ type: "ADD_EXERCISE", payload: newExercise });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Erreur lors de la création." });
      throw error;
    }
  };

  const delExercise = async (id: string) => {
    try {
      await deleteExercise(id);
      dispatch({ type: "DELETE_EXERCISE", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Erreur lors de la suppression.",
      });
    }
  };

  const loadExercises = async () => {
    await loadData();
  };

  return (
    <ExercisesContext.Provider
      value={{
        ...state,
        toggleFavorite,
        loadExercises,
        addExercise,
        delExercise,
      }}
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
