import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddWorkoutScreen from '../screens/AddWorkoutScreen';
import WorkoutDetailsScreen from '../screens/WorkoutDetailsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFF0F2',
          },
          headerTintColor: '#C04040',
          headerTitleStyle: {
            fontFamily: 'Georgia',
            fontWeight: '700',
            fontSize: 18,
            color: '#3D2C2C',
          },
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#FFF8F9',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '🌸 Mes Séances' }}
        />
        <Stack.Screen
          name="AddWorkout"
          component={AddWorkoutScreen}
          options={{ title: '✨ Nouvelle séance' }}
        />
        <Stack.Screen
          name="WorkoutDetails"
          component={WorkoutDetailsScreen}
          options={{ title: '💪 Détails' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}