import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  RESUMESPEC_SCHEMA_ID,
  RESUMESPEC_VERSION,
  SCHEMA_VERSION,
  resumeSpecSchema,
} from "../src/index.js";
import { PACKAGED_SCHEMA_PATH, VENDOR_SCHEMA_PATH } from "./helpers.js";

describe("ResumeSpec v1.0.0 schema pin", () => {
  it("keeps the vendor schema and the package copy byte-identical", () => {
    const vendor = readFileSync(VENDOR_SCHEMA_PATH);
    const packaged = readFileSync(PACKAGED_SCHEMA_PATH);

    expect(vendor.equals(packaged)).toBe(true);
  });

  it("exposes the official $id, draft, and 1.0.0 versions", () => {
    expect(resumeSpecSchema.$id).toBe(RESUMESPEC_SCHEMA_ID);
    expect(resumeSpecSchema.$schema).toBe(
      "https://json-schema.org/draft/2020-12/schema",
    );
    expect(resumeSpecSchema.$id).toBe(
      "https://resumespec.org/schemas/json/v1.0.0/resumespec.schema.json",
    );
    expect(RESUMESPEC_VERSION).toBe("1.0.0");
    expect(SCHEMA_VERSION).toBe("1.0.0");
  });
});
