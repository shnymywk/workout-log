import { workoutLogFormSchema } from "@/features/workouts/schemas/workout-log-schema";

const validExerciseId = "11111111-1111-4111-8111-111111111111";

describe("workoutLogFormSchema", () => {
  it("parses a valid workout log form", () => {
    const result = workoutLogFormSchema.parse({
      exerciseId: validExerciseId,
      trainedAt: "2026-06-03",
      weight: "70.5",
      sets: "3",
      reps: "8",
      memo: "  次回は72.5kg  "
    });

    expect(result).toEqual({
      exerciseId: validExerciseId,
      trainedAt: "2026-06-03",
      weight: 70.5,
      sets: 3,
      reps: 8,
      memo: "次回は72.5kg"
    });
  });

  it("converts a blank memo to null", () => {
    const result = workoutLogFormSchema.parse({
      exerciseId: validExerciseId,
      trainedAt: "2026-06-03",
      weight: "70",
      sets: "3",
      reps: "8",
      memo: ""
    });

    expect(result.memo).toBeNull();
  });

  it("rejects non-positive numeric values", () => {
    const result = workoutLogFormSchema.safeParse({
      exerciseId: validExerciseId,
      trainedAt: "2026-06-03",
      weight: "0",
      sets: "3",
      reps: "8",
      memo: ""
    });

    expect(result.success).toBe(false);
  });

  it("rejects a decimal set count", () => {
    const result = workoutLogFormSchema.safeParse({
      exerciseId: validExerciseId,
      trainedAt: "2026-06-03",
      weight: "70",
      sets: "3.5",
      reps: "8",
      memo: ""
    });

    expect(result.success).toBe(false);
  });
});
