// background.js - 后台服务脚本

// 监听浏览器启动
chrome.runtime.onStartup.addListener(async () => {
  console.log('浏览器启动，检查自动打开设置...');
  await checkStartupAutoOpen();
});

// 监听扩展安装/更新
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('扩展已安装/更新:', details.reason);
  // 初始化定时任务
  await setupAlarms();
});

// 监听定时任务
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log('定时任务触发:', alarm.name);
  
  if (alarm.name === 'dailyOpen') {
    await dailyOpenTabs();
  } else if (alarm.name === 'startupAutoOpen') {
    await executeStartupOpen();
  } else if (alarm.name === 'autoSaveAfterOpen') {
    await executeAutoSave();
  }
});

// 监听外部消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message.action);
  
  if (message.action === 'harvestAll') {
    // 正确处理异步响应，防止消息通道关闭
    harvestAllTabs(message.config)
      .then(() => sendResponse({ success: true }))
      .catch(error => {
        console.error('收割过程出错:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // 保持消息通道打开，等待 sendResponse
  } else if (message.action === 'saveCurrent') {
    saveCurrentTab(message.config)
      .then(() => sendResponse({ success: true }))
      .catch(error => {
        console.error('保存当前网页出错:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  } else if (message.action === 'updateSchedule') {
    updateSchedule(message)
      .then(() => sendResponse({ success: true }))
      .catch(error => {
        console.error('更新定时任务出错:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  } else if (message.action === 'saveExcludeList') {
    // 新增：专门用于保存排除列表的消息
    chrome.storage.local.set({ excludeList: message.excludeList })
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  return false;
});

// ========== 定时任务相关 ==========

/**
 * 设置定时任务
 */
async function setupAlarms() {
  const data = await chrome.storage.local.get([
    'scheduledHour', 'scheduledMinute', 'startupEnabled', 'startupDelay'
  ]);
  
  // 设置每日定时打开
  const hour = parseInt(data.scheduledHour) || 0;
  const minute = parseInt(data.scheduledMinute) || 0;
  
  if (hour > 0 || minute > 0) {
    await createDailyAlarm(hour, minute);
  }
  
  console.log('定时任务设置完成');
}

/**
 * 创建每日定时任务
 */
async function createDailyAlarm(hour, minute) {
  // 先清除旧的任务
  await chrome.alarms.clear('dailyOpen');
  
  // 计算下一次触发时间
  const now = new Date();
  let scheduledTime = new Date();
  scheduledTime.setHours(hour, minute, 0, 0);
  
  // 如果今天的指定时间已过，则设置到明天
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  // 创建定时任务（周期为24小时）
  await chrome.alarms.create('dailyOpen', {
    when: scheduledTime.getTime(),
    periodInMinutes: 24 * 60
  });
  
  console.log(`每日定时任务已设置: ${hour}:${minute}`);
}

/**
 * 更新定时任务
 */
async function updateSchedule(settings) {
  const { scheduledHour, scheduledMinute, startupEnabled, startupDelay } = settings;
  
  // 更新每日定时任务
  if (scheduledHour > 0 || scheduledMinute > 0) {
    await createDailyAlarm(scheduledHour, scheduledMinute);
  } else {
    await chrome.alarms.clear('dailyOpen');
  }
  
  // 保存设置
  await chrome.storage.local.set({
    scheduledHour: scheduledHour,
    scheduledMinute: scheduledMinute,
    startupEnabled: startupEnabled,
    startupDelay: startupDelay
  });
  
  console.log('定时任务已更新');
}

/**
 * 检查启动时是否自动打开
 */
async function checkStartupAutoOpen() {
  const data = await chrome.storage.local.get([
    'startupEnabled', 'startupDelay', 'urlList'
  ]);
  
  if (!data.startupEnabled || !data.urlList) {
    console.log('启动自动打开未启用或没有网址列表');
    return;
  }
  
  const delay = parseInt(data.startupDelay) || 30;
  
  // 使用 Alarm 而不是 setTimeout，因为 Service Worker 可能休眠
  // delayInMinutes 最小为 1 分钟，确保至少为 1
  const delayMinutes = Math.max(1, delay / 60);
  
  console.log(`设置启动自动打开 Alarm，延迟 ${delayMinutes} 分钟`);
  
  await chrome.alarms.create('startupAutoOpen', {
    delayInMinutes: delayMinutes
  });
}

/**
 * 执行启动时自动打开
 */
async function executeStartupOpen() {
  console.log('执行启动时自动打开...');
  
  const data = await chrome.storage.local.get(['urlList', 'excludeList']);
  
  if (!data.urlList) {
    console.log('没有保存的网址列表');
    return;
  }

  // 获取排除列表
  const excludes = (data.excludeList || '').split(/[\r\n]+/)
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 0);
  
  const urls = data.urlList.split(/\r?\n/)
    .map(url => url.trim())
    .filter(url => url.length > 0)
    .map(url => {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
      }
      return url;
    })
    .filter(url => {
      const urlLower = url.toLowerCase();
      return !excludes.some(ex => urlLower.includes(ex));
    });
  
  console.log(`准备打开 ${urls.length} 个标签页`);
  
  for (const url of urls) {
    try {
      await chrome.tabs.create({ url: url, active: false });
    } catch (error) {
      console.error(`打开 ${url} 失败:`, error);
    }
  }
  
  console.log(`启动自动打开完成，共打开 ${urls.length} 个标签页`);

  // 检查是否需要自动保存 - 使用 Alarm 代替 setTimeout
  const autoSaveData = await chrome.storage.local.get(['autoSaveDelay']);
  const delaySeconds = parseInt(autoSaveData.autoSaveDelay) || 0;
  
  if (delaySeconds > 0) {
    // 先清除旧的 Alarm，避免重复触发
    await chrome.alarms.clear('autoSaveAfterOpen');
    
    // Alarm 最小精度为 1 分钟，确保至少为 1 分钟
    const delayMinutes = Math.max(1, delaySeconds / 60);
    
    console.log(`设置自动保存 Alarm，延迟 ${delayMinutes} 分钟`);
    
    await chrome.alarms.create('autoSaveAfterOpen', {
      delayInMinutes: delayMinutes
    });
  }
}

/**
 * 每日定时打开标签页
 */
async function dailyOpenTabs() {
  console.log('执行每日定时打开...');
  
  const data = await chrome.storage.local.get(['urlList', 'excludeList']);
  
  if (!data.urlList) {
    console.log('没有保存的网址列表');
    return;
  }

  // 获取排除列表
  const excludes = (data.excludeList || '').split(/[\r\n]+/)
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 0);
  
  const urls = data.urlList.split(/\r?\n/)
    .map(url => url.trim())
    .filter(url => url.length > 0)
    .map(url => {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
      }
      return url;
    })
    .filter(url => {
      const urlLower = url.toLowerCase();
      return !excludes.some(ex => urlLower.includes(ex));
    });
  
  if (urls.length === 0) {
    console.log('网址列表为空');
    return;
  }
  
  console.log(`准备打开 ${urls.length} 个标签页`);
  
  // 打开所有标签页
  for (const url of urls) {
    try {
      await chrome.tabs.create({ url: url, active: false });
    } catch (error) {
      console.error(`打开 ${url} 失败:`, error);
    }
  }
  
  console.log(`每日定时打开完成，共打开 ${urls.length} 个标签页`);
  
  // 显示通知
  chrome.notifications?.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: '🌸 Hiyori Tools',
    message: `已自动打开 ${urls.length} 个标签页`
  });

  // 检查是否需要自动保存 - 使用 Alarm 代替 setTimeout
  const autoSaveData = await chrome.storage.local.get(['autoSaveDelay']);
  const delaySeconds = parseInt(autoSaveData.autoSaveDelay) || 0;
  
  if (delaySeconds > 0) {
    // 先清除旧的 Alarm，避免重复触发
    await chrome.alarms.clear('autoSaveAfterOpen');
    
    // Alarm 最小精度为 1 分钟，确保至少为 1 分钟
    const delayMinutes = Math.max(1, delaySeconds / 60);
    
    console.log(`设置自动保存 Alarm，延迟 ${delayMinutes} 分钟`);
    
    await chrome.alarms.create('autoSaveAfterOpen', {
      delayInMinutes: delayMinutes
    });
  }
}

/**
 * 等待所有 HTTP 标签页加载完成
 * @param {number} timeout - 最大等待时间（毫秒）
 */
async function waitForAllTabsComplete(timeout = 30000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    // Service Worker 中不使用 currentWindow，查询所有窗口的标签页
    const tabs = await chrome.tabs.query({});
    const httpTabs = tabs.filter(t => t.url?.startsWith('http'));
    
    if (httpTabs.length === 0) return true;
    
    const allComplete = httpTabs.every(t => t.status === 'complete');
    if (allComplete) {
      console.log('所有标签页已加载完成');
      return true;
    }
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('等待标签页加载超时，继续执行');
  return false;
}

/**
 * 执行自动保存
 */
async function executeAutoSave() {
  console.log('执行自动保存...');
  
  // 清除这个 Alarm，避免重复触发
  await chrome.alarms.clear('autoSaveAfterOpen');
  
  // 等待所有标签页加载完成（最多等待 30 秒）
  await waitForAllTabsComplete(30000);

  const formatData = await chrome.storage.local.get([
    'savePNG', 'saveMD', 'savePDF', 'saveFullPage', 'saveNotion'
  ]);
  
  const config = {
    savePNG: formatData.savePNG || false,
    saveMD: formatData.saveMD || false,
    savePDF: formatData.savePDF || false,
    saveFullPage: formatData.saveFullPage || false,
    saveNotion: formatData.saveNotion || false
  };
  
  if (config.savePNG || config.saveMD || config.savePDF || config.saveFullPage || config.saveNotion) {
    console.log('开始自动保存，配置:', config);
    
    // 显示通知
    chrome.notifications?.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: '🌸 Hiyori Tools',
      message: '开始自动保存网页内容...'
    });
    
    try {
      await harvestAllTabs(config);
      console.log('自动保存完成');
    } catch (error) {
      console.error('自动保存失败:', error);
    }
  } else {
    console.log('没有选择任何保存格式，跳过自动保存');
  }
}

