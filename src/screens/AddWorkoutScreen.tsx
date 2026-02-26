import WorkoutForm from '../components/WorkoutForm';
import { useWorkouts } from '../context/WorkoutContext';
import { v4 as uuidv4 } from 'uuid';

export default function AddWorkoutScreen({ navigation }: any) {
  const { addWorkout } = useWorkouts();

  return (
    <WorkoutForm
      onSubmit={(data) => {
        addWorkout({
          id: uuidv4(),
          ...data,
        });
        navigation.goBack();
      }}
    />
  );
}