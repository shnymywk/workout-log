export function calculateWorkoutVolume(weight: number, sets: number, reps: number) {
  if (weight <= 0 || sets <= 0 || reps <= 0) {
    return 0;
  }

  return weight * sets * reps;
}
