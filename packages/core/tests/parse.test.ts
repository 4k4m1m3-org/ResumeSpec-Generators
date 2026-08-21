import { describe, expect, it } from "vitest";
import { PARSE_ERROR_CODES, parseJson } from "../src/index.js";
import { readVendorExample } from "./helpers.js";

describe("parseJson", () => {
  it("parses a JSON object without validating it", () => {
    const result = parseJson(readVendorExample("minimal.json"));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toMatchObject({
        metadata: {
          resumespecVersion: "1.0.0",
        },
      });
    }
  });

  it("parses an object that is not a valid ResumeSpec document", () => {
    const result = parseJson('{"unexpected": true}');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ unexpected: true });
    }
  });

  it("rejects empty content", () => {
    for (const text of ["", "   ", "\n\t"]) {
      const result = parseJson(text);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe(PARSE_ERROR_CODES.EMPTY);
        expect(result.error.userMessage).toContain("vacío");
      }
    }
  });

  it("rejects invalid JSON syntax with a Spanish message", () => {
    const result = parseJson("{ not json");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe(PARSE_ERROR_CODES.INVALID_JSON);
      expect(result.error.userMessage).toBe("El archivo no es un JSON válido.");
      expect(result.error.technicalMessage.length).toBeGreaterThan(0);
    }
  });

  it("rejects arrays, null, and primitives", () => {
    const cases = ["[]", "null", "1", '"text"', "true"];

    for (const text of cases) {
      const result = parseJson(text);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe(PARSE_ERROR_CODES.NOT_OBJECT);
        expect(result.error.userMessage).toBe(
          "El documento ResumeSpec debe ser un objeto JSON.",
        );
      }
    }
  });
});
