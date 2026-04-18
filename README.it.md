# 🌸 Hiyori Tools 🌸

**Un simpatico strumento per la gestione degli URL e la raccolta di pagine web**

---

🌐 **README in altre lingue:**
[English](README.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md)

---

## 📦 Download

- Download per Edge: https://microsoftedge.microsoft.com/addons/detail/hiyori-tools/ffkpgbobmimcehhcmehkadmkefblaidj
- Download per Chrome: In revisione

---

## 📖 Introduzione

Un'estensione per browser leggera ed efficiente che ti aiuta a gestire gli URL in batch e a raccogliere contenuti web con un clic. Adatta per i preferiti quotidiani, l'archiviazione dei dati e la gestione della conoscenza.

---

## ✨ Funzionalità principali

### 🔗 Gestione URL
- Salva URL in batch, supporta l'apertura di tutte le schede con un clic
- Copia tutti gli URL nella finestra corrente con un clic
- Elenco di esclusione: Salta automaticamente gli URL specificati

### 📥 Raccolta Web
- Salva come screenshot (`.png`)
- Salva come documento (`.md`)
- Salva il sorgente della pagina (`.html`)
- Salva come dati strutturati (`.json`)
- Salva come PDF (richiama la stampa del browser)
- Screenshot dell'intera pagina web (unisce automaticamente le pagine lunghe)
- Sincronizza con Notion (nomi dei campi personalizzabili)

### ⚡ Automazione
- Salvataggio automatico dopo l'apertura di una pagina web, tempo di ritardo personalizzabile

### 🎀 Caratteristiche
- Interfaccia pulita, funzionamento intuitivo
- Esecuzione locale, i dati non vengono caricati
- Supporta l'integrazione dell'API di Notion
- Esclude automaticamente gli URL indesiderati

---

## 🚀 Come si usa

### 1. Installazione

- Download per Edge: https://microsoftedge.microsoft.com/addons/detail/hiyori-tools/ffkpgbobmimcehhcmehkadmkefblaidj
- Download per Chrome: In revisione

Dopo l'installazione, clicca sull'icona del puzzle nella barra degli strumenti del browser e **aggiungi** Hiyori Tools per un accesso rapido.

---

### 2. Gestione URL

#### Salvare e aprire URL in batch
1. Clicca sull'icona di Hiyori Tools per aprire il pannello.
2. Incolla la tua lista di URL nell'area di testo (un URL per riga).
3. Clicca su **"Apri tutto"** — tutti gli URL si aprono immediatamente come nuove schede.

#### Copiare tutti gli URL della finestra corrente
1. Apri il pannello.
2. Clicca su **"Copia tutti gli URL"** — tutti gli URL della finestra corrente vengono copiati negli appunti.

#### Elenco di esclusione
1. Vai su **Impostazioni** → **Elenco di esclusione**.
2. Aggiungi gli URL o i pattern di dominio che vuoi saltare automaticamente.
3. Questi URL verranno ignorati durante le operazioni in batch.

---

### 3. Raccolta Web

Naviga fino alla pagina che vuoi salvare e clicca sull'icona di Hiyori Tools.

| Formato | Come si usa |
|---------|------------|
| 📸 Screenshot (`.png`) | Clicca su **"Salva come screenshot"** — salva l'area visibile |
| 📄 Documento (`.md`) | Clicca su **"Salva come Markdown"** — estrae il contenuto della pagina come file `.md` |
| 🌐 HTML (`.html`) | Clicca su **"Salva come HTML"** — salva il sorgente attuale della pagina come file `.html` |
| 🧩 JSON (`.json`) | Clicca su **"Salva come JSON"** — salva i dati strutturati della pagina come file `.json` |
| 🖨️ PDF | Clicca su **"Salva come PDF"** — apre la finestra di stampa del browser (scegli "Salva come PDF") |
| 📜 Screenshot pagina intera | Clicca su **"Screenshot intera pagina"** — cattura e unisce l'intera pagina scorrevole |
| 🗂️ Sincronizza con Notion | Vedi configurazione Notion qui sotto |

---

### 4. Configurazione dell'integrazione con Notion

1. Vai su [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) e crea una nuova integrazione.
2. Copia il **Token di integrazione interna**.
3. Apri il database Notion di destinazione → clicca su **"..."** → **"Connessioni"** → connetti la tua integrazione.
4. Copia l'**ID del database** dall'URL (la stringa tra l'ultimo `/` e `?`).
5. In Hiyori Tools, vai su **Impostazioni** → **Notion**:
   - Incolla il tuo **Token API**
   - Incolla il tuo **ID database**
   - Personalizza i nomi dei campi secondo necessità
6. Su qualsiasi pagina web, clicca su **"Sincronizza con Notion"** per salvarla nel tuo database.

---

### 5. Automazione

1. Vai su **Impostazioni** → **Automazione**.
2. Attiva **"Salvataggio automatico dopo il caricamento della pagina"**.
3. Imposta il **tempo di ritardo** desiderato (in secondi) — l'estensione aspetterà questo tempo dopo il caricamento di una pagina prima di salvare.

---

## 💡 Casi d'uso

- Apri in batch i siti web seguiti quotidianamente
- Aggiungi ai preferiti articoli, tutorial e pagine di notizie
- Esegui regolarmente il backup di importanti contenuti web
- Sincronizza le pagine web con Notion per organizzarle

---

## 🔒 Privacy

Hiyori Tools funziona **completamente in locale**. Nessun dato viene raccolto, tracciato o caricato su alcun server. La sincronizzazione con Notion comunica esclusivamente con l'API ufficiale di Notion tramite il tuo token personale.

---

*Made with ♡ by sandleft*
