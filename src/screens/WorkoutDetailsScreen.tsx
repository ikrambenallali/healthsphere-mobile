import { View, Text, Button } from 'react-native';
import { useWorkouts } from '../context/WorkoutContext';

export default function WorkoutDetailsScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { workouts, removeWorkout } = useWorkouts();

  const workout = workouts.find(w => w.id === id);

  if (!workout) return null;

  return (
    <View>
      <Text>Activité : {workout.activity}</Text>
      <Text>Durée : {workout.duration} min</Text>
      <Text>Intensité : {workout.intensity}</Text>
      <Text>Date : {workout.date}</Text>
      <Text>Notes : {workout.notes}</Text>

      <Button
        title="Supprimer"
        color="red"
        onPress={() => {
          removeWorkout(id);
          navigation.goBack();
        }}
      />
    </View>
  );
}