import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

type Props = {
  onSubmit: (data: {
    activity: string;
    duration: number;
    intensity: 'faible' | 'moyenne' | 'élevée';
    date: string;
    notes?: string;
  }) => void;
};

export default function WorkoutForm({ onSubmit }: Props) {
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState<'faible' | 'moyenne' | 'élevée'>(
    'faible'
  );
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <View>
      <TextInput placeholder="Activité" value={activity} onChangeText={setActivity} style={styles.input} />
      <TextInput placeholder="Durée (min)" value={duration} onChangeText={setDuration} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} style={styles.input} />
      <TextInput placeholder="Notes" value={notes} onChangeText={setNotes} style={styles.input} />

      <Button
        title="Ajouter"
        onPress={() =>
          onSubmit({
            activity,
            duration: Number(duration),
            intensity,
            date,
            notes,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
});