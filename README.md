# Test repository (WDIO/Appium iOS legacy)

This repo contains legacy WDIO/Appium iOS automation scaffolding. Cloud/CI does not provide macOS/Xcode or the target app, so iOS E2E is not runnable here. We verify component-level behavior with Node's built-in test runner.

## Node version
- CI: Node 22.23.4 (actions/setup-node@v4)
- Local: Node v22.23.4

## Entrypoints
Use the agent commands to setup, run checks, and smoke:

```bash
bash tools/agent.sh setup   # verify Node toolchain (== v22.23.4)
bash tools/agent.sh checks  # static checks + node:test regression
bash tools/agent.sh smoke   # component-level Gestures smoke (stubbed driver/element)
# start is not applicable for this task; it exits with code 3
```

## Scope
- Keep existing WDIO/Appium code and locks. Do not install/upgrade historical Appium stacks in CI.
- Component tests use stubs and validate real call flows, not iOS devices/simulators.