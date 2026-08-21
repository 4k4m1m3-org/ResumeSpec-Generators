import type { ErrorObject } from "ajv/dist/2020.js";

export interface ValidationIssue {
  path: string;
  keyword: string;
  userMessage: string;
  technicalMessage: string;
  params?: Record<string, unknown>;
}

const REQUIRED_PROPERTY_MESSAGES: Record<string, string> = {
  metadata: "Falta la información del documento (metadata).",
  sections: "Falta la sección principal del perfil (sections).",
  resumespecVersion:
    "Falta la versión de ResumeSpec. Debe ser exactamente 1.0.0.",
  schemaVersion: "Falta la versión del schema. Debe ser exactamente 1.0.0.",
  language: "Falta el idioma del documento.",
  text: "Falta el texto del perfil profesional.",
  url: "Falta la URL de un enlace.",
};

const ENUM_VALUE_LABELS: Record<string, string> = {
  "full-time": "tiempo completo",
  "part-time": "tiempo parcial",
  contract: "contrato",
  freelance: "independiente",
  internship: "prácticas",
  volunteer: "voluntariado",
  remote: "remoto",
  hybrid: "híbrido",
  onsite: "presencial",
  beginner: "básico",
  intermediate: "intermedio",
  advanced: "avanzado",
  expert: "experto",
  basic: "básico",
  native: "nativo",
  public: "público",
  private: "privado",
  restricted: "restringido",
};

const TYPE_LABELS: Record<string, string> = {
  object: "objeto",
  array: "lista",
  string: "texto",
  number: "número",
  integer: "número entero",
  boolean: "verdadero o falso",
  null: "vacío",
};

/**
 * Convert Ajv errors into user-facing Spanish issues while keeping
 * technical paths and original messages for debugging.
 */
export function mapAjvErrors(
  errors: ErrorObject[] | null | undefined,
): ValidationIssue[] {
  if (!errors || errors.length === 0) {
    return [];
  }

  return errors.map(mapAjvError);
}

function mapAjvError(error: ErrorObject): ValidationIssue {
  const path = formatPath(error.instancePath, missingProperty(error));
  const technicalMessage = error.message
    ? `${path}: ${error.message}`
    : `${path}: schema validation failed`;

  return {
    path,
    keyword: error.keyword,
    userMessage: userMessageFor(error, path),
    technicalMessage,
    params: error.params as Record<string, unknown>,
  };
}

function userMessageFor(error: ErrorObject, path: string): string {
  switch (error.keyword) {
    case "required":
      return requiredMessage(error);
    case "additionalProperties":
      return additionalPropertyMessage(error);
    case "const":
      return constMessage(error, path);
    case "enum":
      return enumMessage(error, path);
    case "type":
      return typeMessage(error, path);
    case "format":
      return formatMessage(error, path);
    case "pattern":
      return patternMessage(error, path);
    case "uniqueItems":
      return uniqueItemsMessage(path);
    case "anyOf":
      return anyOfMessage(path);
    default:
      return `El campo ${displayPath(path)} no es válido según ResumeSpec v1.0.0.`;
  }
}

function requiredMessage(error: ErrorObject): string {
  const property = missingProperty(error);

  if (property && REQUIRED_PROPERTY_MESSAGES[property]) {
    return REQUIRED_PROPERTY_MESSAGES[property];
  }

  if (property) {
    return `Falta el campo obligatorio «${property}».`;
  }

  return "Falta un campo obligatorio en el documento.";
}

function additionalPropertyMessage(error: ErrorObject): string {
  const property = stringParam(error, "additionalProperty");

  if (property) {
    return `Hay un campo que ResumeSpec v1 no reconoce: «${property}».`;
  }

  return "Hay un campo que ResumeSpec v1 no reconoce.";
}

