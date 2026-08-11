export interface AIProgressEntity {
  id: string;
  userId: string;
  lessonId: string | null;
  completedCount: number;
  quizScore: number;
  lastStudiedAt: string | null;
  updatedAt: string;
  createdAt: string;
}
