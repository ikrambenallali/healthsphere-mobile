import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import AddWorkoutScreen from '../screens/AddWorkoutScreen';
import WorkoutDetailsScreen from '../screens/WorkoutDetailsScreen';

const Stack = createNativeStackNavigator();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFF8F9' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainDrawer" component={DrawerNavigator} />

      <Stack.Screen
        name="AddWorkout"
        component={AddWorkoutScreen}
        options={{
          headerShown: true,
          title: '✨ Nouvelle séance',
          headerStyle: { backgroundColor: '#FFF0F2' },
          headerTintColor: '#C04040',
          headerTitleStyle: {
            fontFamily: 'Georgia',
            fontWeight: '700',
            fontSize: 18,
            color: '#3D2C2C',
          },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          animation: 'slide_from_bottom',
        }}
      />

      <Stack.Screen
        name="WorkoutDetails"
        component={WorkoutDetailsScreen}
        options={{
          headerShown: true,
          title: '💪 Détails',
          headerStyle: { backgroundColor: '#FFF0F2' },
          headerTintColor: '#C04040',
          headerTitleStyle: {
            fontFamily: 'Georgia',
            fontWeight: '700',
            fontSize: 18,
            color: '#3D2C2C',
          },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}