function constMessage(error: ErrorObject, path: string): string {
  const last = lastSegment(path);
  const allowed = error.params["allowedValue"];

  if (last === "resumespecVersion" || last === "schemaVersion") {
    return `Este generador admite ResumeSpec 1.0.0. El documento declara otra versión${
      allowed !== undefined ? ` (se esperaba ${String(allowed)})` : ""
    }.`;
  }

  if (allowed !== undefined) {
    return `El campo ${displayPath(path)} debe ser exactamente ${String(allowed)}.`;
  }

  return `El campo ${displayPath(path)} no tiene el valor requerido.`;
}

function enumMessage(error: ErrorObject, path: string): string {
  const allowed = error.params["allowedValues"];

  if (Array.isArray(allowed) && allowed.length > 0) {
    const labels = allowed.map((value) => {
      const raw = String(value);
      const label = ENUM_VALUE_LABELS[raw];
      return label ? `${raw} (${label})` : raw;
    });

    return `El campo ${displayPath(path)} no tiene un valor permitido. Valores válidos: ${labels.join(", ")}.`;
  }

  return `El campo ${displayPath(path)} no tiene un valor permitido.`;
}

function typeMessage(error: ErrorObject, path: string): string {
  const type = error.params["type"];
  const expected = Array.isArray(type)
    ? type.map((item) => TYPE_LABELS[String(item)] ?? String(item)).join(" o ")
    : (TYPE_LABELS[String(type)] ?? String(type));

  return `El campo ${displayPath(path)} debe ser de tipo ${expected}.`;
}

function formatMessage(error: ErrorObject, path: string): string {
  const format = stringParam(error, "format");

  if (format === "email") {
    return "El correo no tiene un formato válido.";
  }

  if (format === "date") {
    return `La fecha de ${displayPath(path)} debe usar el formato AAAA-MM-DD.`;
  }

  if (format === "uri") {
    return "El enlace debe ser una URL http:// o https://.";
  }

  return `El campo ${displayPath(path)} no tiene el formato esperado.`;
}

function patternMessage(error: ErrorObject, path: string): string {
  const last = lastSegment(path);
  const schemaPath = error.schemaPath;

  if (last === "language" && path.startsWith("metadata")) {
    return "El idioma del documento debe ser una etiqueta BCP 47 (por ejemplo, es o es-PE).";
  }

  if (last === "url" || schemaPath.includes("/Link/")) {
    return "El enlace debe ser una URL http:// o https://.";
  }

  if (
    last === "startDate" ||
    last === "endDate" ||
    last === "completionDate" ||
    last === "issueDate" ||
    last === "expirationDate" ||
    last === "publicationDate" ||
    last === "date" ||
    schemaPath.includes("ProfileDate")
  ) {
    return `La fecha de ${displayPath(path)} debe usar AAAA, AAAA-MM o AAAA-MM-DD.`;
  }

  return `El campo ${displayPath(path)} no tiene el formato esperado.`;
}

function uniqueItemsMessage(path: string): string {
  return `Los valores de ${displayPath(path)} no pueden repetirse.`;
}

function anyOfMessage(path: string): string {
  const last = lastSegment(path);

  if (last === "endDate" || last === "expirationDate") {
    return `El campo ${displayPath(path)} debe ser una fecha (AAAA, AAAA-MM o AAAA-MM-DD) o quedar vacío.`;
  }

  return `El campo ${displayPath(path)} no coincide con el formato esperado.`;
}

function missingProperty(error: ErrorObject): string | undefined {
  return stringParam(error, "missingProperty");
}

function stringParam(error: ErrorObject, key: string): string | undefined {
  const value = error.params[key];
  return typeof value === "string" ? value : undefined;
}

function formatPath(instancePath: string, extra?: string): string {
  const segments = instancePath
    .split("/")
    .filter(Boolean)
    .map(decodePointerSegment);

  if (extra) {
    segments.push(extra);
  }

  if (segments.length === 0) {
    return "root";
  }

  return segments.join(".");
}

function decodePointerSegment(segment: string): string {
  return segment.replace(/~1/g, "/").replace(/~0/g, "~");
}

function lastSegment(path: string): string {
  const parts = path.split(".");
  return parts[parts.length - 1] ?? path;
}

function displayPath(path: string): string {
  return path === "root" ? "raíz del documento" : `«${path}»`;
}
