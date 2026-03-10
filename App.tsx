import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import "react-native-get-random-values";
import { ExercisesProvider } from "./src/context/ExercisesContext";
import { UserProvider } from "./src/context/UserContext";
import { WorkoutProvider } from "./src/context/WorkoutContext";
import RootStackNavigator from "./src/navigation/RootStackNavigator";

export default function App() {
  return (
    <UserProvider>
      <ExercisesProvider>
        <WorkoutProvider>
          <NavigationContainer>
            <RootStackNavigator />
          </NavigationContainer>
        </WorkoutProvider>
      </ExercisesProvider>
    </UserProvider>
  );
}
