import { calculateWorkoutVolume } from "@/features/workouts/lib/volume";

describe("calculateWorkoutVolume", () => {
  it("calculates total workout volume", () => {
    expect(calculateWorkoutVolume(70, 3, 8)).toBe(1680);
  });

  it("returns 0 when any value is not positive", () => {
    expect(calculateWorkoutVolume(0, 3, 8)).toBe(0);
    expect(calculateWorkoutVolume(70, 0, 8)).toBe(0);
    expect(calculateWorkoutVolume(70, 3, 0)).toBe(0);
  });
});
