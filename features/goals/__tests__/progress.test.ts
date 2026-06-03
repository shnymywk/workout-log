import { calculateAchievementRate } from "@/features/goals/lib/progress";

describe("calculateAchievementRate", () => {
  it("calculates achievement rate from current max and target weight", () => {
    expect(calculateAchievementRate(80, 100)).toBe(80);
  });

  it("returns null when current max weight is not available", () => {
    expect(calculateAchievementRate(null, 100)).toBeNull();
  });

  it("caps achievement rate at 999", () => {
    expect(calculateAchievementRate(1000, 10)).toBe(999);
  });
});
