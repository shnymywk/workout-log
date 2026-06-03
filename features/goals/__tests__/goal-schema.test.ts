import { goalFormSchema } from "@/features/goals/schemas/goal-schema";

const validExerciseId = "11111111-1111-4111-8111-111111111111";

describe("goalFormSchema", () => {
  it("parses a valid goal form", () => {
    const result = goalFormSchema.parse({
      exerciseId: validExerciseId,
      targetWeight: "100.5"
    });

    expect(result).toEqual({
      exerciseId: validExerciseId,
      targetWeight: 100.5
    });
  });

  it("rejects an invalid exercise id", () => {
    const result = goalFormSchema.safeParse({
      exerciseId: "not-a-uuid",
      targetWeight: "100"
    });

    expect(result.success).toBe(false);
  });

  it("rejects a non-positive target weight", () => {
    const result = goalFormSchema.safeParse({
      exerciseId: validExerciseId,
      targetWeight: "0"
    });

    expect(result.success).toBe(false);
  });
});
