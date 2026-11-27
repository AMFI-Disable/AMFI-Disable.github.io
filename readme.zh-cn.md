# AMFI-Disable 项目主页

[English](readme.md) · [参与贡献](contributing.zh-cn.md) · [访问网站](https://amfi-disable.github.io/) · [更新日志](changelog.md) · [安全政策](security.md) · [MIT 许可证](license)

这是用 Vite、TypeScript 和 CSS 构建的个人项目目录。按项目名或技术搜索，按分类筛选，或按 `/` 聚焦搜索框。安装命令可以点击复制。网站跟随系统明暗主题，也会保存手动选择的主题。

## 本地开发

在仓库根目录依次执行：

```sh
npm ci
npm run dev
```

运行 `npm run build` 进行类型检查并生成 `dist/`，再用 `npm run preview` 检查生产构建。可分别验证窄屏布局、项目筛选、键盘搜索和安装命令复制。

## 更新内容

在 `src/data/hub.ts` 的 `HUB_CONFIG` 中维护个人简介、项目、技术栈、安装命令和链接。在 `src/main.ts` 中维护页面交互，在 `src/styles/main.css` 中调整主题与布局。网站标题和分享预览位于 `index.html`，图标和站点清单位于 `public/`。

## 部署

仓库的 GitHub Pages 发布源应为 **GitHub Actions**。推送到 `main` 后，`.github/workflows/deploy.yml` 构建站点并发布 `dist/`。检查该次工作流的部署结果后再访问站点。[本仓库星标历史](https://www.star-history.com/?repos=AMFI-Disable%2FAMFI-Disable.github.io&type=date)
