---
layout: holy
title: Interact CLI
---

A command-line interface for running development and build scripts.

## Usage

```bash
# Show help
interact --help

# Generate schema
interact generate-schema

# Create components module
interact create-components

# Print configuration (YAML by default)
interact print-config

# Print configuration with options
interact print-config -- --json
interact print-config -- --filter components
interact print-config -- --filter theme.colors --json
```

## Available Commands

### `generate-schema`
Generates a JSON schema file from the Zod configuration schema. The schema is output to `dist/schemas/interact.schema.json`.

### `create-components`
Creates a virtual components module in `node_modules/@gerardnico/interact-components` with exports for all configured components.

### `print-config`
Prints the interact configuration to the terminal. Outputs as YAML by default with pretty printing (colors and alignment).

**Options:**

- `--filter <key>` or `-f <key>`: Filter configuration by key path (e.g., `components`, `theme.colors`)
  - Supports nested paths with dot notation
  - Returns an error if the key is not found

- `--json` or `-j`: Output as JSON instead of YAML
- `--yaml` or `-y`: Output as YAML (default)

- `--no-pretty` or `--plain`: Disable pretty printing (no colors)
  - Useful for piping output to files or other commands

**Examples:**

```bash
# Print full config as YAML (default)
interact print-config

# Print full config as JSON
interact print-config -- --json

# Print only the components section
interact print-config -- --filter components

# Print nested configuration
interact print-config -- --filter theme.colors --json

# Print without colors (plain output)
interact print-config -- --plain

# Pipe to file
interact print-config -- --json --plain > config.json
```

