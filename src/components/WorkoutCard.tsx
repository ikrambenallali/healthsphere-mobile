import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Workout } from '../types/workout';

type Props = {
  workout: Workout;
  onPress: () => void;
};

export default function WorkoutCard({ workout, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{workout.activity}</Text>
      <Text>{workout.duration} min</Text>
      <Text>Intensité : {workout.intensity}</Text>
      <Text>{workout.date}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});