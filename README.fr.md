# 🌸 Hiyori Tools 🌸

**Un outil mignon de gestion d'URL et de collecte de pages web**

---

🌐 **README dans d'autres langues :**
[English](README.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Italiano](README.it.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md)

---

## 📦 Téléchargement

- Téléchargement Edge : https://microsoftedge.microsoft.com/addons/detail/hiyori-tools/ffkpgbobmimcehhcmehkadmkefblaidj
- Téléchargement Chrome : En cours de validation

---

## 📖 Introduction

Une extension de navigateur légère et efficace qui vous aide à gérer les URL par lots et à collecter le contenu web en un clic. Convient pour les favoris quotidiens, l'archivage de données et la gestion des connaissances.

---

## ✨ Fonctionnalités principales

### 🔗 Gestion des URL
- Enregistrer les URL par lots, prendre en charge l'ouverture de tous les onglets en un clic
- Copier toutes les URL de la fenêtre actuelle en un clic
- Liste d'exclusion : Ignorer automatiquement les URL spécifiées

### 📥 Collecte Web
- Enregistrer en tant que capture d'écran (`.png`)
- Enregistrer en tant que document (`.md`)
- Enregistrer le code source de la page (`.html`)
- Enregistrer des données structurées (`.json`)
- Enregistrer en PDF (appelle l'impression du navigateur)
- Capture d'écran de la page entière (assemblage automatique des pages longues)
- Synchroniser avec Notion (noms de champs personnalisables)

### ⚡ Automatisation
- Enregistrement automatique après l'ouverture d'une page web, délai réglable

### 🎀 Caractéristiques
- Interface épurée, fonctionnement intuitif
- Fonctionne localement, les données ne sont pas téléchargées
- Prend en charge l'intégration de l'API Notion
- Exclut automatiquement les URL indésirables

---

## 🚀 Comment utiliser

### 1. Installation

- Téléchargement Edge : https://microsoftedge.microsoft.com/addons/detail/hiyori-tools/ffkpgbobmimcehhcmehkadmkefblaidj
- Téléchargement Chrome : En cours de validation

Après l'installation, cliquez sur l'icône puzzle dans la barre d'outils de votre navigateur et **épinglez** Hiyori Tools pour un accès rapide.

---

### 2. Gestion des URL

#### Enregistrer et ouvrir des URL par lots
1. Cliquez sur l'icône Hiyori Tools pour ouvrir le panneau.
2. Collez votre liste d'URL dans la zone de texte (une URL par ligne).
3. Cliquez sur **« Tout ouvrir »** — toutes les URL s'ouvrent instantanément en nouveaux onglets.

#### Copier toutes les URL de la fenêtre actuelle
1. Ouvrez le panneau.
2. Cliquez sur **« Copier toutes les URL »** — toutes les URL de votre fenêtre actuelle sont copiées dans le presse-papiers.

#### Liste d'exclusion
1. Allez dans **Paramètres** → **Liste d'exclusion**.
2. Ajoutez les URL ou les modèles de domaine que vous souhaitez ignorer automatiquement.
3. Ces URL seront ignorées lors des opérations par lots.

---

### 3. Collecte Web

Naviguez jusqu'à la page que vous souhaitez enregistrer, puis cliquez sur l'icône Hiyori Tools.

| Format | Comment utiliser |
|--------|-----------------|
| 📸 Capture d'écran (`.png`) | Cliquez sur **« Enregistrer en capture d'écran »** — enregistre la zone visible |
| 📄 Document (`.md`) | Cliquez sur **« Enregistrer en Markdown »** — extrait le contenu de la page en fichier `.md` |
| 🌐 HTML (`.html`) | Cliquez sur **« Enregistrer en HTML »** — enregistre le code source actuel de la page en fichier `.html` |
| 🧩 JSON (`.json`) | Cliquez sur **« Enregistrer en JSON »** — enregistre les données structurées de la page en fichier `.json` |
| 🖨️ PDF | Cliquez sur **« Enregistrer en PDF »** — ouvre la boîte de dialogue d'impression (choisissez « Enregistrer en PDF ») |
| 📜 Capture d'écran pleine page | Cliquez sur **« Capture pleine page »** — capture et assemble l'intégralité de la page déroulante |
| 🗂️ Synchroniser avec Notion | Voir la configuration Notion ci-dessous |

---

### 4. Configuration de l'intégration Notion

1. Allez sur [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) et créez une nouvelle intégration.
2. Copiez le **Token d'intégration interne**.
3. Ouvrez votre base de données Notion cible → cliquez sur **« ... »** → **« Connexions »** → connectez votre intégration.
4. Copiez l'**ID de la base de données** depuis l'URL (la chaîne entre le dernier `/` et `?`).
5. Dans Hiyori Tools, allez dans **Paramètres** → **Notion** :
   - Collez votre **Token API**
   - Collez votre **ID de base de données**
   - Personnalisez les noms de champs si nécessaire
6. Sur n'importe quelle page web, cliquez sur **« Synchroniser avec Notion »** pour l'enregistrer dans votre base de données.

---

### 5. Automatisation

1. Allez dans **Paramètres** → **Automatisation**.
2. Activez **« Enregistrement automatique après le chargement de la page »**.
3. Définissez votre **délai** préféré (en secondes) — l'extension attendra ce délai après le chargement d'une page avant d'enregistrer.

---

## 💡 Cas d'utilisation

- Ouvrir par lots les sites web suivis quotidiennement
- Mettre en favori des articles, des tutoriels et des pages d'actualités
- Sauvegarder régulièrement le contenu web important
- Synchroniser les pages web avec Notion pour l'organisation

---

## 🔒 Confidentialité

Hiyori Tools fonctionne **entièrement en local**. Aucune donnée n'est collectée, suivie ou téléchargée sur un serveur. La synchronisation Notion communique uniquement directement avec l'API officielle de Notion en utilisant votre propre token.

---

*Made with ♡ by sandleft*
