// State
let currentTab = null;
let tabs = [];
let isBookmarked = false;
let menuOpen = false;

// DOM Elements
const tabsContainer = document.getElementById('tabsContainer');
const newTabBtn = document.getElementById('newTabBtn');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const reloadBtn = document.getElementById('reloadBtn');
const addressBar = document.getElementById('addressBar');
const bookmarkBtn = document.getElementById('bookmarkBtn');
const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
const loadingBar = document.getElementById('loadingBar');

// Initialize
async function init() {
  const tab = await window.electronAPI.getCurrentTab();
  if (tab) {
    updateCurrentTab(tab);
  }
}

// Tab Management
function renderTabs() {
  tabsContainer.innerHTML = '';
  tabs.forEach(tab => {
    const tabEl = document.createElement('div');
    tabEl.className = 'tab' + (tab.isActive ? ' active' : '');
    tabEl.onclick = () => switchTab(tab.id);
    
    const favicon = document.createElement('img');
    favicon.className = 'tab-favicon';
    favicon.src = tab.favicon || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><circle cx="12" cy="12" r="10"/></svg>';
    favicon.onerror = () => {
      favicon.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><circle cx="12" cy="12" r="10"/></svg>';
    };
    
    const title = document.createElement('div');
    title.className = 'tab-title';
    title.textContent = tab.title || 'New Tab';
    
    const closeBtn = document.createElement('div');
    closeBtn.className = 'tab-close';
    closeBtn.textContent = '×';
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeTab(tab.id);
    };
    
    tabEl.appendChild(favicon);
    tabEl.appendChild(title);
    tabEl.appendChild(closeBtn);
    tabsContainer.appendChild(tabEl);
  });
}

async function createTab(url) {
  const result = await window.electronAPI.createTab(url);
  tabs = result.tabs;
  renderTabs();
}

async function closeTab(tabId) {
  const result = await window.electronAPI.closeTab(tabId);
  tabs = result.tabs;
  renderTabs();
}

async function switchTab(tabId) {
  await window.electronAPI.switchTab(tabId);
}

function updateCurrentTab(data) {
  currentTab = data;
  
  // Update address bar
  if (data.url) {
    addressBar.value = data.url;
  }
  
  // Update navigation buttons
  backBtn.disabled = !data.canGoBack;
  forwardBtn.disabled = !data.canGoForward;
  
  // Update loading indicator
  if (data.isLoading) {
    loadingBar.classList.add('loading');
  } else {
    loadingBar.classList.remove('loading');
  }
  
  // Update bookmark button
  checkBookmarkStatus(data.url);
}

// Navigation
async function navigate(url) {
  if (!url) return;
  
  // Handle search queries
  if (!url.includes('.') && !url.startsWith('chrome://')) {
    url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
  }
  
  await window.electronAPI.navigate(url);
}

async function goBack() {
  await window.electronAPI.goBack();
}

async function goForward() {
  await window.electronAPI.goForward();
}

async function reload() {
  await window.electronAPI.reload();
}

// Bookmarks
async function checkBookmarkStatus(url) {
  if (!url || url.startsWith('chrome://')) {
    isBookmarked = false;
    bookmarkBtn.classList.remove('bookmarked');
    return;
  }
  
  isBookmarked = await window.electronAPI.isBookmarked(url);
  if (isBookmarked) {
    bookmarkBtn.classList.add('bookmarked');
  } else {
    bookmarkBtn.classList.remove('bookmarked');
  }
}

async function toggleBookmark() {
  if (!currentTab || !currentTab.url || currentTab.url.startsWith('chrome://')) {
    return;
  }
  
  if (isBookmarked) {
    await window.electronAPI.removeBookmark(currentTab.url);
    isBookmarked = false;
    bookmarkBtn.classList.remove('bookmarked');
  } else {
    await window.electronAPI.addBookmark({
      url: currentTab.url,
      title: currentTab.title,
      favicon: currentTab.favicon,
      folder: 'Bookmarks Bar'
    });
    isBookmarked = true;
    bookmarkBtn.classList.add('bookmarked');
  }
}

// Menu
function toggleMenu() {
  menuOpen = !menuOpen;
  if (menuOpen) {
    menuDropdown.classList.add('visible');
  } else {
    menuDropdown.classList.remove('visible');
  }
}

function closeMenu() {
  menuOpen = false;
  menuDropdown.classList.remove('visible');
}

// Event Listeners
newTabBtn.addEventListener('click', () => createTab('chrome://newtab'));
backBtn.addEventListener('click', goBack);
forwardBtn.addEventListener('click', goForward);
reloadBtn.addEventListener('click', reload);
bookmarkBtn.addEventListener('click', toggleBookmark);
menuBtn.addEventListener('click', toggleMenu);

addressBar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    navigate(addressBar.value);
  }
});

addressBar.addEventListener('focus', function() {
  this.select();
});

// Menu items
document.getElementById('newTabMenuItem').addEventListener('click', () => {
  createTab('chrome://newtab');
  closeMenu();
});

document.getElementById('historyMenuItem').addEventListener('click', () => {
  navigate('chrome://history');
  closeMenu();
});

document.getElementById('bookmarksMenuItem').addEventListener('click', () => {
  navigate('chrome://bookmarks');
  closeMenu();
});

document.getElementById('settingsMenuItem').addEventListener('click', () => {
  navigate('chrome://settings');
  closeMenu();
});

document.getElementById('aboutMenuItem').addEventListener('click', () => {
  navigate('chrome://version');
  closeMenu();
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
    closeMenu();
  }
});

// IPC Event Listeners
window.electronAPI.onTabUpdated((data) => {
  updateCurrentTab(data);
});

window.electronAPI.onTabSwitched((data) => {
  updateCurrentTab(data);
});

window.electronAPI.onTabsUpdated((tabsData) => {
  tabs = tabsData;
  renderTabs();
});

// Initialize
init();
