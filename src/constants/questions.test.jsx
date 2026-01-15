import { describe, it, expect } from "vitest";
import { iconsv2_questions } from "./questions";

describe("iconsv2_questions", () => {
  it("includes entries with required fields", () => {
    expect(iconsv2_questions.length).toBeGreaterThan(0);
    iconsv2_questions.forEach((icon) => {
      expect(icon.uuid).toBeTruthy();
      expect(icon.icon).toBeTruthy();
      expect(icon.name).toBeTruthy();
      expect(icon.meaning).toBeTruthy();
      expect(Array.isArray(icon.trigger_question)).toBe(true);
      expect(icon.trigger_question.length).toBeGreaterThan(0);
    });
  });
});
