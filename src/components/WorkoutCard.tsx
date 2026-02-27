import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Workout } from '../types/workout';

type Props = {
  workout: Workout;
  onPress: () => void;
};

const INTENSITY_CONFIG = {
  faible: { label: 'Faible', color: '#C8E6C9', textColor: '#388E3C', emoji: '🌿' },
  moyenne: { label: 'Moyenne', color: '#FFF9C4', textColor: '#F9A825', emoji: '✨' },
  élevée: { label: 'Élevée', color: '#FFCCBC', textColor: '#D84315', emoji: '🔥' },
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

export default function WorkoutCard({ workout, onPress }: Props) {
  const intensity = INTENSITY_CONFIG[workout.intensity] ?? INTENSITY_CONFIG['moyenne'];
  const activityKey = workout.activity.toLowerCase();
  const icon = ACTIVITY_ICONS[activityKey] ?? ACTIVITY_ICONS.default;

  const formattedDate = new Date(workout.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.85}
    >
      {/* Accent bar */}
      <View style={styles.accentBar} />

      <View style={styles.content}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{workout.activity}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
          <View style={[styles.intensityBadge, { backgroundColor: intensity.color }]}>
            <Text style={[styles.intensityText, { color: intensity.textColor }]}>
              {intensity.emoji} {intensity.label}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{workout.duration}</Text>
            <Text style={styles.statLabel}>minutes</Text>
          </View>
          <View style={styles.statDot} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{workout.intensity}</Text>
            <Text style={styles.statLabel}>intensité</Text>
          </View>
          {workout.notes ? (
            <>
              <View style={styles.statDot} />
              <View style={[styles.statItem, { flex: 2 }]}>
                <Text style={styles.noteText} numberOfLines={1}>
                  📝 {workout.notes}
                </Text>
              </View>
            </>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#FFFAF8',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#E8A4A0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F5E6E8',
  },
  accentBar: {
    width: 5,
    backgroundColor: '#E8A4A0',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FDE8EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 17,
    fontWeight: '700',
    color: '#3D2C2C',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  date: {
    fontFamily: 'Georgia',
    fontSize: 12,
    color: '#C48B8B',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  intensityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5E6E8',
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '700',
    color: '#C47F7F',
  },
  statLabel: {
    fontSize: 10,
    color: '#C4A0A0',
    marginTop: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F0D0D3',
  },
  noteText: {
    fontSize: 12,
    color: '#B07070',
    fontStyle: 'italic',
  },
});