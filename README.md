# ResumeSpec-Generators

**One professional identity. Unlimited representations.**

ResumeSpec-Generators es un repositorio independiente de aplicaciones que
consumen el estándar abierto [ResumeSpec](https://github.com/4k4m1m3-org/ResumeSpec)
para producir representaciones de una identidad profesional.

El estándar define la información. Este proyecto define la presentación.

> El generador depende del estándar. El estándar **no** depende del generador.

Sitio canónico de ResumeSpec: https://resumespec.wuilmerbolivar.lat/

## Productos

| Producto | Estado |
| --- | --- |
| PDF Generator | En construcción (prioridad v1) |
| Portfolio Generator | Previsto. No forma parte de v1. |

v1 del PDF Generator es una aplicación web en español que permite:

1. Cargar un documento ResumeSpec JSON.
2. Validarlo con el JSON Schema oficial v1.0.0.
3. Ver una vista previa del PDF real.
4. Descargar el CV.

Todo ocurre **en el navegador**. El documento del usuario no se envía a
nuestros servidores. No hay cuentas, backend de procesamiento, analytics
ni almacenamiento local en v1.

## Requisitos de v1

- Input: ResumeSpec JSON (únicamente).
- Schema: copia pinneada de ResumeSpec **v1.0.0** (ver `vendor/resumespec/v1.0.0/`).
- Validación: Ajv (JSON Schema Draft 2020-12) + `ajv-formats`.
- PDF: `@react-pdf/renderer`, una plantilla profesional de una columna.
- UI: español. Código interno: inglés.

## Estructura

```
ResumeSpec-Generators/
├── apps/                      # aplicaciones web (pdf-web en fases posteriores)
├── packages/
│   └── core/                  # parseo, validación, tipos, errores en español
├── vendor/resumespec/v1.0.0/  # schema y ejemplos oficiales pinneados
└── .github/workflows/         # CI
```

`packages/core` no depende de React ni de PDF. Las representaciones
(PDF, portfolio) consumen un modelo de presentación derivado del
documento validado. Ese modelo se introduce en la Fase 2.

## Desarrollo

Requiere Node.js 22 o superior.

```bash
npm install
npm test
npm run build
npm run lint
```

Regenerar tipos TypeScript desde el schema vendored:

```bash
npm run generate:types
```

## Schema

La aplicación **no** descarga el schema desde GitHub ni desde
`resumespec.org` durante el uso normal. El contrato v1.0.0 está
vendored y versionado en este repositorio.

Detalles del pin: [`vendor/resumespec/v1.0.0/SOURCE.md`](vendor/resumespec/v1.0.0/SOURCE.md)

## Relación con ResumeSpec

ResumeSpec v1.0.0 está cerrado. Este repositorio no modifica el estándar.
Si un caso de presentación parece requerir un campo nuevo, se documenta
aquí; no se parchea ResumeSpec.

## Licencia

Apache License 2.0. Ver `LICENSE` y `NOTICE`.

Based on the ResumeSpec open standard.
