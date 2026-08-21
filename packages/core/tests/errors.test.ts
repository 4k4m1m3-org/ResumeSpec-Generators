import { describe, expect, it } from "vitest";
import { validateResume } from "../src/index.js";
import { minimalDocument } from "./helpers.js";

describe("Spanish error mapping", () => {
  it("maps missing required properties to human-readable Spanish", () => {
    const result = validateResume({});
    expect(result.valid).toBe(false);
    if (!result.valid) {
      const messages = result.errors.map((error) => error.userMessage);
      expect(messages.some((message) => message.includes("metadata"))).toBe(
        true,
      );
      expect(messages.some((message) => message.includes("sections"))).toBe(
        true,
      );
    }
  });

  it("maps employmentType enum values with Spanish labels", () => {
    const document = minimalDocument();
    (document.sections as Record<string, unknown>).experience = [
      { employmentType: "permanent" },
    ];

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      const message = result.errors.find(
        (error) => error.path === "sections.experience.0.employmentType",
      )?.userMessage;
      expect(message).toContain("tiempo completo");
      expect(message).toContain("full-time");
    }
  });

  it("does not expose only the raw Ajv required-property phrasing", () => {
    const result = validateResume({});
    expect(result.valid).toBe(false);
    if (!result.valid) {
      for (const error of result.errors) {
        expect(error.userMessage.startsWith("must have required property")).toBe(
          false,
        );
      }
    }
  });
});
