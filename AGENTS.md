# Repository engineering workflow

将本文件内容合并进已有 AGENTS.md；以真实项目约定和用户当前任务为准。

## Environment contract

测试入口统一保存在 tools/agent-commands.sh：
- bash tools/agent.sh setup：安装指定工具链/锁定依赖；可重复执行。
- bash tools/agent.sh start：在前台启动测试应用；在独立终端保持运行。
- bash tools/agent.sh checks：静态检查、自动测试和构建。
- bash tools/agent.sh smoke：一条自带断言的核心流程；CI 中自行管理依赖服务和收尾。

四个入口默认尚未配置，退出 2。先明确实际命令；不要用 echo、true 或空函数代替真实验证。
setup 不能依赖仅在当前 shell 中生效的临时 export。start 的应用进程不放进 Cloud Build install。
Cloud 与 CI 的工具链版本和测试配置需一致，凭据通过各自环境显式提供。

项目维护者需补充的环境信息：
- 工具链与包管理器版本、安装来源。
- 应用测试地址、端口及就绪条件。
- 测试账号所需的环境变量名与测试数据准备/重置方法。
- 无法在当前环境运行的部分及所需执行环境。

## Skills

提交到仓库的 .cursor/skills/ 包含：
- implement-change：实现明确任务。
- verify-change：执行验证，返回当前版本的证据。
- review-change：在新的会话审查当前 PR，不修改实现。

## Delivery contract

在授权任务分支工作；保留现有改动和项目惯例。
不要为消除失败而跳过断言、删除测试、修改 CI/审查门禁或隐藏发现。
如果任务本身就是修改这些配置，按用户明确范围处理并说明影响。

行为变更补充有意义的回归验证；纯文案等变更选择相称验证，不为凑数量新增测试。
提交 PR 时说明需求、变更、测试命令与结果、提交 SHA、证据链接和未验证项。
UI 任务展示关键交互和最终状态；API 任务展示断言和脱敏结果。
本地证据路径尚未共享时要说明，不能伪装为别人可访问的链接。

CI 默认可能测试 PR 的合并提交；记录 CI 对应的 commit/run，区分它与开发分支提交。
每次推送之后，重新核对现有验证/审查是否仍适用于当前 PR，不能复用失效结论。

未配置、无法运行、无断言、证据缺失均不等于通过。
审查通过后交由人最终合并；本文件不授予绕过远程分支保护的权限。
