// popup.js - 扩展弹窗逻辑（多语言 i18n 版）

// ========== i18n 工具函数 ==========

/**
 * 快捷获取本地化字符串，支持占位符替换
 * @param {string} key  - messages.json 中的键名
 * @param {...string} subs - 按顺序替换 $1$, $2$... 的值
 */
function t(key, ...subs) {
  return chrome.i18n.getMessage(key, subs) || key;
}

/**
 * 将页面中所有 data-i18n / data-i18n-placeholder 元素替换为本地化文本
 * 在 DOMContentLoaded 最开始调用，保证用户看不到未翻译的闪烁
 */
function applyI18n() {
  // 文本内容
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const msg = t(el.dataset.i18n);
    if (msg) el.textContent = msg;
  });
  // 输入框 / 文本框 placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const msg = t(el.dataset.i18nPlaceholder);
    if (msg) el.placeholder = msg;
  });
}

// ========== 主逻辑 ==========

document.addEventListener('DOMContentLoaded', async () => {
  // 第一步：立即应用 i18n，避免界面闪烁
  applyI18n();

  // 弹窗自由拉伸
  const container = document.querySelector('.container');
  new ResizeObserver(() => {
    document.body.style.width  = container.offsetWidth  + 'px';
    document.body.style.height = container.offsetHeight + 'px';
  }).observe(container);

  // 元素引用
  const urlTextarea    = document.getElementById('urlTextarea');
  const excludeTextarea= document.getElementById('excludeTextarea');
  const openAllBtn     = document.getElementById('openAllBtn');
  const copyUrlsBtn    = document.getElementById('copyUrlsBtn');
  const harvestAllBtn  = document.getElementById('harvestAllBtn');
  const saveCurrentBtn = document.getElementById('saveCurrentBtn');
  const urlCountSpan   = document.getElementById('urlCount');
  const excludeCountSpan = document.getElementById('excludeCount');
  const progressContainer = document.getElementById('progressContainer');
  const progressBar    = document.getElementById('progressBar');
  const progressText   = document.getElementById('progressText');

  // 格式复选框
  const savePNG      = document.getElementById('savePNG');
  const saveMD       = document.getElementById('saveMD');
  const savePDF      = document.getElementById('savePDF');
  const saveHTML     = document.getElementById('saveHTML');
  const saveJSON     = document.getElementById('saveJSON');
  const saveFullPage = document.getElementById('saveFullPage');
  const saveNotion   = document.getElementById('saveNotion');

  // Notion 配置元素
  const notionConfigSection   = document.getElementById('notionConfigSection');
  const notionApiKeyInput     = document.getElementById('notionApiKey');
  const notionDatabaseIdInput = document.getElementById('notionDatabaseId');
  const notionPropTitleInput  = document.getElementById('notionPropTitle');
  const notionPropUrlInput    = document.getElementById('notionPropUrl');
  const notionPropTagsInput   = document.getElementById('notionPropTags');
  const notionPropTimeInput   = document.getElementById('notionPropTime');
  const saveNotionConfigBtn   = document.getElementById('saveNotionConfigBtn');

  // 自动设置输入框
  const autoSaveDelay  = document.getElementById('autoSaveDelay');
  const scheduledHour  = document.getElementById('scheduledHour');
  const scheduledMinute= document.getElementById('scheduledMinute');
  const startupDelay   = document.getElementById('startupDelay');
  const startupEnabled = document.getElementById('startupEnabled');

  // 加载已保存的数据
  await loadSavedData();

  // 更新网址计数
  updateUrlCount();
  updateExcludeCount();

  // ========== 页面关闭前自动保存 ==========
  window.addEventListener('beforeunload', async () => {
    await Promise.all([
      saveUrlList(),
      saveExcludeList(),
      saveFormatSettings(),
      saveAutoSettings()
    ]);
  });

  // ========== 事件监听 ==========

  urlTextarea.addEventListener('blur', saveUrlList);
  urlTextarea.addEventListener('input', updateUrlCount);

  excludeTextarea.addEventListener('blur', saveExcludeList);
  excludeTextarea.addEventListener('input', updateExcludeCount);

  autoSaveDelay.addEventListener('blur', saveAutoSettings);

  if (scheduledHour)   scheduledHour.addEventListener('blur', saveAutoSettings);
  if (scheduledMinute) scheduledMinute.addEventListener('blur', saveAutoSettings);
  if (startupDelay)    startupDelay.addEventListener('blur', saveAutoSettings);
  if (startupEnabled)  startupEnabled.addEventListener('change', saveAutoSettings);

  [savePNG, saveMD, savePDF, saveHTML, saveJSON, saveFullPage, saveNotion].forEach(cb => {
    cb.addEventListener('change', saveFormatSettings);
  });

  saveNotion.addEventListener('change', () => {
    notionConfigSection.style.display = saveNotion.checked ? 'block' : 'none';
  });

  saveNotionConfigBtn.addEventListener('click', saveNotionConfig);
  openAllBtn.addEventListener('click', openAllTabs);
  copyUrlsBtn.addEventListener('click', copyAllUrls);
  harvestAllBtn.addEventListener('click', harvestAll);
  saveCurrentBtn.addEventListener('click', saveCurrentPage);

  // ========== 功能函数 ==========

  async function loadSavedData() {
    try {
      const data = await chrome.storage.local.get([
        'urlList', 'excludeList', 'savePNG', 'saveMD', 'savePDF', 'saveHTML', 'saveJSON', 'saveFullPage', 'saveNotion',
        'autoSaveDelay', 'scheduledHour', 'scheduledMinute', 'startupDelay', 'startupEnabled',
        'notionApiKey', 'notionDatabaseId',
        'notionPropTitle', 'notionPropUrl', 'notionPropTags', 'notionPropTime'
      ]);

      if (data.urlList)      urlTextarea.value    = data.urlList;
      if (data.excludeList)  excludeTextarea.value = data.excludeList;
      if (data.savePNG      !== undefined) savePNG.checked      = data.savePNG;
      if (data.saveMD       !== undefined) saveMD.checked       = data.saveMD;
      if (data.savePDF      !== undefined) savePDF.checked      = data.savePDF;
      if (data.saveHTML     !== undefined) saveHTML.checked     = data.saveHTML;
      if (data.saveJSON     !== undefined) saveJSON.checked     = data.saveJSON;
      if (data.saveFullPage !== undefined) saveFullPage.checked = data.saveFullPage;
      if (data.saveNotion   !== undefined) saveNotion.checked   = data.saveNotion;
      if (data.autoSaveDelay)  autoSaveDelay.value  = data.autoSaveDelay;
      if (scheduledHour  && data.scheduledHour)   scheduledHour.value  = data.scheduledHour;
      if (scheduledMinute && data.scheduledMinute) scheduledMinute.value = data.scheduledMinute;
      if (startupDelay   && data.startupDelay)    startupDelay.value   = data.startupDelay;
      if (startupEnabled && data.startupEnabled !== undefined)
        startupEnabled.checked = data.startupEnabled;

      if (data.notionApiKey)     notionApiKeyInput.value     = data.notionApiKey;
      if (data.notionDatabaseId) notionDatabaseIdInput.value = data.notionDatabaseId;
      notionPropTitleInput.value = data.notionPropTitle || 'Title';
      notionPropUrlInput.value   = data.notionPropUrl   || 'URL';
      notionPropTagsInput.value  = data.notionPropTags  || 'Tags';
      notionPropTimeInput.value  = data.notionPropTime  || 'Time';

      notionConfigSection.style.display = data.saveNotion ? 'block' : 'none';
    } catch (error) {
      console.error('loadSavedData error:', error);
    }
  }

  function updateUrlCount() {
    urlCountSpan.textContent = getUrlsFromTextarea().length;
  }

  function updateExcludeCount() {
    excludeCountSpan.textContent = getExcludesFromTextarea().length;
  }

  function getUrlsFromTextarea() {
    const text = urlTextarea.value.trim();
    if (!text) return [];
    return text.split(/[\r\n]+/)
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .map(url => (url.startsWith('http://') || url.startsWith('https://'))
        ? url : 'https://' + url);
  }

  function getExcludesFromTextarea() {
    const text = excludeTextarea.value.trim();
    if (!text) return [];
    return text.split(/[\r\n]+/)
      .map(s => s.trim().toLowerCase())
      .filter(s => s.length > 0);
  }

  async function saveUrlList() {
    try {
      await chrome.storage.local.set({ urlList: urlTextarea.value });
    } catch (error) {
      console.error('saveUrlList error:', error);
    }
  }

  async function saveExcludeList() {
    try {
      await chrome.storage.local.set({ excludeList: excludeTextarea.value });
    } catch (error) {
      console.error('saveExcludeList error:', error);
    }
  }

  async function saveFormatSettings() {
    try {
      await chrome.storage.local.set({
        savePNG: savePNG.checked,
        saveMD:  saveMD.checked,
        savePDF: savePDF.checked,
        saveHTML: saveHTML.checked,
        saveJSON: saveJSON.checked,
        saveFullPage: saveFullPage.checked,
        saveNotion:   saveNotion.checked
      });
    } catch (error) {
      console.error('saveFormatSettings error:', error);
    }
  }

  async function saveAutoSettings() {
    try {
      const hour   = parseInt((scheduledHour   && scheduledHour.value)   || 0);
      const minute = parseInt((scheduledMinute && scheduledMinute.value) || 0);

      await chrome.storage.local.set({
        autoSaveDelay:   autoSaveDelay.value,
        scheduledHour:   scheduledHour   ? scheduledHour.value   : '',
        scheduledMinute: scheduledMinute ? scheduledMinute.value : '',
        startupDelay:    startupDelay    ? startupDelay.value    : '',
        startupEnabled:  startupEnabled  ? startupEnabled.checked : false
      });

      await chrome.runtime.sendMessage({
        action: 'updateSchedule',
        scheduledHour:   hour,
        scheduledMinute: minute,
        startupEnabled:  startupEnabled ? startupEnabled.checked : false,
        startupDelay:    parseInt((startupDelay && startupDelay.value) || 30)
      });
    } catch (error) {
      console.error('saveAutoSettings error:', error);
    }
  }

  async function openAllTabs() {
    const urls     = getUrlsFromTextarea();
    const excludes = getExcludesFromTextarea();

    if (urls.length === 0) {
      alert(t('alertNoUrl'));
      return;
    }

    showProgress();
    setProgress(0, urls.length);
    progressText.textContent = t('progressOpening');

    await Promise.all([saveUrlList(), saveExcludeList()]);

    const filteredUrls = urls.filter(url =>
      !excludes.some(ex => url.toLowerCase().includes(ex))
    );

    if (filteredUrls.length === 0) {
      hideProgress();
      alert(t('alertAllExcluded'));
      return;
    }

    let successCount = 0;
    for (let i = 0; i < filteredUrls.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      try {
        await chrome.tabs.create({ url: filteredUrls[i], active: false });
        successCount++;
        setProgress(i + 1, filteredUrls.length);
      } catch (error) {
        console.error(`Failed to open ${filteredUrls[i]}:`, error);
      }
    }

    updateUrlCount();

    const delaySeconds = parseInt(autoSaveDelay.value) || 0;
    if (delaySeconds > 0) {
      progressText.textContent = t('progressAutoSave', String(successCount), String(delaySeconds));

      setTimeout(async () => {
        const config = getSaveConfig();
        if (hasSelectedFormat(config)) {
          progressText.textContent = t('progressSaving');
          try {
            await chrome.runtime.sendMessage({
              action: 'harvestAll',
              config: config,
              autoSaveAfterOpen: true
            });
          } catch (e) {
            console.error('Auto-save error:', e);
            hideProgress();
            alert(t('alertSaveFailed') + e.message);
          }
        } else {
          hideProgress();
          alert(t('alertAutoSaveNoFormat', String(successCount)));
        }
      }, delaySeconds * 1000);
    } else {
      setTimeout(() => {
        hideProgress();
        alert(t('alertOpenedTabs', String(successCount)));
      }, 1000);
    }
  }

  async function copyAllUrls() {
    try {
      await saveExcludeList();

      const tabs = await chrome.tabs.query({ currentWindow: true });
      const httpTabs = tabs.filter(tab =>
        tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))
      );

      if (httpTabs.length === 0) {
        alert(t('alertNoValidUrls'));
        return;
      }

      const data = await chrome.storage.local.get(['excludeList']);
      const excludes = (data.excludeList || '').split(/[\r\n]+/)
        .map(s => s.trim().toLowerCase())
        .filter(s => s.length > 0);

      const filteredTabs = httpTabs.filter(tab =>
        !excludes.some(ex => tab.url.toLowerCase().includes(ex))
      );

      if (filteredTabs.length === 0) {
        alert(t('alertAllExcludedCopy'));
        return;
      }

      const urls = filteredTabs.map(tab => tab.url);
      await navigator.clipboard.writeText(urls.join('\n'));
      alert(t('alertCopied', String(urls.length)));
    } catch (error) {
      console.error('copyAllUrls error:', error);
      alert(t('alertCopyFailed') + error.message);
    }
  }

  async function harvestAll() {
    await saveExcludeList();
    const config = getSaveConfig();

    if (!hasSelectedFormat(config)) {
      alert(t('alertNoFormat'));
      return;
    }

    showProgress();
    setProgress(0, 0);

    try {
      await chrome.runtime.sendMessage({ action: 'harvestAll', config });
    } catch (error) {
      console.error('harvestAll error:', error);
      hideProgress();
      alert(t('alertSaveFailed') + error.message);
    }
  }

  async function saveCurrentPage() {
    await saveExcludeList();
    const config = getSaveConfig();

    if (!hasSelectedFormat(config)) {
      alert(t('alertNoFormat'));
      return;
    }

    showProgress();
    setProgress(0, 1);

    try {
      await chrome.runtime.sendMessage({ action: 'saveCurrent', config });
    } catch (error) {
      console.error('saveCurrentPage error:', error);
      hideProgress();
      alert(t('alertSaveFailed') + error.message);
    }
  }

  function getSaveConfig() {
    return {
      savePNG:      savePNG.checked,
      saveMD:       saveMD.checked,
      savePDF:      savePDF.checked,
      saveHTML:     saveHTML.checked,
      saveJSON:     saveJSON.checked,
      saveFullPage: saveFullPage.checked,
      saveNotion:   saveNotion.checked
    };
  }

  function hasSelectedFormat(config) {
    return config.savePNG || config.saveMD || config.savePDF ||
           config.saveHTML || config.saveJSON ||
           config.saveFullPage || config.saveNotion;
  }

  function showProgress() {
    progressContainer.style.display = 'block';
  }

  function hideProgress() {
    progressContainer.style.display = 'none';
  }

  function setProgress(current, total) {
    if (total > 0) {
      const percent = Math.round((current / total) * 100);
      progressBar.style.width = percent + '%';
      progressText.textContent = `${current}/${total}`;
    } else {
      progressBar.style.width = '0%';
      progressText.textContent = t('progressReady');
    }
  }

  async function saveNotionConfig() {
    try {
      await chrome.storage.local.set({
        notionApiKey:     notionApiKeyInput.value.trim(),
        notionDatabaseId: notionDatabaseIdInput.value.trim(),
        notionPropTitle:  notionPropTitleInput.value.trim() || 'Title',
        notionPropUrl:    notionPropUrlInput.value.trim()   || 'URL',
        notionPropTags:   notionPropTagsInput.value.trim()  || 'Tags',
        notionPropTime:   notionPropTimeInput.value.trim()  || 'Time'
      });
      // 临时显示"已保存"，再恢复原文
      saveNotionConfigBtn.textContent = t('btnNotionSaved');
      setTimeout(() => {
        saveNotionConfigBtn.textContent = t('btnSaveNotion');
      }, 1500);
    } catch (error) {
      console.error('saveNotionConfig error:', error);
    }
  }

  // ========== 监听 background 消息 ==========

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'harvestProgress') {
      showProgress();
      setProgress(message.progress, message.total);
    } else if (message.action === 'harvestComplete') {
      setProgress(message.total || 1, message.total || 1);
      setTimeout(() => {
        hideProgress();
        if (message.results && message.results.length > 0) {
          const successCount = message.results.filter(r => r.includes('✅')).length;
          const failCount    = message.results.filter(r => r.includes('❌')).length;
          alert(t('alertSaveResult',
            String(successCount),
            String(failCount),
            message.results.join('\n')
          ));
        } else {
          alert(t('alertSaveComplete'));
        }
      }, 500);
    } else if (message.action === 'harvestError') {
      hideProgress();
      alert(t('harvestError') + message.error);
    }
    return false;
  });
});
