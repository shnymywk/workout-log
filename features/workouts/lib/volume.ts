export function calculateWorkoutVolume(weight: number, sets: number, reps: number) {
  if (weight <= 0 || sets <= 0 || reps <= 0) {
    return 0;
  }

  return weight * sets * reps;
}

export type WorkoutVolumeSet = {
  weight: number;
  reps: number;
};

export type WorkoutVolumeInput = {
  weight: number;
  sets: number;
  reps: number;
  workout_log_sets?: WorkoutVolumeSet[] | null;
};

export function calculateWorkoutSetDetailsVolume(workoutLogSets: WorkoutVolumeSet[]) {
  return workoutLogSets.reduce(
    (totalVolume, workoutLogSet) =>
      totalVolume + calculateWorkoutVolume(workoutLogSet.weight, 1, workoutLogSet.reps),
    0
  );
}

export function calculateWorkoutLogVolume(workoutLog: WorkoutVolumeInput) {
  if (workoutLog.workout_log_sets && workoutLog.workout_log_sets.length > 0) {
    return calculateWorkoutSetDetailsVolume(workoutLog.workout_log_sets);
  }

  return calculateWorkoutVolume(workoutLog.weight, workoutLog.sets, workoutLog.reps);
}
