# @resumespec-generators/core

Parseo y validación de documentos ResumeSpec v1.0.0.

Este paquete es independiente de React y de la generación PDF. Puede
usarse en el navegador o en Node.js.

## API

- `parseJson(text)` — parsea JSON. No valida contra el schema.
- `validateResume(data)` — valida contra el JSON Schema oficial v1.0.0.
- `mapAjvErrors(errors)` — convierte errores Ajv en mensajes en español
  con detalle técnico.

El schema usado es la copia pinneada en
`vendor/resumespec/v1.0.0/resumespec.schema.json`.
