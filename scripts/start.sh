#!/bin/sh
# Container start: log Kane CLI in from environment variables, seed the demo cases, serve.
set -e
mkdir -p "$CASES_DIR"
for c in seed/cases/*; do [ -d "$CASES_DIR/$(basename "$c")" ] || cp -r "$c" "$CASES_DIR/"; done
kane-cli login --username "$LT_USERNAME" --access-key "$LT_ACCESS_KEY" --project-id "$KANE_PROJECT_ID" --folder-id "$KANE_FOLDER_ID" >/dev/null 2>&1 || echo "kane-cli login failed"
kane-cli whoami 2>&1 | head -1 || true
exec node server.mjs