// ========== 文件处理相关 ==========

/**
 * 文件名清理函数
 */
function sanitizeFilename(filename) {
  if (!filename) return `file_${Date.now()}`;
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 100);
}

/**
 * 获取排除列表
 */
async function getExcludeList() {
  const data = await chrome.storage.local.get(['excludeList']);
  if (!data.excludeList) return [];
  return data.excludeList.split(/[\r\n]+/)
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 0);
}

/**
 * 检查网址是否在排除列表中
 */
function isUrlExcluded(url, excludes) {
  if (!url) return true;
  const urlLower = url.toLowerCase();
  return excludes.some(ex => urlLower.includes(ex));
}

/**
 * 从网页正文中提取标题（用于MD和Notion）
 */
async function extractPageTitle(tab) {
  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // 按优先级尝试获取正文标题
        let extractedTitle = null;
        
        // 1. 尝试获取 h1 标签
        const h1 = document.querySelector('h1');
        if (h1 && h1.innerText && h1.innerText.trim()) {
          const h1Text = h1.innerText.trim();
          // 确保不是空标题，且不是太长
          if (h1Text.length > 0 && h1Text.length < 200) {
            extractedTitle = h1Text;
          }
        }
        
        // 2. 如果 h1 没有，尝试获取第一个显著标题
        if (!extractedTitle) {
          const firstHeading = document.querySelector('h2, h3, .title, .post-title, .article-title, [class*="title"]');
          if (firstHeading && firstHeading.innerText && firstHeading.innerText.trim()) {
            const headingText = firstHeading.innerText.trim();
            if (headingText.length > 0 && headingText.length < 200) {
              extractedTitle = headingText;
            }
          }
        }
        
        // 3. 尝试获取 og:title meta 标签
        if (!extractedTitle) {
          const ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle && ogTitle.content && ogTitle.content.trim()) {
            extractedTitle = ogTitle.content.trim();
          }
        }
        
        // 4. 如果都没有，返回 document.title
        return extractedTitle || document.title || 'Untitled';
      }
    });
    
    if (result && result.length > 0 && result[0].result) {
      return result[0].result;
    }
    return tab.title || 'Untitled';
  } catch (error) {
    console.error('提取标题失败:', error);
    return tab.title || 'Untitled';
  }
}

