import { describe, expect, it } from "vitest";
import { validateResume } from "../src/index.js";
import { minimalDocument } from "./helpers.js";

describe("schema contract", () => {
  it("accepts a minimal document with empty sections", () => {
    const result = validateResume(minimalDocument());

    expect(result.valid).toBe(true);
  });

  it("accepts a valid document that is not useful as a CV", () => {
    const result = validateResume({
      metadata: {
        resumespecVersion: "1.0.0",
        schemaVersion: "1.0.0",
        language: "es",
      },
      sections: {
        summary: {
          text: "Perfil sin identidad ni experiencia.",
        },
      },
    });

    expect(result.valid).toBe(true);
  });

  it("requires metadata and sections", () => {
    const withoutMetadata = validateResume({ sections: {} });
    const withoutSections = validateResume({
      metadata: {
        resumespecVersion: "1.0.0",
        schemaVersion: "1.0.0",
        language: "en",
      },
    });

    expect(withoutMetadata.valid).toBe(false);
    expect(withoutSections.valid).toBe(false);
    if (!withoutMetadata.valid) {
      expect(
        withoutMetadata.errors.some((error) =>
          error.userMessage.includes("metadata"),
        ),
      ).toBe(true);
    }
    if (!withoutSections.valid) {
      expect(
        withoutSections.errors.some((error) =>
          error.userMessage.includes("sections"),
        ),
      ).toBe(true);
    }
  });

  it("requires metadata.resumespecVersion, schemaVersion, and language", () => {
    const missingVersion = minimalDocument();
    delete (missingVersion.metadata as Record<string, unknown>)
      .resumespecVersion;

    const missingSchema = minimalDocument();
    delete (missingSchema.metadata as Record<string, unknown>).schemaVersion;

    const missingLanguage = minimalDocument();
    delete (missingLanguage.metadata as Record<string, unknown>).language;

    expect(validateResume(missingVersion).valid).toBe(false);
    expect(validateResume(missingSchema).valid).toBe(false);
    expect(validateResume(missingLanguage).valid).toBe(false);
  });

  it("rejects a ResumeSpec version other than 1.0.0", () => {
    const document = minimalDocument();
    (document.metadata as Record<string, unknown>).resumespecVersion = "2.0.0";

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(
        result.errors.some((error) =>
          error.userMessage.includes("ResumeSpec 1.0.0"),
        ),
      ).toBe(true);
      expect(result.errors[0]?.path).toBe("metadata.resumespecVersion");
    }
  });

  it("enforces types", () => {
    const document = minimalDocument();
    (document.sections as Record<string, unknown>).skills = "Python";

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((error) => error.path === "sections.skills")).toBe(
        true,
      );
      expect(
        result.errors.some((error) => error.userMessage.includes("lista")),
      ).toBe(true);
    }
  });

  it("enforces enums", () => {
    const document = minimalDocument();
    (document.metadata as Record<string, unknown>).visibility = "everyone";

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(
        result.errors.some(
          (error) =>
            error.path === "metadata.visibility" &&
            error.userMessage.includes("público"),
        ),
      ).toBe(true);
    }
  });

  it("rejects unknown core fields", () => {
    const document = minimalDocument();
    (document.sections as Record<string, unknown>).unexpectedSection = [];

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(
        result.errors.some(
          (error) =>
            error.keyword === "additionalProperties" &&
            error.userMessage.includes("unexpectedSection"),
        ),
      ).toBe(true);
    }
  });

  it("requires summary.text when summary is present", () => {
    const document = minimalDocument();
    (document.sections as Record<string, unknown>).summary = {};

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(
        result.errors.some((error) =>
          error.userMessage.includes("perfil profesional"),
        ),
      ).toBe(true);
    }
  });

  it("requires Link.url", () => {
    const document = minimalDocument();
    (document.sections as Record<string, unknown>).links = [
      { description: "sin url" },
    ];

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(
        result.errors.some((error) => error.userMessage.includes("URL")),
      ).toBe(true);
    }
  });

  it("keeps a technical path and message on every issue", () => {
    const result = validateResume({});
    expect(result.valid).toBe(false);
    if (!result.valid) {
      for (const error of result.errors) {
        expect(error.path.length).toBeGreaterThan(0);
        expect(error.technicalMessage.length).toBeGreaterThan(0);
        expect(error.userMessage.length).toBeGreaterThan(0);
        expect(error.keyword.length).toBeGreaterThan(0);
      }
    }
  });
});
