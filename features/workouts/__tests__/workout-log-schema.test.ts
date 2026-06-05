import {
  workoutLogBatchFormSchema,
  workoutLogFormSchema,
  workoutLogSetDetailsFormSchema
} from "@/features/workouts/schemas/workout-log-schema";

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

  it("parses batch workout logs with set details", () => {
    const result = workoutLogBatchFormSchema.parse({
      trainedAt: "2026-06-03",
      logs: JSON.stringify([
        {
          exerciseId: validExerciseId,
          memo: "  重め  ",
          sets: [
            { weight: "70", reps: "8" },
            { weight: "72.5", reps: "6" }
          ]
        }
      ])
    });

    expect(result).toEqual({
      trainedAt: "2026-06-03",
      logs: [
        {
          exerciseId: validExerciseId,
          memo: "重め",
          sets: [
            { weight: 70, reps: 8 },
            { weight: 72.5, reps: 6 }
          ]
        }
      ]
    });
  });

  it("rejects batch workout logs without sets", () => {
    const result = workoutLogBatchFormSchema.safeParse({
      trainedAt: "2026-06-03",
      logs: JSON.stringify([
        {
          exerciseId: validExerciseId,
          memo: "",
          sets: []
        }
      ])
    });

    expect(result.success).toBe(false);
  });

  it("parses workout log set details for editing", () => {
    const result = workoutLogSetDetailsFormSchema.parse({
      exerciseId: validExerciseId,
      trainedAt: "2026-06-03",
      memo: "",
      setDetails: JSON.stringify([
        { weight: "70", reps: "8" },
        { weight: "72.5", reps: "6" }
      ])
    });

    expect(result).toEqual({
      exerciseId: validExerciseId,
      trainedAt: "2026-06-03",
      memo: null,
      setDetails: [
        { weight: 70, reps: 8 },
        { weight: 72.5, reps: 6 }
      ]
    });
  });
});