/**
 * 批量收割所有标签页的内容
 */
async function harvestAllTabs(config) {
  try {
    const excludes = await getExcludeList();
    
    // Service Worker 中不使用 currentWindow，查询所有窗口的标签页
    const tabs = await chrome.tabs.query({});
    const httpTabs = tabs.filter(tab => {
      if (!tab.url) return false;
      if (!tab.url.startsWith('http://') && !tab.url.startsWith('https://')) return false;
      return !isUrlExcluded(tab.url, excludes);
    });
    
    const totalTabs = httpTabs.length;
    let processedCount = 0;
    
    // 注意：不再发送进度消息，因为在 Service Worker 中发送给自己会失败
    // 用户可以通过系统通知了解进度
    
    const results = [];
    
    for (const tab of httpTabs) {
      processedCount++;
      
      // 更新控制台日志
      console.log(`处理第 ${processedCount}/${totalTabs} 个标签页: ${tab.title}`);
      
      // 用于存储提取的标题
      let extractedTitle = null;
      
      // 如果勾选了MD，先提取标题并保存MD
      if (config.saveMD) {
        try {
          const mdResult = await extractAndSaveMarkdown(tab);
          if (mdResult && mdResult.title) {
            extractedTitle = mdResult.title;
          }
          results.push(`✅ MD: ${extractedTitle || tab.title}`);
        } catch (e) {
          console.error('MD保存失败:', e);
          results.push(`❌ MD失败: ${tab.title}`);
        }
      }
      
      // 如果勾选了Notion但没有勾选MD，需要单独提取标题
      if (config.saveNotion && !extractedTitle) {
        try {
          extractedTitle = await extractPageTitle(tab);
          console.log(`为Notion提取标题: ${extractedTitle}`);
        } catch (e) {
          console.error('提取Notion标题失败:', e);
        }
      }
      
      if (config.savePNG) {
        try {
          await captureAndSaveScreenshot(tab);
          results.push(`✅ PNG: ${tab.title}`);
        } catch (e) {
          console.error('PNG保存失败:', e);
          results.push(`❌ PNG失败: ${tab.title}`);
        }
      }
      
      if (config.savePDF) {
        try {
          await saveAsPdf(tab);
          results.push(`✅ PDF: ${tab.title}`);
        } catch (e) {
          console.error('PDF保存失败:', e);
          results.push(`❌ PDF失败: ${tab.title}`);
        }
      }
      
      if (config.saveFullPage) {
        try {
          await captureFullPageStable(tab);
          results.push(`✅ 整张截图: ${tab.title}`);
        } catch (e) {
          console.error('整张网页截图失败:', e);
          results.push(`❌ 整张截图失败: ${tab.title}`);
        }
      }
      
      if (config.saveNotion) {
        try {
          await syncToNotion(tab, extractedTitle);
          results.push(`✅ Notion: ${extractedTitle || tab.title}`);
        } catch (e) {
          console.error('Notion同步失败:', e);
          results.push(`❌ Notion失败: ${tab.title}`);
        }
      }
      
      // 标签页之间添加短暂延迟，避免资源争用
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 只发送系统通知（不发送消息给 popup，因为可能已关闭）
    const successCount = results.filter(r => r.includes('✅')).length;
    const failCount = results.filter(r => r.includes('❌')).length;
    
    chrome.notifications?.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: '🌸 Hiyori Tools',
      message: `保存完成！成功 ${successCount} 个，失败 ${failCount} 个`
    });
    
    console.log(`收割完成: 成功 ${successCount} 个，失败 ${failCount} 个`);
    
  } catch (error) {
    console.error('收割过程综合错误:', error);
    // 发送错误通知
    chrome.notifications?.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: '🌸 Hiyori Tools - 错误',
      message: `保存出错: ${error.message}`
    });
  }
}

