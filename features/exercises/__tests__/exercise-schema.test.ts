import { exerciseFormSchema } from "@/features/exercises/schemas/exercise-schema";

describe("exerciseFormSchema", () => {
  it("trims a valid exercise name and keeps a body part id", () => {
    const bodyPartId = "11111111-1111-4111-8111-111111111111";
    const result = exerciseFormSchema.parse({
      name: "  ベンチプレス  ",
      bodyPartId
    });

    expect(result).toEqual({
      name: "ベンチプレス",
      bodyPartId
    });
  });

  it("converts a blank body part id to null", () => {
    const result = exerciseFormSchema.parse({
      name: "スクワット",
      bodyPartId: ""
    });

    expect(result.bodyPartId).toBeNull();
  });

  it("rejects a blank exercise name", () => {
    const result = exerciseFormSchema.safeParse({
      name: "   ",
      bodyPartId: ""
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid body part id", () => {
    const result = exerciseFormSchema.safeParse({
      name: "デッドリフト",
      bodyPartId: "not-a-uuid"
    });

    expect(result.success).toBe(false);
  });
});
