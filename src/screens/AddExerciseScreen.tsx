import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useExercises } from "../context/ExercisesContext";

type Difficulty = "easy" | "medium" | "hard";

export default function AddExerciseScreen() {
  const navigation = useNavigation();
  const { addExercise } = useExercises();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [muscleGroup, setMuscleGroup] = useState("");

  const resetForm = () => {
    setName("");
    setCategory("");
    setDescription("");
    setDifficulty("medium");
    setMuscleGroup("");
  };

  const handleSubmit = async () => {
    if (!name || !category) {
      Alert.alert("Erreur", "Le nom et la catégorie sont requis.");
      return;
    }

    // Mapping des catégories UI (Français) -> API (Anglais)
    const categoryMapping: { [key: string]: string } = {
      Musculation: "Strength",
      Cardio: "Cardio",
      Gainage: "Strength", // Planks are core strength
      Yoga: "Flexibility",
      Autre: "Other",
    };

    const apiCategory = categoryMapping[category] || "Other";

    setLoading(true);
    try {
      await addExercise({
        name,
        category: apiCategory,
        description,
        difficulty,
        muscleGroup: muscleGroup || undefined,
        imageUrl: undefined, // Optionnel
      });
      Alert.alert("Succès", "Exercice créé avec succès !", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de créer l'exercice.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Musculation", "Cardio", "Gainage", "Yoga", "Autre"];
  const difficulties: { label: string; value: Difficulty; color: string }[] = [
    { label: "Facile", value: "easy", color: "#4CAF50" },
    { label: "Moyen", value: "medium", color: "#FF9800" },
    { label: "Difficile", value: "hard", color: "#F44336" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nouvel Exercice</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nom de l'exercice *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Pompes Diamant"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Catégorie *</Text>
        <View style={styles.chipContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipSelected]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  category === cat && styles.chipTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Difficulté</Text>
        <View style={styles.chipContainer}>
          {difficulties.map((diff) => (
            <TouchableOpacity
              key={diff.value}
              style={[
                styles.chip,
                difficulty === diff.value && {
                  backgroundColor: diff.color + "20",
                  borderColor: diff.color,
                },
                difficulty === diff.value && styles.chipSelectedCustom,
              ]}
              onPress={() => setDifficulty(diff.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: diff.color },
                  difficulty === diff.value && { fontWeight: "bold" },
                ]}
              >
                {diff.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Groupe Musculaire</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Pectoraux, Triceps"
          value={muscleGroup}
          onChangeText={setMuscleGroup}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Décrivez comment réaliser l'exercice..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Créer l'exercice</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  chipSelectedCustom: {
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    color: "#555",
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
