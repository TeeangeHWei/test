---
name: verify-change
description: 验证 TeeangeHWei/test 当前变更，运行检查与组件核心流程，返回绑定提交的证据、验收结果和未验证项。
---

读取 AGENTS.md、需求/AC、当前 diff 和 tools/agent-commands.sh。确认仓库、base/head SHA 与工作树，说明验证的是提交还是含未提交改动的状态。

使用 Node v22.23.4，分别执行 bash tools/agent.sh setup、checks、smoke，并保留真实输出与退出码。本任务 start 退出 3 为 N/A；smoke 使用 stub driver/element，不是完整 iOS E2E。缺少 macOS/Xcode/模拟器/App 时，iOS E2E 标记未执行。

逐条核对 AC：UI 观察关键交互和最终状态；API/CLI 使用断言与脱敏结果；缺陷确认原复现和相关回归均被覆盖。按变更影响选择相称验证，说明省略的行为测试及原因。

证据记录时间、环境、所测 SHA、命令、结果与可访问产物。新推送后重新判断覆盖范围；CI 测合并提交时记录该 commit 与 PR head/base 的关系。

区分通过、失败、不适用和未验证。入口缺失、未运行、无断言、跳过或非零退出不能作为通过；start 的已约定 N/A 单列。不把历史 CI、其他会话的声明或本地测试冒充 Dot 调用成功。

QA 不修改、提交或推送受版本控制的实现，发现交回 Dev。仅引用实际获得的链接，本地证据尚未共享时明确说明。只提 PR、不合并、不部署。