/**
 * 保存当前活动标签页
 */
async function saveCurrentTab(config) {
  try {
    const excludes = await getExcludeList();
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || !tab.url.startsWith('http')) {
      throw new Error('当前标签页不是有效的网页');
    }

    if (isUrlExcluded(tab.url, excludes)) {
      throw new Error('当前网页在排除列表中，无法保存');
    }
    
    const results = [];
    let extractedTitle = null;
    
    // 先处理MD，提取标题
    if (config.saveMD) {
      try {
        const mdResult = await extractAndSaveMarkdown(tab);
        if (mdResult && mdResult.title) {
          extractedTitle = mdResult.title;
        }
        results.push(`✅ MD: ${extractedTitle || tab.title}`);
      } catch (e) {
        results.push(`❌ MD失败: ${e.message}`);
      }
    }
    
    // 如果勾选了Notion但没有勾选MD，单独提取标题
    if (config.saveNotion && !extractedTitle) {
      try {
        extractedTitle = await extractPageTitle(tab);
      } catch (e) {
        console.error('提取Notion标题失败:', e);
      }
    }
    
    if (config.savePNG) {
      try {
        await captureAndSaveScreenshot(tab);
        results.push(`✅ PNG: ${tab.title}`);
      } catch (e) {
        results.push(`❌ PNG失败: ${e.message}`);
      }
    }
    
    if (config.savePDF) {
      try {
        await saveAsPdf(tab);
        results.push(`✅ PDF: ${tab.title}`);
      } catch (e) {
        results.push(`❌ PDF失败: ${e.message}`);
      }
    }
    
    if (config.saveFullPage) {
      try {
        await captureFullPageStable(tab);
        results.push(`✅ 整张截图: ${tab.title}`);
      } catch (e) {
        results.push(`❌ 整张截图失败: ${e.message}`);
      }
    }
    
    if (config.saveNotion) {
      try {
        await syncToNotion(tab, extractedTitle);
        results.push(`✅ Notion: ${extractedTitle || tab.title}`);
      } catch (e) {
        results.push(`❌ Notion失败: ${e.message}`);
      }
    }
    
    // 发送系统通知（不发送消息给 popup）
    const successCount = results.filter(r => r.includes('✅')).length;
    const failCount = results.filter(r => r.includes('❌')).length;
    
    chrome.notifications?.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: '🌸 Hiyori Tools',
      message: `当前网页保存完成！成功 ${successCount} 个，失败 ${failCount} 个`
    });
    
    console.log('当前网页保存完成:', results);
    
  } catch (error) {
    console.error('保存当前网页出错:', error);
    chrome.notifications?.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: '🌸 Hiyori Tools - 错误',
      message: `保存当前网页出错: ${error.message}`
    });
  }
}

