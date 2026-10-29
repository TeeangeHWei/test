---
name: test-team-workflow
description: 在 TeeangeHWei/test 项目中按 PM、Lead、Dev、QA、Ops 的职责处理需求、修复和新功能，交付可审查 PR；用于明确要求团队协作的项目任务。
---

本技能限定于 https://github.com/TeeangeHWei/test。Dot 协调 PM/Lead，按实际任务建立 Dev、QA、Ops 的独立执行上下文；能力不可用时报告具体缺口。

PM 先产出目标用户/问题、范围/非目标、优先级、边界条件及可观察的 AC1…ACn。缺陷先记录复现条件、预期与实际。Lead 据此确认真实基线、任务依赖和单一写入者；不自行扩展业务范围。

Dev 实现，QA 在分离会话验证与审查且不提交/推送实现，Ops 核对环境和 CI。环境/CI 的修改须单独分配写入者，避免与 Dev 冲突。不得与 Grok 团队同时写同一分支。

每次交接传入角色、仓库、目标/非目标、AC、base/head SHA、分支/PR、写入范围、验证命令、权限和证据要求。子任务不自动继承协调者的全部上下文。

先读取任务分支 AGENTS.md 和 tools/agent-commands.sh。工作流初次接入时，PR #1 可能仍未合并，不能假定 master 已具备测试入口；刷新其状态并显式指定验证版本。不得接管或改写 Grok 的 PR #1。

当前约定：Node v22.23.4；setup/checks/smoke 入口为 bash tools/agent.sh 加对应参数。start 退出码 3 是本任务 N/A；组件 smoke 不代表 iOS E2E。完整 iOS 测试需要 macOS/Xcode/模拟器/被测 App。

只在用户授权任务分支提交 PR。禁止合并、自动合并、直接推默认分支、部署和发布。配置完成后等待用户任务，不主动派生业务开发或定时监控。

Lead 记录任务 owner、会话链接、基线、分支、PR、最新 head、AC/测试/审查状态与阻塞原因。新推送后检查旧证据的适用性。P0/P1 阻断，P2 修复或由用户接受，P3 建议。最终交给用户人工审阅。
