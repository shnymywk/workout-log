export type WorkoutLogActionState = {
  error: string | null;
  success: string | null;
};

export const initialWorkoutLogActionState: WorkoutLogActionState = {
  error: null,
  success: null
};