/**
 * 截图并保存
 */
async function captureAndSaveScreenshot(tab) {
  try {
    await chrome.tabs.update(tab.id, { active: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
    
    const filename = sanitizeFilename(tab.title?.substring(0, 40) || `screenshot_${Date.now()}`);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    
    await chrome.downloads.download({
      url: dataUrl,
      filename: `Harvest/Screenshots/${timestamp}_${filename}.png`,
      saveAs: false
    });
    
    return true;
  } catch (error) {
    console.error('截图失败:', error);
    throw error;
  }
}

/**
 * 提取内容并保存为Markdown
 * 返回包含title的对象，以便后续使用
 */
async function extractAndSaveMarkdown(tab) {
  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // 按优先级尝试获取正文标题
        let mdTitle = document.title || 'Untitled';
        
        // 1. 尝试获取 h1 标签
        const h1 = document.querySelector('h1');
        if (h1 && h1.innerText && h1.innerText.trim()) {
          const h1Text = h1.innerText.trim();
          if (h1Text.length > 0 && h1Text.length < 200) {
            mdTitle = h1Text;
          }
        }
        
        // 2. 如果 h1 没有有效内容，尝试获取其他标题元素
        if (mdTitle === document.title) {
          const firstHeading = document.querySelector('h2, h3, .title, .post-title, .article-title, [class*="title"]');
          if (firstHeading && firstHeading.innerText && firstHeading.innerText.trim()) {
            const headingText = firstHeading.innerText.trim();
            if (headingText.length > 0 && headingText.length < 200) {
              mdTitle = headingText;
            }
          }
        }
        
        // 3. 尝试 og:title
        if (mdTitle === document.title) {
          const ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle && ogTitle.content && ogTitle.content.trim()) {
            mdTitle = ogTitle.content.trim();
          }
        }
        
        const url = window.location.href;
        let content = '';
        
        const mainContent = document.querySelector('main, article, .content, #content, .post, .article');
        if (mainContent) {
          content = mainContent.innerText;
        } else {
          content = document.body?.innerText || '';
        }
        
        return { title: mdTitle, url, content: content.substring(0, 50000) };
      }
    });
    
    if (!result || result.length === 0) {
      throw new Error('无法提取页面内容');
    }
    
    const { title, url, content } = result[0].result;
    
    console.log(`MD提取标题: ${title}`);
    
    const markdownContent = `# ${title}\n\n` +
      `**URL:** ${url}\n\n` +
      `**保存时间:** ${new Date().toLocaleString('zh-CN')}\n\n` +
      `---\n\n` +
      `## 内容\n\n${content}`;
    
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const dataUrl = await blobToDataUrl(blob);
    
    const filename = sanitizeFilename(title.substring(0, 40) || `page_${Date.now()}`);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    
    await chrome.downloads.download({
      url: dataUrl,
      filename: `Harvest/Markdown/${timestamp}_${filename}.md`,
      saveAs: false
    });
    
    return { title };
  } catch (error) {
    console.error('Markdown保存失败:', error);
    throw error;
  }
}

