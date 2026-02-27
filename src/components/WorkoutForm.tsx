import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useState } from 'react';

type Intensity = 'faible' | 'moyenne' | 'élevée';

type Props = {
  onSubmit: (data: {
    activity: string;
    duration: number;
    intensity: Intensity;
    date: string;
    notes?: string;
  }) => void;
};

const ACTIVITIES = [
  { label: '🏃‍♀️ Course', value: 'course' },
  { label: '💪 Muscu', value: 'musculation' },
  { label: '🚴‍♀️ Vélo', value: 'vélo' },
  { label: '🧘‍♀️ Yoga', value: 'yoga' },
  { label: '💃 Danse', value: 'danse' },
  { label: '🌸 Pilates', value: 'pilates' },
  { label: '🏊‍♀️ Natation', value: 'natation' },
];

const INTENSITIES: { label: string; value: Intensity; color: string; activeColor: string; emoji: string }[] = [
  { label: 'Faible', value: 'faible', color: '#F0FAF0', activeColor: '#4CAF50', emoji: '🌿' },
  { label: 'Moyenne', value: 'moyenne', color: '#FFFDE7', activeColor: '#FFC107', emoji: '✨' },
  { label: 'Élevée', value: 'élevée', color: '#FFF3F0', activeColor: '#F44336', emoji: '🔥' },
];

export default function WorkoutForm({ onSubmit }: Props) {
  const [activity, setActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState<Intensity>('moyenne');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = () => {
    const finalActivity = activity === 'autre' ? customActivity : activity;
    onSubmit({
      activity: finalActivity,
      duration: Number(duration),
      intensity,
      date,
      notes: notes || undefined,
    });
  };

  const isValid = (activity !== '' && (activity !== 'autre' || customActivity !== '')) &&
    duration !== '' && date !== '';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>✨</Text>
        <Text style={styles.headerTitle}>Nouvelle séance</Text>
        <Text style={styles.headerSubtitle}>Chaque effort compte, belle guerrière 💪</Text>
      </View>

      {/* Activity picker */}
      <View style={styles.section}>
        <Text style={styles.label}>Type d'activité</Text>
        <View style={styles.activityGrid}>
          {ACTIVITIES.map((a) => (
            <TouchableOpacity
              key={a.value}
              style={[
                styles.activityChip,
                activity === a.value && styles.activityChipActive,
              ]}
              onPress={() => setActivity(a.value)}
              activeOpacity={0.75}
            >
              <Text style={[
                styles.activityChipText,
                activity === a.value && styles.activityChipTextActive,
              ]}>
                {a.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.activityChip,
              activity === 'autre' && styles.activityChipActive,
            ]}
            onPress={() => setActivity('autre')}
            activeOpacity={0.75}
          >
            <Text style={[
              styles.activityChipText,
              activity === 'autre' && styles.activityChipTextActive,
            ]}>
              ➕ Autre
            </Text>
          </TouchableOpacity>
        </View>

        {activity === 'autre' && (
          <TextInput
            placeholder="Nom de l'activité..."
            placeholderTextColor="#D4A8A8"
            value={customActivity}
            onChangeText={setCustomActivity}
            style={[styles.input, focusedField === 'custom' && styles.inputFocused]}
            onFocus={() => setFocusedField('custom')}
            onBlur={() => setFocusedField(null)}
          />
        )}
      </View>

      {/* Duration & Date row */}
      <View style={styles.rowSection}>
        <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>⏱ Durée (min)</Text>
          <TextInput
            placeholder="45"
            placeholderTextColor="#D4A8A8"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            style={[styles.input, focusedField === 'duration' && styles.inputFocused]}
            onFocus={() => setFocusedField('duration')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>📅 Date</Text>
          <TextInput
            placeholder="2024-01-15"
            placeholderTextColor="#D4A8A8"
            value={date}
            onChangeText={setDate}
            style={[styles.input, focusedField === 'date' && styles.inputFocused]}
            onFocus={() => setFocusedField('date')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

      {/* Intensity */}
      <View style={styles.section}>
        <Text style={styles.label}>Intensité</Text>
        <View style={styles.intensityRow}>
          {INTENSITIES.map((i) => (
            <TouchableOpacity
              key={i.value}
              style={[
                styles.intensityButton,
                { backgroundColor: i.color },
                intensity === i.value && {
                  borderColor: i.activeColor,
                  borderWidth: 2,
                  backgroundColor: i.color,
                },
              ]}
              onPress={() => setIntensity(i.value)}
              activeOpacity={0.75}
            >
              <Text style={styles.intensityEmoji}>{i.emoji}</Text>
              <Text style={[
                styles.intensityLabel,
                intensity === i.value && { color: i.activeColor, fontWeight: '700' },
              ]}>
                {i.label}
              </Text>
              {intensity === i.value && (
                <View style={[styles.intensityDot, { backgroundColor: i.activeColor }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.label}>📝 Notes (optionnel)</Text>
        <TextInput
          placeholder="Comment tu t'es sentie ? Des observations ?"
          placeholderTextColor="#D4A8A8"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={[
            styles.input,
            styles.textArea,
            focusedField === 'notes' && styles.inputFocused,
          ]}
          onFocus={() => setFocusedField('notes')}
          onBlur={() => setFocusedField(null)}
          textAlignVertical="top"
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!isValid}
        activeOpacity={0.85}
      >
        <Text style={styles.submitText}>✨ Enregistrer la séance</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Tu es incroyable 🌸</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F9',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: '#FFF0F2',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 8,
  },
  headerEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    color: '#3D2C2C',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontFamily: 'Georgia',
    fontSize: 14,
    color: '#C48B8B',
    marginTop: 6,
    fontStyle: 'italic',
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  rowSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5E5E',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F0D0D3',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#3D2C2C',
    fontFamily: 'Georgia',
  },
  inputFocused: {
    borderColor: '#E8A4A0',
    shadowColor: '#E8A4A0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  textArea: {
    height: 90,
    paddingTop: 13,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#F0D0D3',
    marginBottom: 4,
  },
  activityChipActive: {
    backgroundColor: '#FDE8EC',
    borderColor: '#E8A4A0',
  },
  activityChipText: {
    fontSize: 13,
    color: '#B07070',
    fontFamily: 'Georgia',
  },
  activityChipTextActive: {
    color: '#C04040',
    fontWeight: '700',
  },
  intensityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  intensityButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  intensityEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  intensityLabel: {
    fontSize: 12,
    color: '#8B7070',
    fontFamily: 'Georgia',
  },
  intensityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
  },
  submitButton: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: '#E8A4A0',
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: '#E8A4A0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#F0D0D3',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: {
    fontFamily: 'Georgia',
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  footerText: {
    textAlign: 'center',
    color: '#D4A8A8',
    marginTop: 16,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    fontSize: 13,
  },
});