#!/usr/bin/env bash
# Pin UiAutomator2 4.2.9. Newer majors require Appium 3 or 4.
# Some environments already have a uiautomator2 driver, which makes a second install fail.
set -euo pipefail

installed="$(npx appium driver list --installed --json)"
version="$(node -e 'const data = JSON.parse(process.argv[1]); process.stdout.write(data.uiautomator2?.version || "");' "$installed")"

if [[ "$version" == "4.2.9" ]]; then
  echo "uiautomator2@4.2.9 is already installed"
  exit 0
fi

if [[ -n "$version" ]]; then
  echo "Replacing uiautomator2@${version} with 4.2.9"
  npx appium driver uninstall uiautomator2
fi

npx appium driver install uiautomator2@4.2.9