/**
 * 保存为PDF（使用打印功能）
 */
async function saveAsPdf(tab) {
  try {
    await chrome.tabs.update(tab.id, { active: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 执行打印
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        window.print();
      }
    });
    
    return true;
  } catch (error) {
    console.error('PDF保存失败:', error);
    throw error;
  }
}

/**
 * 稳定版整张网页截图
 * 使用更可靠的方式实现完整页面捕获
 */
async function captureFullPageStable(tab) {
  try {
    console.log(`开始整张网页截图: ${tab.title}`);
    
    // 先激活标签页
    await chrome.tabs.update(tab.id, { active: true });
    await new Promise(resolve => setTimeout(resolve, 1200)); // 增加等待时间
    
    // 注入脚本获取页面尺寸并准备截图环境
    const dimensions = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // 获取完整的页面尺寸
        const width = Math.max(
          document.documentElement.scrollWidth || 0,
          document.body?.scrollWidth || 0,
          document.documentElement.offsetWidth || 0,
          document.body?.offsetWidth || 0,
          window.innerWidth || 0
        );
        
        const height = Math.max(
          document.documentElement.scrollHeight || 0,
          document.body?.scrollHeight || 0,
          document.documentElement.offsetHeight || 0,
          document.body?.offsetHeight || 0
        );
        
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        return {
          width,
          height,
          viewportHeight,
          viewportWidth,
          originalScrollX: window.scrollX,
          originalScrollY: window.scrollY
        };
      }
    });
    
    if (!dimensions || dimensions.length === 0) {
      throw new Error('无法获取页面尺寸');
    }
    
    const { width, height, viewportHeight, viewportWidth, originalScrollX, originalScrollY } = dimensions[0].result;
    
    console.log(`整张截图: 页面尺寸 ${width}x${height}, 视口 ${viewportWidth}x${viewportHeight}`);
    
    // 如果页面太小，直接截图
    if (height <= viewportHeight + 100) {
      console.log('页面高度小于视口，直接截图');
      const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
      
      const filename = sanitizeFilename(tab.title?.substring(0, 40) || `fullpage_${Date.now()}`);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      
      await chrome.downloads.download({
        url: dataUrl,
        filename: `Harvest/FullPage/${timestamp}_${filename}.png`,
        saveAs: false
      });
      
      console.log('整张网页截图保存成功');
      return true;
    }
    
    // 长页面：分段截图后拼接
    const screenshots = [];
    const numScreenshots = Math.ceil(height / viewportHeight);
    
    console.log(`长页面截图: 需要截取 ${numScreenshots} 段`);
    
    // 先滚动到顶部
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        window.scrollTo(0, 0);
        return true;
      }
    });
    await new Promise(resolve => setTimeout(resolve, 1000)); // 增加等待时间
    
    // 逐段截图
    for (let i = 0; i < numScreenshots; i++) {
      const scrollY = i * viewportHeight;
      
      // 滚动到对应位置
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (y) => {
          window.scrollTo(0, y);
          return true;
        },
        args: [scrollY]
      });
      
      // 等待页面渲染（足够长的等待时间确保稳定）
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // 截图
      try {
        const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
        screenshots.push({ dataUrl, y: scrollY, index: i });
        console.log(`第 ${i + 1}/${numScreenshots} 段截图成功`);
      } catch (e) {
        console.error(`第 ${i + 1} 段截图失败:`, e);
        // 重试一次
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
          const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
          screenshots.push({ dataUrl, y: scrollY, index: i });
          console.log(`第 ${i + 1}/${numScreenshots} 段截图重试成功`);
        } catch (e2) {
          console.error(`第 ${i + 1} 段截图重试仍然失败:`, e2);
        }
      }
    }
    
    // 恢复原始滚动位置
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (pos) => {
          window.scrollTo(pos.x, pos.y);
          return true;
        },
        args: [{ x: originalScrollX, y: originalScrollY }]
      });
    } catch (e) {
      console.warn('恢复滚动位置失败:', e);
    }
    
    if (screenshots.length === 0) {
      throw new Error('没有成功截取任何内容');
    }
    
    console.log(`成功截取 ${screenshots.length} 段，开始拼接...`);
    
    // 如果只有一张截图，直接保存
    if (screenshots.length === 1) {
      const filename = sanitizeFilename(tab.title?.substring(0, 40) || `fullpage_${Date.now()}`);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      
      await chrome.downloads.download({
        url: screenshots[0].dataUrl,
        filename: `Harvest/FullPage/${timestamp}_${filename}.png`,
        saveAs: false
      });
      
      console.log('整张网页截图保存成功');
      return true;
    }
    
    // 拼接多张截图
    const mergedDataUrl = await mergeScreenshots(screenshots, width, height, viewportHeight);
    
    const filename = sanitizeFilename(tab.title?.substring(0, 40) || `fullpage_${Date.now()}`);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    
    await chrome.downloads.download({
      url: mergedDataUrl,
      filename: `Harvest/FullPage/${timestamp}_${filename}.png`,
      saveAs: false
    });
    
    console.log(`整张网页截图保存成功: ${filename}`);
    return true;
  } catch (error) {
    console.error('整张网页截图失败:', error);
    throw error;
  }
}

