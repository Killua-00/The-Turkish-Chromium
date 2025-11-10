const { app, BrowserWindow, BrowserView, ipcMain, session } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const Store = require('electron-store');

const store = new Store();
let mainWindow;
let currentView;
const tabs = [];
let activeTabId = null;

// Initialize database
const dbPath = path.join(app.getPath('userData'), 'browser-data.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    title TEXT,
    visit_time INTEGER NOT NULL,
    favicon TEXT
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    favicon TEXT,
    folder TEXT DEFAULT 'Bookmarks Bar',
    created_time INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    frame: true,
    icon: path.join(__dirname, 'public/assets/logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: false
    },
    backgroundColor: '#ffffff'
  });

  mainWindow.loadFile('src/index.html');

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

function createTab(url = 'chrome://newtab') {
  const tabId = Date.now().toString();
  
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  tabs.push({
    id: tabId,
    view: view,
    url: url,
    title: 'New Tab',
    canGoBack: false,
    canGoForward: false,
    isLoading: false,
    favicon: null
  });

  // Handle chrome:// URLs
  if (url.startsWith('chrome://')) {
    const page = url.replace('chrome://', '');
    view.webContents.loadFile(`src/pages/${page}.html`);
  } else {
    view.webContents.loadURL(url);
  }

  // Navigation events
  view.webContents.on('did-start-loading', () => {
    updateTabState(tabId, { isLoading: true });
  });

  view.webContents.on('did-stop-loading', () => {
    updateTabState(tabId, { isLoading: false });
  });

  view.webContents.on('did-navigate', (event, url) => {
    updateTabState(tabId, {
      url: url,
      title: view.webContents.getTitle(),
      canGoBack: view.webContents.canGoBack(),
      canGoForward: view.webContents.canGoForward()
    });
    addToHistory(url, view.webContents.getTitle());
  });

  view.webContents.on('did-navigate-in-page', (event, url) => {
    updateTabState(tabId, {
      url: url,
      canGoBack: view.webContents.canGoBack(),
      canGoForward: view.webContents.canGoForward()
    });
  });

  view.webContents.on('page-title-updated', (event, title) => {
    updateTabState(tabId, { title: title });
  });

  view.webContents.on('page-favicon-updated', (event, favicons) => {
    if (favicons.length > 0) {
      updateTabState(tabId, { favicon: favicons[0] });
    }
  });

  return tabId;
}

function updateTabState(tabId, updates) {
  const tab = tabs.find(t => t.id === tabId);
  if (tab) {
    Object.assign(tab, updates);
    if (tabId === activeTabId) {
      mainWindow.webContents.send('tab-updated', {
        tabId,
        ...tab,
        view: undefined // Don't send view object
      });
    }
    mainWindow.webContents.send('tabs-updated', getTabsInfo());
  }
}

function switchTab(tabId) {
  const tab = tabs.find(t => t.id === tabId);
  if (!tab) return;

  if (currentView) {
    mainWindow.removeBrowserView(currentView);
  }

  const bounds = mainWindow.getContentBounds();
  tab.view.setBounds({
    x: 0,
    y: 120, // Height of browser chrome (toolbar + tabs)
    width: bounds.width,
    height: bounds.height - 120
  });

  mainWindow.addBrowserView(tab.view);
  currentView = tab.view;
  activeTabId = tabId;

  mainWindow.webContents.send('tab-switched', {
    tabId,
    url: tab.url,
    title: tab.title,
    canGoBack: tab.canGoBack,
    canGoForward: tab.canGoForward,
    isLoading: tab.isLoading,
    favicon: tab.favicon
  });
}

function getTabsInfo() {
  return tabs.map(tab => ({
    id: tab.id,
    url: tab.url,
    title: tab.title,
    favicon: tab.favicon,
    isActive: tab.id === activeTabId
  }));
}

function addToHistory(url, title) {
  if (url.startsWith('chrome://')) return;
  
  const stmt = db.prepare('INSERT INTO history (url, title, visit_time) VALUES (?, ?, ?)');
  stmt.run(url, title, Date.now());
}

// IPC Handlers
ipcMain.handle('create-tab', (event, url) => {
  const tabId = createTab(url);
  switchTab(tabId);
  return { tabId, tabs: getTabsInfo() };
});

