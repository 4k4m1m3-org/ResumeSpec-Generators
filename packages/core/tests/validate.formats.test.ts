import { describe, expect, it } from "vitest";
import { validateResume } from "../src/index.js";
import { minimalDocument } from "./helpers.js";

describe("formats and patterns", () => {
  it("accepts profile dates with year, year-month, and full date precision", () => {
    const document = minimalDocument();
    (document.sections as Record<string, unknown>).experience = [
      {
        dateRange: {
          startDate: "2023",
          endDate: "2024-06",
        },
      },
      {
        dateRange: {
          startDate: "2025-01-15",
          current: true,
        },
      },
    ];

    expect(validateResume(document).valid).toBe(true);
  });

  it("accepts a null endDate", () => {
    const document = minimalDocument();
    (document.sections as Record<string, unknown>).experience = [
      {
        dateRange: {
          startDate: "2026-01",
          endDate: null,
        },
      },
    ];

    expect(validateResume(document).valid).toBe(true);
  });

  it("rejects a profile date that is not YYYY / YYYY-MM / YYYY-MM-DD", () => {
    const document = minimalDocument();
    (document.sections as Record<string, unknown>).experience = [
      {
        dateRange: {
          startDate: "January 2026",
        },
      },
    ];

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(
        result.errors.some(
          (error) =>
            error.path === "sections.experience.0.dateRange.startDate" &&
            error.userMessage.includes("AAAA"),
        ),
      ).toBe(true);
    }
  });

  it("rejects an invalid email", () => {
    const document = minimalDocument();
    (document.sections as Record<string, unknown>).identity = {
      contact: { email: "not-an-email" },
    };

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(
        result.errors.some((error) =>
          error.userMessage.includes("correo"),
        ),
      ).toBe(true);
    }
  });

  it("accepts a valid email and https link", () => {
    const document = minimalDocument();
    (document.sections as Record<string, unknown>).identity = {
      contact: { email: "person@example.com" },
    };
    (document.sections as Record<string, unknown>).links = [
      { url: "https://example.com/profile" },
    ];

    expect(validateResume(document).valid).toBe(true);
  });

  it("rejects a non-http URL", () => {
    const document = minimalDocument();
    (document.sections as Record<string, unknown>).links = [
      { url: "ftp://example.com/file" },
    ];

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(
        result.errors.some((error) => error.userMessage.includes("http")),
      ).toBe(true);
    }
  });

  it("rejects a malformed URI even if it starts with http", () => {
    const document = minimalDocument();
    (document.sections as Record<string, unknown>).links = [
      { url: "http://[invalid" },
    ];

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it("rejects metadata dates that are not full YYYY-MM-DD", () => {
    const document = minimalDocument();
    (document.metadata as Record<string, unknown>).created = "2026-01";

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(
        result.errors.some((error) => error.path === "metadata.created"),
      ).toBe(true);
    }
  });

  it("rejects a language tag that is not BCP 47-like", () => {
    const document = minimalDocument();
    (document.metadata as Record<string, unknown>).language = "español";

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(
        result.errors.some((error) =>
          error.userMessage.includes("BCP 47"),
        ),
      ).toBe(true);
    }
  });

  it("rejects duplicate metadata tags", () => {
    const document = minimalDocument();
    (document.metadata as Record<string, unknown>).tags = [
      "developer",
      "developer",
    ];

    const result = validateResume(document);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(
        result.errors.some((error) =>
          error.userMessage.includes("no pueden repetirse"),
        ),
      ).toBe(true);
    }
  });
});
