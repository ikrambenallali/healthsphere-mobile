import { Ionicons } from "@expo/vector-icons"; // Added
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity, // Added
  View,
} from "react-native";
import ExerciseCard from "../components/ExerciseCard";
import { useExercises } from "../context/ExercisesContext";
import { Exercise } from "../types/exercise";
import { RootStackParamList } from "../types/navigation";

export default function ExercisesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    exercises,
    isLoading,
    error,
    loadExercises,
    toggleFavorite,
    favorites,
  } = useExercises();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "favorites">("all"); // Added state

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExercises();
    setRefreshing(false);
  };

  const filteredExercises =
    filter === "all"
      ? exercises
      : exercises.filter((ex) => favorites.includes(ex.id));

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
        onPress={() =>
          navigation.navigate("ExerciseDetails", { exerciseId: item.id })
        }
      />
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {filter === "favorites"
          ? "Aucun favori pour le moment."
          : "Aucun exercice trouvé."}
      </Text>
      {filter === "all" && (
        <Button title="Actualiser" onPress={loadExercises} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs Filter */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, filter === "all" && styles.activeTab]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[styles.tabText, filter === "all" && styles.activeTabText]}
          >
            Tous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filter === "favorites" && styles.activeTab]}
          onPress={() => setFilter("favorites")}
        >
          <Text
            style={[
              styles.tabText,
              filter === "favorites" && styles.activeTabText,
            ]}
          >
            Favoris
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredExercises}
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
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddWorkout")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F9',
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
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeTab: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOpacity: 0.4,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
