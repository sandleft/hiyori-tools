# 🌸 Hiyori Tools 🌸

**Ein niedliches Tool zur URL-Verwaltung und zum Sammeln von Webseiten**

---

🌐 **README in anderen Sprachen:**
[English](README.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md)

---

## 📦 Download

- Edge-Download: https://microsoftedge.microsoft.com/addons/detail/hiyori-tools/ffkpgbobmimcehhcmehkadmkefblaidj
- Chrome-Download: In Überprüfung

---

## 📖 Einführung

Eine leichte und effiziente Browser-Erweiterung, die Ihnen hilft, URLs stapelweise zu verwalten und Web-Inhalte mit einem Klick zu sammeln. Geeignet für tägliche Lesezeichen, Datenarchivierung und Wissensmanagement.

---

## ✨ Hauptfunktionen

### 🔗 URL-Verwaltung
- URLs stapelweise speichern, alle Tabs mit einem Klick öffnen
- Alle URLs im aktuellen Fenster mit einem Klick kopieren
- Ausschlussliste: Bestimmte URLs automatisch überspringen

### 📥 Web-Sammlung
- Als Screenshot speichern (`.png`)
- Als Dokument speichern (`.md`)
- Als Seitenquelltext speichern (`.html`)
- Als strukturierte Daten speichern (`.json`)
- Als PDF speichern (ruft Browser-Druck auf)
- Vollständiger Webseiten-Screenshot (lange Seiten werden automatisch zusammengefügt)
- Mit Notion synchronisieren (anpassbare Feldnamen)

### ⚡ Automatisierung
- Automatisches Speichern nach dem Öffnen der Webseite, Verzögerungszeit einstellbar

### 🎀 Eigenschaften
- Saubere Benutzeroberfläche, intuitive Bedienung
- Läuft lokal, keine Daten-Uploads
- Unterstützt Notion-API-Integration
- Unerwünschte URLs automatisch ausschließen

---

## 🚀 Verwendung

### 1. Installation

- Edge-Download: https://microsoftedge.microsoft.com/addons/detail/hiyori-tools/ffkpgbobmimcehhcmehkadmkefblaidj
- Chrome-Download: In Überprüfung

Nach der Installation klicken Sie auf das Puzzle-Symbol in der Browser-Symbolleiste und **heften** Sie Hiyori Tools für schnellen Zugriff an.

---

### 2. URL-Verwaltung

#### URLs stapelweise speichern und öffnen
1. Klicken Sie auf das Hiyori Tools-Symbol, um das Panel zu öffnen.
2. Fügen Sie Ihre URL-Liste in das Textfeld ein (eine URL pro Zeile).
3. Klicken Sie auf **„Alle öffnen"** — alle URLs öffnen sich sofort als neue Tabs.

#### Alle URLs des aktuellen Fensters kopieren
1. Öffnen Sie das Panel.
2. Klicken Sie auf **„Alle URLs kopieren"** — alle URLs Ihres aktuellen Fensters werden in die Zwischenablage kopiert.

#### Ausschlussliste
1. Gehen Sie zu **Einstellungen** → **Ausschlussliste**.
2. Fügen Sie URLs oder Domain-Muster hinzu, die automatisch übersprungen werden sollen.
3. Diese URLs werden bei Stapeloperationen ignoriert.

---

### 3. Web-Sammlung

Navigieren Sie zu der Seite, die Sie speichern möchten, und klicken Sie auf das Hiyori Tools-Symbol.

| Format | Verwendung |
|--------|-----------|
| 📸 Screenshot (`.png`) | **„Als Screenshot speichern"** klicken — speichert den sichtbaren Bereich |
| 📄 Dokument (`.md`) | **„Als Markdown speichern"** klicken — extrahiert Seiteninhalt als `.md`-Datei |
| 🌐 HTML (`.html`) | **„Als HTML speichern"** klicken — speichert den aktuellen Seitenquelltext als `.html`-Datei |
| 🧩 JSON (`.json`) | **„Als JSON speichern"** klicken — speichert strukturierte Seitendaten als `.json`-Datei |
| 🖨️ PDF | **„Als PDF speichern"** klicken — öffnet den Browser-Druckdialog (wählen Sie „Als PDF speichern") |
| 📜 Vollseiten-Screenshot | **„Vollseiten-Screenshot"** klicken — erfasst und fügt die gesamte scrollbare Seite zusammen |
| 🗂️ Mit Notion synchronisieren | Siehe Notion-Einrichtung unten |

---

### 4. Notion-Integration einrichten

1. Gehen Sie zu [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) und erstellen Sie eine neue Integration.
2. Kopieren Sie das **Interne Integrations-Token**.
3. Öffnen Sie Ihre Notion-Zieldatenbank → klicken Sie auf **„..."** → **„Verbindungen"** → verbinden Sie Ihre Integration.
4. Kopieren Sie die **Datenbank-ID** aus der Datenbank-URL (die Zeichenfolge zwischen dem letzten `/` und `?`).
5. Gehen Sie in Hiyori Tools zu **Einstellungen** → **Notion**:
   - **API-Token** einfügen
   - **Datenbank-ID** einfügen
   - Feldnamen nach Bedarf anpassen
6. Klicken Sie auf einer beliebigen Webseite auf **„Mit Notion synchronisieren"**, um die Seite in Ihrer Datenbank zu speichern.

---

### 5. Automatisierung

1. Gehen Sie zu **Einstellungen** → **Automatisierung**.
2. Aktivieren Sie **„Nach dem Laden der Seite automatisch speichern"**.
3. Stellen Sie die gewünschte **Verzögerungszeit** (in Sekunden) ein — die Erweiterung wartet so lange nach dem Laden einer Seite, bevor sie speichert.

---

## 💡 Anwendungsfälle

- Täglich verfolgte Websites stapelweise öffnen
- Artikel, Tutorials und Nachrichtenseiten als Lesezeichen speichern
- Wichtige Web-Inhalte regelmäßig sichern
- Webseiten zur Organisation mit Notion synchronisieren

---

## 🔒 Datenschutz

Hiyori Tools läuft **vollständig lokal**. Es werden keine Daten gesammelt, verfolgt oder auf einen Server hochgeladen. Die Notion-Synchronisierung kommuniziert ausschließlich direkt mit der offiziellen Notion-API über Ihr eigenes Token.

---

*Made with ♡ by sandleft*
