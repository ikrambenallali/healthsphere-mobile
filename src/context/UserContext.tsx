import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  AuthUser,
  loginUser,
  registerUser,
  setAuthToken,
} from "../services/api";

// Types
interface UserSettings {
  username: string;
  theme: "light" | "dark";
  notificationsEnabled: boolean;
}

interface UserState {
  settings: UserSettings;
  isConnected: boolean;
  authUser: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isAuthReady: boolean;
  authError: string | null;
}

type UserAction =
  | { type: "UPDATE_SETTINGS"; payload: Partial<UserSettings> }
  | { type: "SET_NETWORK_STATUS"; payload: boolean }
  | {
      type: "RESTORE_SESSION";
      payload: { token: string | null; authUser: AuthUser | null };
    }
  | { type: "AUTH_START" }
  | {
      type: "AUTH_SUCCESS";
      payload: { token: string | null; authUser: AuthUser | null };
    }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_AUTH_ERROR" };

const AUTH_TOKEN_KEY = "@healthsphere/auth_token";
const AUTH_USER_KEY = "@healthsphere/auth_user";

const getDisplayName = (user: AuthUser | null) => user?.name || "Guest";

// Initial State
const initialState: UserState = {
  settings: {
    username: "Guest",
    theme: "light",
    notificationsEnabled: true,
  },
  isConnected: true, // Par défaut, on suppose qu'il est connecté
  authUser: null,
  token: null,
  isAuthenticated: false,
  isAuthLoading: false,
  isAuthReady: false,
  authError: null,
};

// Reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case "SET_NETWORK_STATUS":
      return {
        ...state,
        isConnected: action.payload,
      };
    case "RESTORE_SESSION":
      return {
        ...state,
        token: action.payload.token,
        authUser: action.payload.authUser,
        isAuthenticated: Boolean(action.payload.token || action.payload.authUser),
        isAuthReady: true,
        authError: null,
        settings: {
          ...state.settings,
          username: getDisplayName(action.payload.authUser),
        },
      };
    case "AUTH_START":
      return {
        ...state,
        isAuthLoading: true,
        authError: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        token: action.payload.token,
        authUser: action.payload.authUser,
        isAuthenticated: true,
        isAuthLoading: false,
        isAuthReady: true,
        authError: null,
        settings: {
          ...state.settings,
          username: getDisplayName(action.payload.authUser),
        },
      };
    case "AUTH_ERROR":
      return {
        ...state,
        isAuthLoading: false,
        isAuthReady: true,
        authError: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        authUser: null,
        token: null,
        isAuthenticated: false,
        isAuthLoading: false,
        isAuthReady: true,
        authError: null,
        settings: {
          ...state.settings,
          username: "Guest",
        },
      };
    case "CLEAR_AUTH_ERROR":
      return {
        ...state,
        authError: null,
      };
    default:
      return state;
  }
};

// Context
interface UserContextType extends UserState {
  updateSettings: (settings: Partial<UserSettings>) => void;
  setNetworkStatus: (status: boolean) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(AUTH_USER_KEY),
        ]);

        const authUser = storedUser ? JSON.parse(storedUser) : null;
        setAuthToken(storedToken);

        dispatch({
          type: "RESTORE_SESSION",
          payload: {
            token: storedToken,
            authUser,
          },
        });
      } catch (error) {
        setAuthToken(null);
        dispatch({
          type: "RESTORE_SESSION",
          payload: {
            token: null,
            authUser: null,
          },
        });
      }
    };

    restoreSession();
  }, []);

  const updateSettings = (settings: Partial<UserSettings>) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings });
  };

  const setNetworkStatus = (status: boolean) => {
    dispatch({ type: "SET_NETWORK_STATUS", payload: status });
  };

  const login = async (credentials: { email: string; password: string }) => {
    dispatch({ type: "AUTH_START" });

    try {
      const result = await loginUser(credentials);
      const authUser = result.user ?? { email: credentials.email };

      await Promise.all([
        AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser)),
        result.token
          ? AsyncStorage.setItem(AUTH_TOKEN_KEY, result.token)
          : AsyncStorage.removeItem(AUTH_TOKEN_KEY),
      ]);

      setAuthToken(result.token);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          token: result.token,
          authUser,
        },
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Connexion impossible.";
      dispatch({ type: "AUTH_ERROR", payload: message });
      throw error;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    dispatch({ type: "AUTH_START" });

    try {
      const result = await registerUser(data);
      const authUser = result.user ?? { name: data.name, email: data.email };

      await Promise.all([
        AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser)),
        result.token
          ? AsyncStorage.setItem(AUTH_TOKEN_KEY, result.token)
          : AsyncStorage.removeItem(AUTH_TOKEN_KEY),
      ]);

      setAuthToken(result.token);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          token: result.token,
          authUser,
        },
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Inscription impossible.";
      dispatch({ type: "AUTH_ERROR", payload: message });
      throw error;
    }
  };

  const logout = async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_TOKEN_KEY),
      AsyncStorage.removeItem(AUTH_USER_KEY),
    ]);
    setAuthToken(null);
    dispatch({ type: "LOGOUT" });
  };

  const clearAuthError = () => {
    dispatch({ type: "CLEAR_AUTH_ERROR" });
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        updateSettings,
        setNetworkStatus,
        login,
        register,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
