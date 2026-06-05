import {
  calculateWorkoutLogVolume,
  calculateWorkoutSetDetailsVolume,
  calculateWorkoutVolume
} from "@/features/workouts/lib/volume";

describe("calculateWorkoutVolume", () => {
  it("calculates total workout volume", () => {
    expect(calculateWorkoutVolume(70, 3, 8)).toBe(1680);
  });

  it("returns 0 when any value is not positive", () => {
    expect(calculateWorkoutVolume(0, 3, 8)).toBe(0);
    expect(calculateWorkoutVolume(70, 0, 8)).toBe(0);
    expect(calculateWorkoutVolume(70, 3, 0)).toBe(0);
  });

  it("calculates total volume from set details", () => {
    expect(
      calculateWorkoutSetDetailsVolume([
        { weight: 70, reps: 8 },
        { weight: 72.5, reps: 6 },
        { weight: 75, reps: 5 }
      ])
    ).toBe(1370);
  });

  it("uses set detail volume when workout log sets exist", () => {
    expect(
      calculateWorkoutLogVolume({
        weight: 70,
        sets: 3,
        reps: 8,
        workout_log_sets: [
          { weight: 70, reps: 8 },
          { weight: 72.5, reps: 6 }
        ]
      })
    ).toBe(995);
  });

  it("falls back to summary values when workout log sets do not exist", () => {
    expect(
      calculateWorkoutLogVolume({
        weight: 70,
        sets: 3,
        reps: 8,
        workout_log_sets: []
      })
    ).toBe(1680);
  });
});