/**
 * 拼接多张截图 - 使用 Service Worker 兼容的 API
 * 不使用 new Image() 和 FileReader，改用 createImageBitmap 和手动 base64 转换
 */
async function mergeScreenshots(screenshots, totalWidth, totalHeight, viewportHeight) {
  try {
    const canvas = new OffscreenCanvas(totalWidth, totalHeight);
    const ctx = canvas.getContext('2d');
    
    // 填充白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, totalHeight);
    
    // 逐个加载并绘制图片
    for (let i = 0; i < screenshots.length; i++) {
      const item = screenshots[i];
      try {
        // 将 dataUrl 转换为 Blob，然后使用 createImageBitmap（Service Worker 可用）
        const response = await fetch(item.dataUrl);
        const blob = await response.blob();
        const imgBitmap = await createImageBitmap(blob);
        
        // 绘制到 canvas
        const y = i * viewportHeight;
        ctx.drawImage(imgBitmap, 0, y);
        
        // 释放位图资源
        imgBitmap.close();
        
        console.log(`图片 ${i + 1}/${screenshots.length} 拼接成功`);
      } catch (e) {
        console.error(`图片 ${i} 加载失败:`, e);
        // 继续处理下一张，不中断整个流程
      }
    }
    
    // 转换为 blob，然后手动转为 dataUrl（不使用 FileReader）
    const resultBlob = await canvas.convertToBlob({ type: 'image/png' });
    const dataUrl = await blobToDataUrl(resultBlob);
    
    console.log('所有图片拼接完成');
    return dataUrl;
  } catch (error) {
    console.error('拼接过程出错:', error);
    throw error;
  }
}

/**
 * Blob转DataUrl - Service Worker 兼容版本
 * 不使用 FileReader，手动将 ArrayBuffer 转为 base64
 */
async function blobToDataUrl(blob) {
  try {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // 手动转为二进制字符串
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    // 转为 base64
    const base64 = btoa(binary);
    return `data:${blob.type || 'application/octet-stream'};base64,${base64}`;
  } catch (error) {
    console.error('Blob转DataUrl失败:', error);
    throw error;
  }
}

