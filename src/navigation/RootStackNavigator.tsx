import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useUser } from "../context/UserContext";
import AddExerciseScreen from "../screens/AddExerciseScreen"; // Added
import AddWorkoutScreen from "../screens/AddWorkoutScreen";
import ExerciseDetailsScreen from "../screens/ExerciseDetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WorkoutDetailsScreen from "../screens/WorkoutDetailsScreen";
import DrawerNavigator from "./DrawerNavigator";

const Stack = createNativeStackNavigator(); // Type inference is usually enough

export default function RootStackNavigator() {
  const { isAuthenticated, isAuthReady } = useUser();

  if (!isAuthReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E8A4A0" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFF8F9" },
        animation: "slide_from_right",
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainDrawer" component={DrawerNavigator} />

          <Stack.Screen
            name="AddWorkout"
            component={AddWorkoutScreen}
            options={{
              headerShown: true,
              title: "✨ Nouvelle séance",
              headerStyle: { backgroundColor: "#FFF0F2" },
              headerTintColor: "#C04040",
              headerTitleStyle: {
                fontFamily: "Georgia",
                fontWeight: "700",
                fontSize: 18,
                color: "#3D2C2C",
              },
              headerShadowVisible: false,
              animation: "slide_from_bottom",
            }}
          />

          <Stack.Screen
            name="WorkoutDetails"
            component={WorkoutDetailsScreen}
            options={{
              headerShown: true,
              title: "💪 Détails",
              headerStyle: { backgroundColor: "#FFF0F2" },
              headerTintColor: "#C04040",
              headerTitleStyle: {
                fontFamily: "Georgia",
                fontWeight: "700",
                fontSize: 18,
                color: "#3D2C2C",
              },
              headerShadowVisible: false,
            }}
          />

          <Stack.Screen
            name="ExerciseDetails"
            component={ExerciseDetailsScreen}
            options={{
              headerShown: true,
              title: "Détails de l'exercice",
              headerBackTitle: "Retour",
              animation: "fade_from_bottom",
            }}
          />

          <Stack.Screen
            name="AddExercise"
            component={AddExerciseScreen}
            options={{
              headerShown: true,
              title: "➕ Nouvel Exercice",
              presentation: "modal",
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8F9",
  },
});
