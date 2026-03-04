import { View, Text, FlatList, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useWorkouts } from '../context/WorkoutContext';
import WorkoutCard from '../components/WorkoutCard';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'WorkoutDetails'
>;

export default function ExercisesScreen() {
  const { workouts, loading, error, reload } = useWorkouts();
  const navigation = useNavigation<NavigationProp>();

  if (loading) return <Text>Chargement...</Text>;

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
        <Button title="Réessayer" onPress={reload} />
      </View>
    );
  }

  if (workouts.length === 0) {
    return <Text>Aucun exercice disponible</Text>;
  }

  return (
    <FlatList
      data={workouts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <WorkoutCard
          workout={item}
          onPress={() =>
            navigation.navigate('WorkoutDetails', {
              workoutId: item.id,
            })
          }
        />
      )}
    />
  );
}