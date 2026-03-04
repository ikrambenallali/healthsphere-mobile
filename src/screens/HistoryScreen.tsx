import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useWorkouts } from '../context/WorkoutContext';
import WorkoutCard from '../components/WorkoutCard';

export default function HistoryScreen() {
  const { workouts } = useWorkouts();

  // ⚠️ temporaire : on simule l’historique
  // plus tard → vraie table / AsyncStorage
  const history = workouts.slice(0, 3);

  if (history.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          📭 Aucun historique pour le moment
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Historique</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onPress={() => {}}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
});