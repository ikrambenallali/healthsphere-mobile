import RootStackNavigator from './src/navigation/RootStackNavigator';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { WorkoutProvider } from './src/context/WorkoutContext';

export default function App() {
  return (
     <WorkoutProvider>
      <NavigationContainer>
        <RootStackNavigator />
      </NavigationContainer>
    </WorkoutProvider>
  );
}