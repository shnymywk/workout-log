import { bodyPartFormSchema } from "@/features/exercises/schemas/body-part-schema";

describe("bodyPartFormSchema", () => {
  it("trims a valid body part name", () => {
    const result = bodyPartFormSchema.parse({
      name: "  胸  "
    });

    expect(result).toEqual({
      name: "胸"
    });
  });

  it("rejects a blank body part name", () => {
    const result = bodyPartFormSchema.safeParse({
      name: "   "
    });

    expect(result.success).toBe(false);
  });

  it("rejects a body part name longer than 40 characters", () => {
    const result = bodyPartFormSchema.safeParse({
      name: "あ".repeat(41)
    });

    expect(result.success).toBe(false);
  });
});
