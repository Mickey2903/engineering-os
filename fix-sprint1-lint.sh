#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f "package.json" || ! -f "main.ts" ]]; then
  echo "Fout: voer dit script uit in de root van plc-engineering-tools."
  exit 1
fi

cat > eslint.config.js <<'EOF'
import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "main.js",
      "node_modules/**",
      "coverage/**",
      "esbuild.config.mjs",
      "eslint.config.js"
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-confusing-void-expression": "off"
    }
  },
  prettier
);
EOF

python3 - <<'PY'
from pathlib import Path

path = Path("main.ts")
text = path.read_text()
text = text.replace(
    "  public override async onload(): Promise<void> {",
    "  public override onload(): void {",
)
text = text.replace(
    "new Notice(`Engineering index contains ${count} Markdown documents.`);",
    "new Notice(`Engineering index contains ${String(count)} Markdown documents.`);",
)
path.write_text(text)

path = Path("src/core/ServiceContainer.ts")
text = path.read_text()
text = text.replace(
    'export const createServiceToken = <T>(description: string): ServiceToken<T> =>\n'
    '  Symbol(description) as ServiceToken<T>;',
    'export const createServiceToken = <T>(description: string): ServiceToken<T> =>\n'
    '  Symbol(description);',
)
path.write_text(text)

path = Path("src/parser/MetadataParser.ts")
text = path.read_text()
text = text.replace('frontmatter["id"]', "frontmatter.id")
text = text.replace('frontmatter["title"]', "frontmatter.title")
text = text.replace('frontmatter["status"]', "frontmatter.status")
text = text.replace('frontmatter["type"]', "frontmatter.type")
path.write_text(text)
PY

npm run format
npm run check

echo
echo "Alle gemelde ESLint-fouten zijn aangepast."
