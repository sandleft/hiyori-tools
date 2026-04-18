# 🌸 Hiyori Tools 🌸

**A cute URL management and web page harvesting tool**

---

🌐 **README in other languages:**
[日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md)

---

## 📦 Download

- Microsoft Edge Add-ons: https://microsoftedge.microsoft.com/addons/detail/hiyori-tools/ffkpgbobmimcehhcmehkadmkefblaidj
- Chrome Web Store: Under review

---

## 📖 Introduction

A lightweight and efficient browser extension helping you batch manage URLs and harvest web content with one click. Suitable for daily bookmarking, data archiving, and knowledge management.

---

## ✨ Main Features

### 🔗 URL Management
- Batch save URLs, support opening all tabs with one click
- Copy all URLs in the current window with one click
- Exclusion list: Automatically skip specified URLs

### 📥 Web Harvesting
- Save as screenshot (`.png`)
- Save as document (`.md`)
- Save as HTML page source (`.html`)
- Save as structured data (`.json`)
- Save as PDF (calls browser print)
- Full webpage screenshot (auto-stitches long pages)
- Sync to Notion (customizable field names)

### ⚡ Automation
- Auto-save after opening a webpage, customizable delay time

### 🎀 Highlights
- Clean interface, intuitive operation
- Runs locally, data is not uploaded
- Supports Notion API integration
- Automatically excludes unwanted URLs

---

## 🚀 How to Use

### 1. Installation

- Microsoft Edge Add-ons: https://microsoftedge.microsoft.com/addons/detail/hiyori-tools/ffkpgbobmimcehhcmehkadmkefblaidj
- Chrome Web Store: Under review

After installation, click the puzzle icon in your browser toolbar and **pin** Hiyori Tools for quick access.

---

### 2. URL Management

#### Save & Open URLs in Batch
1. Click the Hiyori Tools icon to open the panel.
2. Paste your URL list into the text area (one URL per line).
3. Click **"Open All"** — all URLs will open as new tabs at once.

#### Copy All URLs from Current Window
1. Open the panel.
2. Click **"Copy All URLs"** — all URLs from your current window are copied to the clipboard.

#### Exclusion List
1. Go to **Settings** → **Exclusion List**.
2. Add URLs or domain patterns you want to automatically skip.
3. These URLs will be ignored during batch operations.

---

### 3. Web Harvesting

Navigate to the page you want to save, then click the Hiyori Tools icon.

| Format | How to Use |
|--------|-----------|
| 📸 Screenshot (`.png`) | Click **"Save as Screenshot"** — saves a visible-area screenshot |
| 📄 Document (`.md`) | Click **"Save as Markdown"** — extracts page content as a `.md` file |
| 🌐 HTML (`.html`) | Click **"Save as HTML"** — saves the current page source as a `.html` file |
| 🧩 JSON (`.json`) | Click **"Save as JSON"** — saves structured page data as a `.json` file |
| 🖨️ PDF | Click **"Save as PDF"** — opens browser print dialog (choose "Save as PDF") |
| 📜 Full Page Screenshot | Click **"Full Page Screenshot"** — captures and stitches the entire scrollable page |
| 🗂️ Sync to Notion | See Notion Setup below |

---

### 4. Notion Integration Setup

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) and create a new integration.
2. Copy the **Internal Integration Token**.
3. Open your target Notion database → click **"..."** → **"Connections"** → connect your integration.
4. Copy the **Database ID** from the database URL (the string between the last `/` and `?`).
5. In Hiyori Tools, go to **Settings** → **Notion**:
   - Paste your **API Token**
   - Paste your **Database ID**
   - Customize field names as needed
6. On any webpage, click **"Sync to Notion"** to save the page to your database.

---

### 5. Automation

1. Go to **Settings** → **Automation**.
2. Toggle **"Auto-save after page load"** on.
3. Set your preferred **delay time** (in seconds) — the extension will wait this long after a page loads before saving.

---

## 💡 Use Cases

- Batch open daily followed websites
- Bookmark articles, tutorials, and news pages
- Regularly backup important web content
- Sync webpages to Notion for organization

---

## 🔒 Privacy

Hiyori Tools runs **entirely locally**. No data is collected, tracked, or uploaded to any server. Notion sync only communicates directly with Notion's official API using your own token.

---

*Made with ♡ by sandleft*
