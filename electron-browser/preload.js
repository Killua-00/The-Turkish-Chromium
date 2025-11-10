const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Tab management
  createTab: (url) => ipcRenderer.invoke('create-tab', url),
  closeTab: (tabId) => ipcRenderer.invoke('close-tab', tabId),
  switchTab: (tabId) => ipcRenderer.invoke('switch-tab', tabId),
  
  // Navigation
  navigate: (url) => ipcRenderer.invoke('navigate', url),
  goBack: () => ipcRenderer.invoke('go-back'),
  goForward: () => ipcRenderer.invoke('go-forward'),
  reload: () => ipcRenderer.invoke('reload'),
  stop: () => ipcRenderer.invoke('stop'),
  
  // History
  getHistory: () => ipcRenderer.invoke('get-history'),
  clearHistory: () => ipcRenderer.invoke('clear-history'),
  searchHistory: (query) => ipcRenderer.invoke('search-history', query),
  
  // Bookmarks
  getBookmarks: () => ipcRenderer.invoke('get-bookmarks'),
  addBookmark: (data) => ipcRenderer.invoke('add-bookmark', data),
  removeBookmark: (url) => ipcRenderer.invoke('remove-bookmark', url),
  isBookmarked: (url) => ipcRenderer.invoke('is-bookmarked', url),
  
  // Settings
  getSettings: (key) => ipcRenderer.invoke('get-settings', key),
  setSettings: (data) => ipcRenderer.invoke('set-settings', data),
  
  // Current tab info
  getCurrentTab: () => ipcRenderer.invoke('get-current-tab'),
  
  // Event listeners
  onTabUpdated: (callback) => ipcRenderer.on('tab-updated', (event, data) => callback(data)),
  onTabSwitched: (callback) => ipcRenderer.on('tab-switched', (event, data) => callback(data)),
  onTabsUpdated: (callback) => ipcRenderer.on('tabs-updated', (event, data) => callback(data))
});
