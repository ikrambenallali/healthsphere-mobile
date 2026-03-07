import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Added Ionicons
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useLayoutEffect, useState } from "react"; // Added useLayoutEffect
import {
    ActivityIndicator,
    Alert, // Added Alert
    Button,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useExercises } from "../context/ExercisesContext";
import { fetchExerciseById } from "../services/api";
import { Exercise } from "../types/exercise";
import { RootStackParamList } from "../types/navigation";

type ExerciseDetailsParams = {
  exerciseId: string;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ExerciseDetails"
>;

export default function ExerciseDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "ExerciseDetails">>();
  const navigation = useNavigation<NavigationProp>();
  const { exerciseId } = route.params;

  const { exercises, favorites, toggleFavorite, delExercise } = useExercises(); // Added delExercise

  // Try to find in context first
  const contextExercise = exercises.find((e) => e.id === exerciseId);

  const [exercise, setExercise] = useState<Exercise | null>(
    contextExercise || null,
  );
  const [loading, setLoading] = useState(!contextExercise);
  const [error, setError] = useState<string | null>(null);

  const isFavorite = favorites.includes(exerciseId);

  useEffect(() => {
    if (!exercise) {
      loadExerciseDetails();
    }
  }, [exerciseId]);

  const loadExerciseDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchExerciseById(exerciseId);
      if (data) {
        setExercise(data);
      } else {
        setError("Exercice non trouvé.");
      }
    } catch (err) {
      setError("Erreur lors du chargement des détails.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer l'exercice",
      "Êtes-vous sûr de vouloir supprimer cet exercice ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await delExercise(exerciseId);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer l'exercice.");
            }
          },
        },
      ],
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete} style={{ marginRight: 10 }}>
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, exerciseId]);

  useEffect(() => {
    if (exercise) {
      navigation.setOptions({
        title: exercise.name,
      });
    }
  }, [exercise, navigation]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Exercice introuvable"}</Text>
        <Button title="Retour" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const difficultyColor = {
    easy: "#4CAF50",
    medium: "#FF9800",
    hard: "#F44336",
  }[exercise.difficulty || "medium"];

  const CATEGORY_LABELS: { [key: string]: string } = {
    Strength: "Musculation",
    Cardio: "Cardio",
    Flexibility: "Yoga/Souplesse",
    Balance: "Équilibre",
    HIIT: "HIIT",
    Other: "Autre",
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {exercise.imageUrl && (
        <Image
          source={{ uri: exercise.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.header}>
        <Text style={styles.title}>{exercise.name}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(exerciseId)}>
          <MaterialCommunityIcons
            name={isFavorite ? "heart" : "heart-outline"}
            size={32}
            color={isFavorite ? "#E91E63" : "#757575"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tagsContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>Catégorie</Text>
          <Text style={styles.tagValue}>
            {CATEGORY_LABELS[exercise.category] || exercise.category}
          </Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>Difficulté</Text>
          <Text style={[styles.tagValue, { color: difficultyColor }]}>
            {exercise.difficulty === "easy"
              ? "Facile"
              : exercise.difficulty === "medium"
                ? "Moyenne"
                : "Difficile"}
          </Text>
        </View>
        {exercise.muscleGroup && (
          <View style={styles.tag}>
            <Text style={styles.tagLabel}>Muscle</Text>
            <Text style={styles.tagValue}>{exercise.muscleGroup}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{exercise.description}</Text>
      </View>

      {/* Example for future expansion */}
      {/* <View style={styles.section}>
         <Text style={styles.sectionTitle}>Instructions</Text> 
         ...
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 250,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
    color: "#333",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    gap: 15,
  },
  tag: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    minWidth: "28%",
    alignItems: "center",
  },
  tagLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  tagValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    marginBottom: 20,
  },
});
