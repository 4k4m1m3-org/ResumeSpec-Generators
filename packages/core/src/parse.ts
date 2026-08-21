export const PARSE_ERROR_CODES = {
  EMPTY: "empty",
  INVALID_JSON: "invalid-json",
  NOT_OBJECT: "not-object",
} as const;

export type ParseErrorCode =
  (typeof PARSE_ERROR_CODES)[keyof typeof PARSE_ERROR_CODES];

export interface ParseError {
  code: ParseErrorCode;
  userMessage: string;
  technicalMessage: string;
}

export type ParseResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: ParseError };

/**
 * Parse a ResumeSpec JSON document.
 *
 * Parsing is not validation. A parsed object may still fail schema checks.
 * A ResumeSpec document must be a JSON object (not an array, null, or primitive).
 */
export function parseJson(text: string): ParseResult {
  if (typeof text !== "string" || text.trim() === "") {
    return {
      ok: false,
      error: {
        code: PARSE_ERROR_CODES.EMPTY,
        userMessage: "El contenido está vacío. Carga un archivo ResumeSpec JSON.",
        technicalMessage: "Document text is empty or whitespace-only.",
      },
    };
  }

  let data: unknown;

  try {
    data = JSON.parse(text);
  } catch (cause) {
    const detail =
      cause instanceof SyntaxError ? cause.message : "JSON.parse failed";

    return {
      ok: false,
      error: {
        code: PARSE_ERROR_CODES.INVALID_JSON,
        userMessage: "El archivo no es un JSON válido.",
        technicalMessage: detail,
      },
    };
  }

  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return {
      ok: false,
      error: {
        code: PARSE_ERROR_CODES.NOT_OBJECT,
        userMessage: "El documento ResumeSpec debe ser un objeto JSON.",
        technicalMessage: `Parsed JSON value is ${describeValue(data)}, not an object.`,
      },
    };
  }

  return { ok: true, data: data as Record<string, unknown> };
}

function describeValue(value: unknown): string {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  return typeof value;
}
