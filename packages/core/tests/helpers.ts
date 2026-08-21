import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(TESTS_DIR, "../../..");

export const VENDOR_DIR = join(REPO_ROOT, "vendor/resumespec/v1.0.0");
export const VENDOR_SCHEMA_PATH = join(VENDOR_DIR, "resumespec.schema.json");
export const PACKAGED_SCHEMA_PATH = join(
  TESTS_DIR,
  "../src/schema/resumespec.schema.json",
);

export const OFFICIAL_VALID_EXAMPLES = [
  "minimal.json",
  "developer.json",
  "student.json",
  "cybersecurity.json",
  "it-operations.json",
  "edge-extension.json",
] as const;

export function readVendorExample(name: string): string {
  return readFileSync(join(VENDOR_DIR, "examples/json", name), "utf8");
}

export function parseVendorExample(name: string): Record<string, unknown> {
  return JSON.parse(readVendorExample(name)) as Record<string, unknown>;
}

export function minimalDocument(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    metadata: {
      resumespecVersion: "1.0.0",
      schemaVersion: "1.0.0",
      language: "en",
    },
    sections: {},
    ...overrides,
  };
}
