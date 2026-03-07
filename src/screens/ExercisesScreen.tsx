import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ExerciseCard from "../components/ExerciseCard";
import { useExercises } from "../context/ExercisesContext";
import { Exercise } from "../types/exercise";

export default function ExercisesScreen() {
  const {
    exercises,
    isLoading,
    error,
    loadExercises,
    toggleFavorite,
    favorites,
  } = useExercises();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExercises();
    setRefreshing(false);
  };

  // Affichage du spinner pendant le chargement initial
  if (isLoading && exercises.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des exercices...</Text>
      </View>
    );
  }

  // Affichage de l'erreur
  if (error && exercises.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Oups !</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Réessayer" onPress={loadExercises} color="#007AFF" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Exercise }) => {
    const isFavorite = favorites.includes(item.id);
    return (
      <ExerciseCard
        exercise={item}
        isFavorite={isFavorite}
        onToggleFavorite={() => toggleFavorite(item.id)}
        // onPress to be implemented later
        onPress={() => {}}
      />
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Aucun exercice trouvé.</Text>
      <Button title="Actualiser" onPress={loadExercises} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          exercises.length === 0 ? styles.emptyListContent : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Pour éviter que le dernier élément soit caché par la Bottom Tab
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 16,
  },
});
