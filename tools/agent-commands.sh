#!/usr/bin/env bash
# 在下面四个函数中填入你的项目命令；入口未配置时应保持失败。
# 本文件由 tools/agent.sh 加载，继承 set -euo pipefail。
# 在一个函数中分行放置多个命令，前一步失败就停止。
# 固定工具链/包管理器版本，使用项目锁文件，不用安装过程的临时 export 连接阶段。

agent_not_configured() {
  printf 'NOT CONFIGURED: implement %s in tools/agent-commands.sh\n' "$1" >&2
  return 2
}

agent_setup() {
  # 指定工具链可用性、锁定依赖安装、代码生成；需可重复执行。
  agent_not_configured setup
}

agent_start() {
  # 前台应用启动命令；CI smoke 不依赖此进程事先存在。
  agent_not_configured start
}

agent_checks() {
  # 分行填写静态检查、相关测试、构建命令。不要吞掉非零退出。
  agent_not_configured checks
}

agent_smoke() {
  # 自带断言的核心流程；在 CI 中启动/连接测试服务并收尾。
  agent_not_configured smoke
}
