# 发布流程

本文档描述当前项目的打包与 npm 发布步骤，基于 `package.json` 的配置。

## 前置条件

- 已注册并登录 npm 账号：`npm login`
- 本地 Node.js 与 npm 可用
- 工作区代码是你准备发布的版本

## 打包步骤

1. 安装依赖（只需首次或依赖变更时）：
   - `npm install`
2. 执行构建：
   - `npm run build`

构建后将生成以下产物：

- `build/index.es.js`
- `build/index.d.ts`

## 发布步骤

1. 确认版本号（`package.json` 的 `version`）
2. 执行发布：
   - `npm publish --access public`

说明：

- 执行 `npm publish` 时，会自动触发 `prepublishOnly`：
  - 自动构建
  - 校验发布产物是否存在
- 若脚本失败，发布会被中止

## 版本号更新（可选）

- 小修补：`npm version patch`
- 小功能：`npm version minor`
- 大版本：`npm version major`

这些命令会修改 `package.json` 并创建 git tag（如果你在 git 仓库内）。
