# 🌸 Hiyori Tools 🌸

**可爱的网址管理和网页收割工具**

---

🌐 **其他语言的 README：**
[English](README.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [繁體中文](README.zh-TW.md)

---

## 📦 下载地址

- Edge 浏览器下载地址：https://microsoftedge.microsoft.com/addons/detail/hiyori-tools/ffkpgbobmimcehhcmehkadmkefblaidj
- Chrome 下载地址：正在审核中

---

## 📖 简介

一款轻量高效的浏览器扩展，帮助你批量管理网址、一键收割网页内容。适合日常收藏、资料归档、知识管理等场景。

---

## ✨ 主要功能

### 🔗 网址管理
- 批量保存网址，支持一键打开所有标签页
- 一键复制当前窗口所有网址
- 排除列表：自动跳过指定网址

### 📥 网页收割
- 截图保存（`.png`）
- 文档保存（`.md`）
- 网页源文件保存（`.html`）
- 结构数据保存（`.json`）
- PDF 保存（调用浏览器打印）
- 整张网页截图（长页面自动拼接）
- 同步到 Notion（可自定义字段名）

### ⚡ 自动化
- 打开网页后自动保存，可设置延迟时间

### 🎀 特点
- 界面简洁，操作直观
- 本地运行，数据不上传
- 支持 Notion API 集成
- 自动排除不想要的网址

---

## 🚀 使用教程

### 1. 安装

- Edge 浏览器下载地址：https://microsoftedge.microsoft.com/addons/detail/hiyori-tools/ffkpgbobmimcehhcmehkadmkefblaidj
- Chrome 下载地址：正在审核中

安装后，点击浏览器工具栏的拼图图标，将 Hiyori Tools **固定**到工具栏，方便随时访问。

---

### 2. 网址管理

#### 批量保存与打开网址
1. 点击 Hiyori Tools 图标打开面板。
2. 在文本区域粘贴网址列表（每行一个网址）。
3. 点击 **「全部打开」** — 所有网址立即在新标签页中打开。

#### 一键复制当前窗口所有网址
1. 打开面板。
2. 点击 **「复制全部网址」** — 当前窗口的所有网址会复制到剪贴板。

#### 排除列表
1. 前往 **设置** → **排除列表**。
2. 添加你想自动跳过的网址或域名规则。
3. 批量操作时，这些网址将被忽略。

---

### 3. 网页收割

打开你想保存的页面，点击 Hiyori Tools 图标。

| 格式 | 操作方式 |
|------|---------|
| 📸 截图（`.png`） | 点击 **「截图保存」** — 保存当前可见区域的截图 |
| 📄 文档（`.md`） | 点击 **「Markdown 保存」** — 将页面内容提取为 `.md` 文件 |
| 🌐 HTML（`.html`） | 点击 **「HTML 保存」** — 将当前页面源文件保存为 `.html` 文件 |
| 🧩 JSON（`.json`） | 点击 **「JSON 保存」** — 将当前页面结构数据保存为 `.json` 文件 |
| 🖨️ PDF | 点击 **「PDF 保存」** — 打开浏览器打印对话框（选择「另存为 PDF」） |
| 📜 整页截图 | 点击 **「整页截图」** — 捕获并自动拼接整个可滚动页面 |
| 🗂️ 同步到 Notion | 见下方 Notion 配置说明 |

---

### 4. Notion 集成配置

1. 前往 [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) 创建新的集成。
2. 复制 **内部集成令牌（Token）**。
3. 打开目标 Notion 数据库 → 点击 **「...」** → **「连接」** → 连接你的集成。
4. 从数据库 URL（最后一个 `/` 和 `?` 之间的字符串）复制 **数据库 ID**。
5. 在 Hiyori Tools 中，前往 **设置** → **Notion**：
   - 粘贴 **API Token**
   - 粘贴 **数据库 ID**
   - 按需自定义字段名称
6. 在任意网页上，点击 **「同步到 Notion」** 即可保存到你的数据库。

---

### 5. 自动化

1. 前往 **设置** → **自动化**。
2. 开启 **「页面加载后自动保存」**。
3. 设置 **延迟时间**（秒）— 页面加载后等待指定秒数再自动保存。

---

## 💡 使用场景

- 批量打开每日关注的网站
- 收藏文章、教程、资讯页面
- 定期备份重要网页内容
- 将网页同步到 Notion 进行整理

---

## 🔒 隐私说明

Hiyori Tools **完全在本地运行**。不会收集、追踪或上传任何数据到任何服务器。Notion 同步功能仅使用你自己的 Token，直接与 Notion 官方 API 通信。

---

*Made with ♡ by sandleft*

---

## 鸣谢

感谢 [LINUX DO](https://linux.do) 社区的支持与推广。
