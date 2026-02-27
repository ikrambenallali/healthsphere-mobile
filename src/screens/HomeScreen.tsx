import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkouts } from '../context/WorkoutContext';
import WorkoutCard from '../components/WorkoutCard';

export default function HomeScreen({ navigation }: any) {
  const { workouts, loading } = useWorkouts();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E8A4A0" />
        <Text style={styles.loadingText}>Chargement de tes séances...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {workouts.length > 0 && (
              <View style={styles.statsBar}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{workouts.length}</Text>
                  <Text style={styles.statCaption}>séances</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {workouts.reduce((sum, w) => sum + w.duration, 0)}
                  </Text>
                  <Text style={styles.statCaption}>minutes au total</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {workouts.filter((w) => w.intensity === 'élevée').length}
                  </Text>
                  <Text style={styles.statCaption}>sessions 🔥</Text>
                </View>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🌸</Text>
            <Text style={styles.emptyTitle}>Aucune séance pour l'instant</Text>
            <Text style={styles.emptySubtitle}>
              Commence ton aventure fitness dès aujourd'hui !
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onPress={() => navigation.navigate('WorkoutDetails', { id: item.id })}
          />
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddWorkout')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F9',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F9',
    gap: 14,
  },
  loadingText: {
    fontFamily: 'Georgia',
    fontSize: 15,
    color: '#C48B8B',
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },
  listHeader: {
    marginBottom: 4,
  },
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 12,
    backgroundColor: '#FFF0F2',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#F5E6E8',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '700',
    color: '#C04040',
  },
  statCaption: {
    fontFamily: 'Georgia',
    fontSize: 11,
    color: '#C4A0A0',
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
    backgroundColor: '#F0D0D3',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '700',
    color: '#3D2C2C',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Georgia',
    fontSize: 14,
    color: '#C48B8B',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8A4A0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E8A4A0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    lineHeight: 36,
    fontWeight: '300',
  },
});