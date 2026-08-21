import { Ajv2020 } from "ajv/dist/2020.js";
import * as addFormatsModule from "ajv-formats";
import { mapAjvErrors, type ValidationIssue } from "./errors.js";
import type { ResumeSpecDocument } from "./types.js";
import { resumeSpecSchema } from "./schema.js";

type FormatsPlugin = (instance: Ajv2020) => unknown;

function cjsCallable<T>(mod: unknown): T {
  if (typeof mod === "function") {
    return mod as T;
  }

  if (mod && typeof mod === "object" && "default" in mod) {
    const inner = (mod as { default: unknown }).default;
    if (typeof inner === "function") {
      return inner as T;
    }
  }

  throw new Error("Unable to load ajv-formats");
}

const addFormats = cjsCallable<FormatsPlugin>(addFormatsModule);

const ajv = new Ajv2020({
  allErrors: true,
  verbose: true,
  strict: true,
});

addFormats(ajv);

const validate = ajv.compile(resumeSpecSchema);

export type ValidationSuccess = {
  valid: true;
  document: ResumeSpecDocument;
};

export type ValidationFailure = {
  valid: false;
  errors: ValidationIssue[];
};

export type ValidationResult = ValidationSuccess | ValidationFailure;

/**
 * Validate already-parsed data against the official ResumeSpec v1.0.0 schema.
 */
export function validateResume(data: unknown): ValidationResult {
  const valid = validate(data);

  if (valid) {
    return {
      valid: true,
      document: data as ResumeSpecDocument,
    };
  }

  return {
    valid: false,
    errors: mapAjvErrors(validate.errors),
  };
}
