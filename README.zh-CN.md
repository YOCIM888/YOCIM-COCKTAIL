[English](README.md) | [中文](README.zh-CN.md)

# YOCIM · 个人特色调酒单

一份纯排版、无配图的个人调酒单，收录 22 款原创、改良与经典鸡尾酒。

- 线上地址：https://cocktail.yocim.top/
- 中文：https://cocktail.yocim.top/ · English: https://cocktail.yocim.top/en/

## 特色

- 暗色编辑感排版，无插图，仅用字体、渐变与颗粒质感
- 搜索、分类筛选、详情弹窗与完整配方
- 中英双语页面，头部可一键切换
- SEO：`robots.txt`、`sitemap.xml`、canonical 与 hreflang
- GitHub Actions 自动部署到 GitHub Pages

## 目录结构

```text
index.html                 中文酒单
en/index.html              英文酒单
assets/css/style.css       共用样式
assets/js/data.js          中文配方数据
assets/js/data-en.js       英文配方数据
assets/js/app.js           搜索 / 筛选 / 弹窗 / 动效
robots.txt                 搜索引擎抓取规则
sitemap.xml                含 hreflang 的站点地图
CNAME                      自定义域名：cocktail.yocim.top
.nojekyll                  关闭 Jekyll 处理
.github/workflows/         GitHub Pages 部署流程
```

## 本地预览

语言切换链接使用 `/` 与 `/en/`，请在项目根目录用 HTTP 方式预览：

```bash
python -m http.server 8080
```

访问 http://localhost:8080/。

## 修改酒单

中文数据在 `assets/js/data.js`，英文数据在 `assets/js/data-en.js`；两份数据保持相同的 `id` 与 `num`。

## 部署

推送到 `main` 分支后，workflow 会把站点文件复制到 `_site` 并发布到 GitHub Pages。仓库 Settings → Pages 中自定义域名为 `cocktail.yocim.top`，并保持 Enforce HTTPS 开启。

## 声明

非专业酒单，请适量饮酒。未成年人请勿饮酒，饮酒后请勿驾车。
