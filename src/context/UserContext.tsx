import React, { createContext, ReactNode, useContext, useReducer } from "react";

// Types
interface UserSettings {
  username: string;
  theme: "light" | "dark";
  notificationsEnabled: boolean;
}

interface UserState {
  settings: UserSettings;
  isConnected: boolean;
}

type UserAction =
  | { type: "UPDATE_SETTINGS"; payload: Partial<UserSettings> }
  | { type: "SET_NETWORK_STATUS"; payload: boolean };

// Initial State
const initialState: UserState = {
  settings: {
    username: "Guest",
    theme: "light",
    notificationsEnabled: true,
  },
  isConnected: true, // Par défaut, on suppose qu'il est connecté
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
    default:
      return state;
  }
};

// Context
interface UserContextType extends UserState {
  updateSettings: (settings: Partial<UserSettings>) => void;
  setNetworkStatus: (status: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const updateSettings = (settings: Partial<UserSettings>) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings });
  };

  const setNetworkStatus = (status: boolean) => {
    dispatch({ type: "SET_NETWORK_STATUS", payload: status });
  };

  return (
    <UserContext.Provider
      value={{ ...state, updateSettings, setNetworkStatus }}
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
