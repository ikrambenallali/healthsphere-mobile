import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkouts } from '../context/WorkoutContext';

const INTENSITY_CONFIG = {
  faible: { label: 'Faible', color: '#C8E6C9', textColor: '#388E3C', emoji: '🌿', bar: 1 },
  moyenne: { label: 'Moyenne', color: '#FFF9C4', textColor: '#F9A825', emoji: '✨', bar: 2 },
  élevée: { label: 'Élevée', color: '#FFCCBC', textColor: '#D84315', emoji: '🔥', bar: 3 },
};

const ACTIVITY_ICONS: Record<string, string> = {
  course: '🏃‍♀️',
  musculation: '💪',
  vélo: '🚴‍♀️',
  yoga: '🧘‍♀️',
  natation: '🏊‍♀️',
  danse: '💃',
  pilates: '🌸',
  default: '🏋️‍♀️',
};

export default function WorkoutDetailsScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { workouts, removeWorkout } = useWorkouts();
  const workout = workouts.find((w) => w.id === id);

  if (!workout) return null;

  const intensity = INTENSITY_CONFIG[workout.intensity] ?? INTENSITY_CONFIG['moyenne'];
  const activityKey = workout.activity.toLowerCase();
  const icon = ACTIVITY_ICONS[activityKey] ?? ACTIVITY_ICONS.default;

  const formattedDate = new Date(workout.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la séance',
      'Es-tu sûre de vouloir supprimer cette séance ? 💔',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            removeWorkout(id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrapper}>
            <Text style={styles.heroIcon}>{icon}</Text>
          </View>
          <Text style={styles.heroActivity}>{workout.activity}</Text>
          <Text style={styles.heroDate}>{formattedDate}</Text>

          <View style={[styles.intensityBadge, { backgroundColor: intensity.color }]}>
            <Text style={[styles.intensityText, { color: intensity.textColor }]}>
              {intensity.emoji}  Intensité {intensity.label}
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{workout.duration}</Text>
            <Text style={styles.statUnit}>min</Text>
            <Text style={styles.statLabel}>Durée</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.intensityBars}>
              {[1, 2, 3].map((level) => (
                <View
                  key={level}
                  style={[
                    styles.intensityBar,
                    {
                      backgroundColor:
                        level <= intensity.bar ? intensity.textColor : '#F0D0D3',
                      height: 8 + level * 6,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.statLabel}>Intensité</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>✓</Text>
            <Text style={styles.statLabel}>Complétée</Text>
          </View>
        </View>

        {/* Notes section */}
        {workout.notes ? (
          <View style={styles.notesCard}>
            <Text style={styles.notesLabel}>📝 Notes</Text>
            <Text style={styles.notesText}>{workout.notes}</Text>
          </View>
        ) : (
          <View style={styles.notesCard}>
            <Text style={styles.notesLabel}>📝 Notes</Text>
            <Text style={styles.noNotesText}>Aucune note pour cette séance.</Text>
          </View>
        )}

        {/* Motivational quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "Chaque goutte de sueur est un pas vers la meilleure version de toi-même."
          </Text>
          <Text style={styles.quoteAuthor}>— Ton coach intérieur 🌸</Text>
        </View>

        {/* Delete button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteText}>🗑  Supprimer cette séance</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F9',
  },
  heroCard: {
    margin: 20,
    backgroundColor: '#FFF0F2',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5E6E8',
    shadowColor: '#E8A4A0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  heroIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FDE8EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#E8A4A0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  heroIcon: {
    fontSize: 38,
  },
  heroActivity: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    color: '#3D2C2C',
    textTransform: 'capitalize',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  heroDate: {
    fontFamily: 'Georgia',
    fontSize: 14,
    color: '#C48B8B',
    fontStyle: 'italic',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  intensityBadge: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 22,
  },
  intensityText: {
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5E6E8',
    shadowColor: '#E8A4A0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '700',
    color: '#C04040',
    lineHeight: 34,
  },
  statUnit: {
    fontFamily: 'Georgia',
    fontSize: 13,
    color: '#C4A0A0',
  },
  statLabel: {
    fontFamily: 'Georgia',
    fontSize: 11,
    color: '#C4A0A0',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  intensityBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    marginBottom: 2,
  },
  intensityBar: {
    width: 10,
    borderRadius: 4,
  },
  notesCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F5E6E8',
  },
  notesLabel: {
    fontFamily: 'Georgia',
    fontSize: 13,
    fontWeight: '700',
    color: '#8B5E5E',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  notesText: {
    fontFamily: 'Georgia',
    fontSize: 15,
    color: '#3D2C2C',
    lineHeight: 24,
  },
  noNotesText: {
    fontFamily: 'Georgia',
    fontSize: 14,
    color: '#D4A8A8',
    fontStyle: 'italic',
  },
  quoteCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FDE8EC',
    borderRadius: 18,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#E8A4A0',
  },
  quoteText: {
    fontFamily: 'Georgia',
    fontSize: 14,
    color: '#8B5E5E',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontFamily: 'Georgia',
    fontSize: 12,
    color: '#C48B8B',
    textAlign: 'right',
  },
  deleteButton: {
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFF8F8',
    alignItems: 'center',
  },
  deleteText: {
    fontFamily: 'Georgia',
    fontSize: 15,
    color: '#E57373',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});