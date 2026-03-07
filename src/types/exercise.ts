export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  muscleGroup?: string;
  difficulty?: "easy" | "medium" | "hard";
  imageUrl?: string;
}
