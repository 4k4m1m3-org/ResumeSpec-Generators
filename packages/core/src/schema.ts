import schema from "./schema/resumespec.schema.json" with { type: "json" };

export const RESUMESPEC_VERSION = "1.0.0";
export const SCHEMA_VERSION = "1.0.0";

export const RESUMESPEC_SCHEMA_ID =
  "https://resumespec.org/schemas/json/v1.0.0/resumespec.schema.json";

export const resumeSpecSchema = schema;

export type ResumeSpecJsonSchema = typeof schema;
