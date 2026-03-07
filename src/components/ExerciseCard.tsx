import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Exercise } from "../types/exercise";

interface ExerciseCardProps {
  exercise: Exercise;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress?: () => void;
}

const DIFFICULTY_COLORS = {
  easy: "#4CAF50",
  medium: "#FF9800",
  hard: "#F44336",
};

const DIFFICULTY_LABELS = {
  easy: "Facile",
  medium: "Moyen",
  hard: "Difficile",
};

const CATEGORY_LABELS: { [key: string]: string } = {
  Strength: "Musculation",
  Cardio: "Cardio",
  Flexibility: "Yoga/Souplesse",
  Balance: "Équilibre",
  HIIT: "HIIT",
  Other: "Autre",
};

export default function ExerciseCard({
  exercise,
  isFavorite,
  onToggleFavorite,
  onPress,
}: ExerciseCardProps) {
  const difficultyColor = exercise.difficulty
    ? DIFFICULTY_COLORS[exercise.difficulty]
    : "#999";

  const difficultyLabel = exercise.difficulty
    ? DIFFICULTY_LABELS[exercise.difficulty]
    : "Inconnu";

  const categoryLabel = CATEGORY_LABELS[exercise.category] || exercise.category;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {exercise.name}
          </Text>
          <Text style={styles.category}>{categoryLabel}</Text>
        </View>
        <TouchableOpacity
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
        >
          <MaterialCommunityIcons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#E91E63" : "#757575"}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {exercise.description}
      </Text>

      <View style={styles.footer}>
        {exercise.muscleGroup && (
          <View style={styles.badge}>
            <MaterialCommunityIcons name="arm-flex" size={14} color="#555" />
            <Text style={styles.badgeText}>{exercise.muscleGroup}</Text>
          </View>
        )}

        <View
          style={[styles.badge, { backgroundColor: difficultyColor + "20" }]}
        >
          <View style={[styles.dot, { backgroundColor: difficultyColor }]} />
          <Text
            style={[
              styles.badgeText,
              { color: difficultyColor, fontWeight: "600" },
            ]}
          >
            {difficultyLabel}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  favoriteButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "#555",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
