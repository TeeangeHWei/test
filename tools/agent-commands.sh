#!/usr/bin/env bash
# 本文件由 tools/agent.sh 加载，继承 set -euo pipefail。
# 在一个函数中分行放置多个命令，前一步失败就停止。
# 固定工具链/包管理器版本，使用项目锁文件，不用安装过程的临时 export 连接阶段。

agent_setup() {
  # 指定工具链可用性、锁定依赖安装、代码生成；需可重复执行。
  echo '[setup] Verifying Node.js toolchain (requires Node 22.23.4 exactly for CI parity)...'
  if ! command -v node >/dev/null 2>&1; then
    echo '[setup] ERROR: Node.js is not installed or not on PATH.' >&2
    return 1
  fi
  NODE_VERSION="$(node -v)"
  echo "[setup] Detected ${NODE_VERSION}"
  if [ "${NODE_VERSION}" != "v22.23.4" ]; then
    echo "[setup] ERROR: Node must be v22.23.4 for this workflow. Detected ${NODE_VERSION}." >&2
    return 1
  fi
  echo '[setup] Nothing to install for this task (no Appium/iOS env required).'
  echo '[setup] Done.'
}

agent_start() {
  # 前台应用启动命令；CI smoke 不依赖此进程事先存在。
  echo '[start] No long-running app for this repository task.'
  echo '[start] iOS E2E requires macOS/Xcode and real app build; not applicable in CI.'
  echo '[start] Exiting with code 3 to indicate N/A.'
  return 3
}

agent_checks() {
  # 分行填写静态检查、相关测试、构建命令。不要吞掉非零退出。
  echo '[checks] Static checks'
  # 极简静态检查：核心文件存在且可加载
  test -f commons/Gestures.js
  node -e "require('./commons/Gestures.js')"
  echo '[checks] Node test: regression tests'
  # 运行 node:test（需要 Node >=20）
  if [ -d tests ]; then
    node --test tests/**/*.test.js
  else
    echo '[checks] No tests directory found' >&2
    return 1
  fi
}

agent_smoke() {
  # 自带断言的核心流程；在 CI 中启动/连接测试服务并收尾。
  echo '[smoke] Component-level Gestures verification (stubbed driver/element).'
  node scripts/gestures-smoke.js
}
