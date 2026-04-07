# 🌸 Hiyori Tools 🌸

**Una linda herramienta para la gestión de URLs y recolección de páginas web**

---

🌐 **README en otros idiomas:**
[English](README.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md)

---

## 📖 Introducción

Una extensión de navegador ligera y eficiente que te ayuda a administrar URLs por lotes y recolectar contenido web con un solo clic. Adecuada para marcadores diarios, archivo de datos y gestión del conocimiento.

---

## ✨ Características principales

### 🔗 Gestión de URLs
- Guardar URLs por lotes, permite abrir todas las pestañas con un clic
- Copiar todas las URLs en la ventana actual con un clic
- Lista de exclusión: Omitir automáticamente las URLs especificadas

### 📥 Recolección Web
- Guardar como captura de pantalla (`.png`)
- Guardar como documento (`.md`)
- Guardar como PDF (llama a la impresión del navegador)
- Captura de pantalla de página completa (une páginas largas automáticamente)
- Sincronizar con Notion (nombres de campos personalizables)

### ⚡ Automatización
- Guardado automático tras abrir una página web, tiempo de retraso configurable

### 🎀 Características
- Interfaz limpia, funcionamiento intuitivo
- Se ejecuta localmente, no se suben datos
- Soporta integración con la API de Notion
- Excluye automáticamente URLs no deseadas

---

## 🚀 Cómo usar

### 1. Instalación

Instala **Hiyori Tools** desde la [Chrome Web Store](https://chromewebstore.google.com) o los [complementos de Microsoft Edge](https://microsoftedge.microsoft.com/addons).

Tras la instalación, haz clic en el icono del rompecabezas en la barra de herramientas de tu navegador y **fija** Hiyori Tools para acceso rápido.

---

### 2. Gestión de URLs

#### Guardar y abrir URLs por lotes
1. Haz clic en el icono de Hiyori Tools para abrir el panel.
2. Pega tu lista de URLs en el área de texto (una URL por línea).
3. Haz clic en **"Abrir todo"** — todas las URLs se abren inmediatamente como nuevas pestañas.

#### Copiar todas las URLs de la ventana actual
1. Abre el panel.
2. Haz clic en **"Copiar todas las URLs"** — todas las URLs de tu ventana actual se copian al portapapeles.

#### Lista de exclusión
1. Ve a **Configuración** → **Lista de exclusión**.
2. Añade las URLs o patrones de dominio que deseas omitir automáticamente.
3. Estas URLs serán ignoradas durante las operaciones por lotes.

---

### 3. Recolección Web

Navega hasta la página que deseas guardar y haz clic en el icono de Hiyori Tools.

| Formato | Cómo usar |
|---------|----------|
| 📸 Captura de pantalla (`.png`) | Clic en **"Guardar como captura"** — guarda el área visible |
| 📄 Documento (`.md`) | Clic en **"Guardar como Markdown"** — extrae el contenido de la página como archivo `.md` |
| 🖨️ PDF | Clic en **"Guardar como PDF"** — abre el diálogo de impresión del navegador (elige "Guardar como PDF") |
| 📜 Captura de página completa | Clic en **"Captura completa"** — captura y une toda la página desplazable |
| 🗂️ Sincronizar con Notion | Ver configuración de Notion abajo |

---

### 4. Configuración de la integración con Notion

1. Ve a [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) y crea una nueva integración.
2. Copia el **Token de integración interno**.
3. Abre tu base de datos de Notion objetivo → haz clic en **"..."** → **"Conexiones"** → conecta tu integración.
4. Copia el **ID de la base de datos** desde la URL (la cadena entre el último `/` y `?`).
5. En Hiyori Tools, ve a **Configuración** → **Notion**:
   - Pega tu **Token API**
   - Pega tu **ID de base de datos**
   - Personaliza los nombres de campos según sea necesario
6. En cualquier página web, haz clic en **"Sincronizar con Notion"** para guardarla en tu base de datos.

---

### 5. Automatización

1. Ve a **Configuración** → **Automatización**.
2. Activa **"Guardar automáticamente tras cargar la página"**.
3. Establece tu **tiempo de retraso** preferido (en segundos) — la extensión esperará ese tiempo tras cargar una página antes de guardar.

---

## 💡 Casos de uso

- Abrir por lotes sitios web seguidos a diario
- Guardar artículos, tutoriales y páginas de noticias
- Hacer copias de seguridad de contenido web importante regularmente
- Sincronizar páginas web con Notion para organizarlas

---

## 🔒 Privacidad

Hiyori Tools se ejecuta **completamente de forma local**. No se recopila, rastrea ni carga ningún dato en ningún servidor. La sincronización con Notion solo se comunica directamente con la API oficial de Notion usando tu propio token.

---

*Made with ♡ by sandleft*
