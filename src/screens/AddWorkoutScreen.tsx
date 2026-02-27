import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WorkoutForm from '../components/WorkoutForm';
import { useWorkouts } from '../context/WorkoutContext';
import { v4 as uuidv4 } from 'uuid';

export default function AddWorkoutScreen({ navigation }: any) {
  const { addWorkout } = useWorkouts();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <WorkoutForm
        onSubmit={(data) => {
          addWorkout({ id: uuidv4(), ...data });
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F9',
  },
});