ipcMain.handle('close-tab', (event, tabId) => {
  const index = tabs.findIndex(t => t.id === tabId);
  if (index === -1) return;

  const tab = tabs[index];
  if (currentView === tab.view) {
    mainWindow.removeBrowserView(currentView);
    currentView = null;
  }

  tabs.splice(index, 1);

  if (tabs.length === 0) {
    const newTabId = createTab();
    switchTab(newTabId);
  } else if (tabId === activeTabId) {
    const newIndex = Math.min(index, tabs.length - 1);
    switchTab(tabs[newIndex].id);
  }

  return { tabs: getTabsInfo() };
});

ipcMain.handle('switch-tab', (event, tabId) => {
  switchTab(tabId);
  return { success: true };
});

ipcMain.handle('navigate', (event, url) => {
  if (!currentView) return;

  // Handle chrome:// URLs
  if (url.startsWith('chrome://')) {
    const page = url.replace('chrome://', '');
    currentView.webContents.loadFile(`src/pages/${page}.html`);
  } else {
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    currentView.webContents.loadURL(url);
  }
});

ipcMain.handle('go-back', () => {
  if (currentView && currentView.webContents.canGoBack()) {
    currentView.webContents.goBack();
  }
});

ipcMain.handle('go-forward', () => {
  if (currentView && currentView.webContents.canGoForward()) {
    currentView.webContents.goForward();
  }
});

ipcMain.handle('reload', () => {
  if (currentView) {
    currentView.webContents.reload();
  }
});

ipcMain.handle('stop', () => {
  if (currentView) {
    currentView.webContents.stop();
  }
});

ipcMain.handle('get-history', () => {
  const stmt = db.prepare('SELECT * FROM history ORDER BY visit_time DESC LIMIT 1000');
  return stmt.all();
});

ipcMain.handle('clear-history', () => {
  db.prepare('DELETE FROM history').run();
  return { success: true };
});

ipcMain.handle('search-history', (event, query) => {
  const stmt = db.prepare('SELECT * FROM history WHERE url LIKE ? OR title LIKE ? ORDER BY visit_time DESC LIMIT 100');
  return stmt.all(`%${query}%`, `%${query}%`);
});

ipcMain.handle('get-bookmarks', () => {
  const stmt = db.prepare('SELECT * FROM bookmarks ORDER BY created_time DESC');
  return stmt.all();
});

ipcMain.handle('add-bookmark', (event, { url, title, favicon, folder }) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO bookmarks (url, title, favicon, folder, created_time) VALUES (?, ?, ?, ?, ?)');
  const result = stmt.run(url, title, favicon, folder || 'Bookmarks Bar', Date.now());
  return { success: true, id: result.lastInsertRowid };
});

ipcMain.handle('remove-bookmark', (event, url) => {
  const stmt = db.prepare('DELETE FROM bookmarks WHERE url = ?');
  stmt.run(url);
  return { success: true };
});

ipcMain.handle('is-bookmarked', (event, url) => {
  const stmt = db.prepare('SELECT id FROM bookmarks WHERE url = ?');
  const result = stmt.get(url);
  return !!result;
});

ipcMain.handle('get-settings', (event, key) => {
  const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
  const result = stmt.get(key);
  return result ? result.value : null;
});

ipcMain.handle('set-settings', (event, { key, value }) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  stmt.run(key, value);
  return { success: true };
});

ipcMain.handle('get-current-tab', () => {
  const tab = tabs.find(t => t.id === activeTabId);
  if (!tab) return null;
  return {
    tabId: tab.id,
    url: tab.url,
    title: tab.title,
    canGoBack: tab.canGoBack,
    canGoForward: tab.canGoForward,
    isLoading: tab.isLoading,
    favicon: tab.favicon
  };
});

app.whenReady().then(() => {
  createWindow();
  
  // Create initial tab
  const tabId = createTab();
  switchTab(tabId);

  // Handle window resize
  mainWindow.on('resize', () => {
    if (currentView) {
      const bounds = mainWindow.getContentBounds();
      currentView.setBounds({
        x: 0,
        y: 120,
        width: bounds.width,
        height: bounds.height - 120
      });
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.close();
    app.quit();
  }
});

app.on('before-quit', () => {
  db.close();
});
