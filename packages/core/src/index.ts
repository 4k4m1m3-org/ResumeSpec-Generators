export { parseJson, PARSE_ERROR_CODES } from "./parse.js";
export type { ParseError, ParseErrorCode, ParseResult } from "./parse.js";

export { validateResume } from "./validate.js";
export type {
  ValidationFailure,
  ValidationResult,
  ValidationSuccess,
} from "./validate.js";

export { mapAjvErrors } from "./errors.js";
export type { ValidationIssue } from "./errors.js";

export type {
  Achievement,
  Attachment,
  Award,
  Certification,
  Contact,
  Course,
  Credential,
  DateRange,
  Education,
  EmploymentType,
  Evidence,
  Experience,
  Identifier,
  Identity,
  Interest,
  Language,
  LanguageLevel,
  Link,
  Location,
  Metadata,
  Organization,
  Person,
  Position,
  ProfileDate,
  Project,
  Publication,
  Reference,
  ResumeSpecDocument,
  Sections,
  Skill,
  SkillLevel,
  Social,
  Summary,
  Technology,
  Visibility,
  Volunteer,
  WorkMode,
} from "./types.js";

export {
  RESUMESPEC_SCHEMA_ID,
  RESUMESPEC_VERSION,
  SCHEMA_VERSION,
  resumeSpecSchema,
} from "./schema.js";
