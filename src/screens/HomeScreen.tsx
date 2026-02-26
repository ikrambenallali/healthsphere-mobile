import { View, FlatList, Button, ActivityIndicator } from 'react-native';
import { useWorkouts } from '../context/WorkoutContext';
import WorkoutCard from '../components/WorkoutCard';

export default function HomeScreen({ navigation }: any) {
  const { workouts, loading } = useWorkouts();

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View>
      <Button title="Ajouter une séance" onPress={() => navigation.navigate('AddWorkout')} />
      <FlatList
        data={workouts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onPress={() =>
              navigation.navigate('WorkoutDetails', { id: item.id })
            }
          />
        )}
      />
    </View>
  );
}