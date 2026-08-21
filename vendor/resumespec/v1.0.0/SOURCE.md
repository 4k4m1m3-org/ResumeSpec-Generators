# ResumeSpec v1.0.0 pin

This directory is a **pinned copy** of the official ResumeSpec v1.0.0
machine-readable contract and JSON examples.

ResumeSpec-Generators does not define the standard. It consumes it.

## Origin

| Field | Value |
| --- | --- |
| Project | [ResumeSpec](https://github.com/4k4m1m3-org/ResumeSpec) |
| Canonical site | https://resumespec.wuilmerbolivar.lat/ |
| Git tag | `v1.0.0` |
| Git commit | `64d20fa8a5f340b1dde980601621656971375d2d` |
| Release | https://github.com/4k4m1m3-org/ResumeSpec/releases/tag/v1.0.0 |
| Schema path in ResumeSpec | `schemas/json/resumespec.schema.json` |
| Schema `$id` | `https://resumespec.org/schemas/json/v1.0.0/resumespec.schema.json` |
| Schema `$schema` | `https://json-schema.org/draft/2020-12/schema` |
| License (schema + examples) | Apache License 2.0 |

The schema `$id` is the logical identity of the v1.0.0 contract. It is
**not** fetched at runtime. `resumespec.org` is not used as a network
dependency.

## What is vendored

- `resumespec.schema.json` — official JSON Schema Draft 2020-12 contract
- `examples/json/` — official JSON examples from the `v1.0.0` tag:
  - `minimal.json`
  - `developer.json`
  - `student.json`
  - `cybersecurity.json`
  - `it-operations.json`
  - `edge-extension.json`
  - `invalid-unknown-field.json` (intentionally invalid)

## Runtime copy

`packages/core` embeds an identical copy of the schema at:

`packages/core/src/schema/resumespec.schema.json`

Tests assert that the vendor file and the package copy are byte-identical.

## Update policy

This pin is **ResumeSpec v1.0.0 only**.

Do not silently replace this schema with a later ResumeSpec version.
A future generator that supports 1.1+ must add a new directory
(`vendor/resumespec/v1.1.0/`) and an explicit compatibility decision.

## How this copy was produced

```bash
git -C /path/to/ResumeSpec show v1.0.0:schemas/json/resumespec.schema.json
git -C /path/to/ResumeSpec show v1.0.0:examples/json/<name>.json
```
