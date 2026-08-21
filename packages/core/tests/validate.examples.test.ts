import { describe, expect, it } from "vitest";
import { parseJson, validateResume } from "../src/index.js";
import {
  OFFICIAL_VALID_EXAMPLES,
  parseVendorExample,
  readVendorExample,
} from "./helpers.js";

describe("official ResumeSpec v1.0.0 examples", () => {
  it.each([...OFFICIAL_VALID_EXAMPLES])(
    "accepts %s as a valid document",
    (name) => {
      const parsed = parseJson(readVendorExample(name));
      expect(parsed.ok).toBe(true);
      if (!parsed.ok) {
        return;
      }

      const result = validateResume(parsed.data);
      expect(result.valid).toBe(true);
    },
  );

  it("accepts the official invalid-unknown-field example as parseable JSON", () => {
    const parsed = parseJson(readVendorExample("invalid-unknown-field.json"));
    expect(parsed.ok).toBe(true);
  });

  it("rejects the official invalid-unknown-field example during validation", () => {
    const document = parseVendorExample("invalid-unknown-field.json");
    const result = validateResume(document);

    expect(result.valid).toBe(false);
    if (result.valid) {
      return;
    }

    expect(
      result.errors.some(
        (error) =>
          error.keyword === "additionalProperties" &&
          error.userMessage.includes("unexpectedSection"),
      ),
    ).toBe(true);
  });
});