/**
 * 将文本按代码点安全截断
 */
function safeSubstring(str, maxCodePoints) {
  return Array.from(str || '').slice(0, maxCodePoints).join('');
}

/**
 * 将文本按 maxLen 代码点分块
 */
function chunkText(text, maxLen) {
  const chars = Array.from(text || '');
  const chunks = [];
  for (let i = 0; i < chars.length; i += maxLen) {
    chunks.push(chars.slice(i, i + maxLen).join(''));
  }
  return chunks;
}

/**
 * 同步到 Notion（完整实现）
 * - 正确的 paragraph block 结构
 * - 1900 字符分块，最多 99 块
 * - 可配置字段名（Title / URL / Tags / Time）
 * - 429 限流自动重试（最多 3 次）
 * - 20s 超时
 * - 如果提供了extractedTitle，使用它；否则使用tab.title
 */
async function syncToNotion(tab, extractedTitle = null, retryCount = 0) {
  console.log(`开始同步到Notion，标题: ${extractedTitle || tab.title}`);
  
  const cfg = await chrome.storage.local.get([
    'notionApiKey', 'notionDatabaseId',
    'notionPropTitle', 'notionPropUrl', 'notionPropTags', 'notionPropTime'
  ]);

  if (!cfg.notionApiKey || !cfg.notionDatabaseId) {
    throw new Error('请先在扩展中配置 Notion API 密钥和数据库 ID');
  }

  const propTitle = (cfg.notionPropTitle || 'Title').trim();
  const propUrl   = (cfg.notionPropUrl   || 'URL'  ).trim();
  const propTags  = (cfg.notionPropTags  || 'Tags' ).trim();
  const propTime  = (cfg.notionPropTime  || 'Time' ).trim();

  // 提取页面内容（最多 99*1900 字符，避免超限）
  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => ({
      title:   document.title || 'Untitled',
      url:     window.location.href,
      content: (document.body?.innerText || '').substring(0, 99 * 1900)
    })
  });

  if (!result || result.length === 0) throw new Error('无法提取页面内容');

  const pageData = result[0].result;
  
  // 使用传入的extractedTitle（来自MD提取的正文标题）或页面标题
  const title = extractedTitle || pageData.title;
  const url = pageData.url;
  const content = pageData.content;

  console.log(`Notion同步标题: ${title}`);

  // 构造 children blocks（paragraph，每块最多 1900 代码点）
  const blocks = chunkText(content, 1900).slice(0, 99).map(chunk => ({
    object:    'block',
    type:      'paragraph',
    paragraph: { rich_text: [{ type: 'text', text: { content: chunk } }] }
  }));

  // 日期字段（本地日期，yyyy-MM-dd）
  const now = new Date();
  const localDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-');

  // 构造 properties（使用可配置字段名）
  const props = {};
  props[propTitle] = { title:        [{ type: 'text', text: { content: safeSubstring(title, 100) } }] };
  props[propUrl]   = { url };
  props[propTags]  = { multi_select: [{ name: '网页' }] };
  props[propTime]  = { date:         { start: localDate } };

  // 20s 超时控制
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization':  `Bearer ${cfg.notionApiKey}`,
        'Content-Type':   'application/json',
        'Notion-Version': '2022-06-28'
      },
      body:   JSON.stringify({
        parent:     { database_id: cfg.notionDatabaseId },
        properties: props,
        children:   blocks
      }),
      signal: controller.signal
    });

    // 429 限流：指数退避重试最多 3 次
    if (response.status === 429 && retryCount < 3) {
      const wait = (retryCount + 1) * 8000;
      console.warn(`[Notion] 限流，${wait / 1000}s 后重试（第 ${retryCount + 1} 次）`);
      await new Promise(r => setTimeout(r, wait));
      return syncToNotion(tab, extractedTitle, retryCount + 1);
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Notion API 错误 ${response.status}: ${errText}`);
    }

    console.log(`Notion同步成功: ${title}`);
    return true;
  } finally {
    clearTimeout(timeoutId);
  }
}

console.log('🌸 Hiyori Tools 后台服务已启动');
