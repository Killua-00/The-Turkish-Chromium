# The Turkish Chromium - User Guide

Welcome to **The Turkish Chromium**! This guide will help you get started with your new browser.

## 📥 Getting Started

### Installation

1. **Download the Project**
   - Download the `/app/electron-browser` folder to your computer
   
2. **Install Node.js** (if not already installed)
   - Visit https://nodejs.org/
   - Download and install the LTS version (v18 or higher)
   - Verify installation: Open terminal and type `node --version`

3. **Install Dependencies**
   ```bash
   cd path/to/electron-browser
   npm install
   ```
   Or if you have yarn:
   ```bash
   yarn install
   ```

4. **Launch the Browser**
   ```bash
   npm start
   ```
   Or with yarn:
   ```bash
   yarn start
   ```

## 🎯 Basic Usage

### Navigation

- **Address Bar**: Type any URL or search query
  - URLs: `example.com`, `https://google.com`
  - Search: Just type what you want to search (uses Google)
  - Press Enter to navigate

- **Navigation Buttons**:
  - ← Back: Go to previous page
  - → Forward: Go to next page
  - ↻ Reload: Refresh current page

### Tab Management

- **New Tab**: Click the `+` button in the tab bar or use menu → New Tab
- **Switch Tabs**: Click on any tab to switch to it
- **Close Tab**: Click the `×` button on the tab
- **Tab Bar**: Shows all open tabs with favicons and titles

### Bookmarks

1. **Add Bookmark**: Click the ★ star icon in address bar (turns red when bookmarked)
2. **View Bookmarks**: Menu → Bookmarks or navigate to `chrome://bookmarks`
3. **Remove Bookmark**: 
   - Click the filled star in address bar, or
   - Go to chrome://bookmarks and click the × on any bookmark

### History

1. **View History**: Menu → History or navigate to `chrome://history`
2. **Search History**: Use the search box at the top
3. **Clear History**: Click "Clear All History" button
4. **Visit from History**: Click any history item to visit that page

## 🎨 Custom Pages

### chrome://newtab
Your home page featuring:
- Quick access shortcuts (Google, YouTube, GitHub, etc.)
- Your bookmarks
- Search box

### chrome://history
- Complete browsing history
- Grouped by date (Today, Yesterday, etc.)
- Search functionality
- Clear all option

### chrome://bookmarks
- All your saved bookmarks
- Visual card layout with favicons
- Delete bookmarks
- Folder organization

### chrome://settings
- Appearance settings (Dark mode, bookmarks bar)
- Privacy settings (Cookie blocking, clear data)
- Search engine preferences
- Startup options
- Homepage configuration

### chrome://version
- Browser version information
- Chromium, Electron, Node.js versions
- Feature list
- About information with Turkish logo

## 🔧 Advanced Features

### Menu Options

Click the ⋮ menu button to access:
- 📄 New Tab
- 📚 History
- ⭐ Bookmarks
- ⚙️ Settings
- ℹ️ About Turkish Chromium

### Keyboard Shortcuts (Built-in by Chromium)

- **Ctrl+T** (Cmd+T on Mac): New tab
- **Ctrl+W** (Cmd+W): Close tab
- **Ctrl+Tab**: Switch to next tab
- **Ctrl+Shift+Tab**: Switch to previous tab
- **Ctrl+R** (Cmd+R): Reload page
- **Ctrl+L** (Cmd+L): Focus address bar
- **Ctrl+D** (Cmd+D): Bookmark page

### Data Storage

All your data is stored locally on your computer:

**Windows**: `%APPDATA%\turkish-chromium\`
**macOS**: `~/Library/Application Support/turkish-chromium/`
**Linux**: `~/.config/turkish-chromium/`

This includes:
- Browser history
- Bookmarks
- Settings
- SQLite database

## 📦 Building Executables

Want to create a standalone application?

### For Current Platform

```bash
npm run build
```

This creates an installer in the `dist/` folder:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage` file

### Quick Package (No Installer)

```bash
npm run pack
```

This is faster and creates a portable version without an installer.

## 🐛 Troubleshooting

### Browser Won't Start

1. Make sure Node.js is installed: `node --version`
2. Delete `node_modules` folder and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```
3. Try running with dev tools: `npm run dev`

### Dependencies Installation Fails

1. Make sure you have npm/yarn installed
2. Try clearing npm cache: `npm cache clean --force`
3. Use yarn instead: `npm install -g yarn` then `yarn install`

### Pages Not Loading

1. Check your internet connection
2. Try reloading the page (↻ button)
3. Check if the URL is correct
4. Try a different website

### Bookmarks/History Not Saving

1. Check if you have write permissions to the data directory
2. Close and restart the browser
3. Check the database file exists in the data directory

### Performance Issues

1. Close unused tabs
2. Clear history and cached data (Settings → Clear Data)
3. Restart the browser
4. Check your system resources (RAM, CPU)

## 🚀 Tips & Tricks

1. **Quick Search**: Just type in address bar and press Enter
2. **Multiple Tabs**: Open multiple sites in different tabs
3. **Organize Bookmarks**: Use folders in bookmark manager
4. **Check Updates**: Visit chrome://version to see your browser version
5. **Clean Browser**: Regularly clear history and data from settings

## 🇹🇷 About The Turkish Chromium

The Turkish Chromium is built on:
- **Chromium**: Open-source browser project (same engine as Google Chrome)
- **Electron**: Desktop application framework
- **Node.js**: JavaScript runtime

Features:
- ✅ Full web standards support
- ✅ Modern JavaScript and CSS
- ✅ Secure sandboxed tabs
- ✅ Local data storage
- ✅ Turkish-themed beautiful design

## 📞 Support

If you encounter any issues or have questions:

1. Check this user guide
2. Read the README.md file
3. Check the Electron documentation: https://www.electronjs.org/docs
4. Review the project structure and code

## 🎓 For Developers

Want to customize the browser?

1. **Main Process**: Edit `main.js` for window/tab management
2. **UI Design**: Edit `src/index.html` and CSS styles
3. **Custom Pages**: Edit files in `src/pages/`
4. **Add Features**: Add IPC handlers in main.js and expose in preload.js

See README.md for detailed development guide.

---

Enjoy browsing with **The Turkish Chromium**! 🇹🇷
