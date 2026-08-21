import { describe, expect, it } from "vitest";
import { parseJson, validateResume } from "../src/index.js";
import { minimalDocument, readVendorExample } from "./helpers.js";

describe("x-* extensions", () => {
  it("accepts the official edge-extension example", () => {
    const parsed = parseJson(readVendorExample("edge-extension.json"));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(validateResume(parsed.data).valid).toBe(true);
  });

  it("accepts x-* fields on the document, metadata, sections, and items", () => {
    const document = minimalDocument({
      "x-documentId": "profile-001",
    });
    const metadata = document.metadata as Record<string, unknown>;
    metadata["x-ownerSystem"] = "example-hris";
    const sections = document.sections as Record<string, unknown>;
    sections["x-exampleSection"] = { note: "preserved, not core" };
    sections.skills = [
      {
        name: "Linux",
        "x-source": "self-reported",
      },
    ];

    expect(validateResume(document).valid).toBe(true);
  });

  it("rejects extension-like fields that do not use the x- prefix", () => {
    const document = minimalDocument();
    const sections = document.sections as Record<string, unknown>;
    sections.skills = [
      {
        name: "Linux",
        source: "self-reported",
      },
    ];

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(
        result.errors.some(
          (error) =>
            error.keyword === "additionalProperties" &&
            error.userMessage.includes("source"),
        ),
      ).toBe(true);
    }
  });
});
