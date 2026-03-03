import { WorkoutProvider } from './src/context/WorkoutContext';
import AppNavigator from './src/navigation/AppNavigator';
import 'react-native-get-random-values';

export default function App() {
  return (
    <WorkoutProvider>
      <AppNavigator />
    </WorkoutProvider>
  );
}