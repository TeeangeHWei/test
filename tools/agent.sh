#!/usr/bin/env bash
set -euo pipefail

workflow_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$workflow_root"
source tools/agent-commands.sh

if [ "$#" -ne 1 ]; then
  printf 'Usage: bash tools/agent.sh {setup|start|checks|smoke}\n' >&2
  exit 2
fi

case "$1" in
  setup) agent_setup ;;
  start) agent_start ;;
  checks) agent_checks ;;
  smoke) agent_smoke ;;
  *)
    printf 'Unknown phase: %s\n' "$1" >&2
    exit 2
    ;;
esac
