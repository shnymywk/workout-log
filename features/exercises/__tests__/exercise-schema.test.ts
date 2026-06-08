import { exerciseFormSchema } from "@/features/exercises/schemas/exercise-schema";

describe("exerciseFormSchema", () => {
  it("trims a valid exercise name and keeps body part ids", () => {
    const bodyPartIds = [
      "11111111-1111-4111-8111-111111111111",
      "22222222-2222-4222-8222-222222222222"
    ];
    const result = exerciseFormSchema.parse({
      name: "  ベンチプレス  ",
      bodyPartIds
    });

    expect(result).toEqual({
      name: "ベンチプレス",
      bodyPartIds
    });
  });

  it("allows an empty body part id list", () => {
    const result = exerciseFormSchema.parse({
      name: "スクワット",
      bodyPartIds: []
    });

    expect(result.bodyPartIds).toEqual([]);
  });

  it("deduplicates body part ids", () => {
    const bodyPartId = "11111111-1111-4111-8111-111111111111";
    const result = exerciseFormSchema.parse({
      name: "スクワット",
      bodyPartIds: [bodyPartId, bodyPartId]
    });

    expect(result.bodyPartIds).toEqual([bodyPartId]);
  });

  it("rejects a blank exercise name", () => {
    const result = exerciseFormSchema.safeParse({
      name: "   ",
      bodyPartIds: []
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid body part id", () => {
    const result = exerciseFormSchema.safeParse({
      name: "デッドリフト",
      bodyPartIds: ["not-a-uuid"]
    });

    expect(result.success).toBe(false);
  });
});
