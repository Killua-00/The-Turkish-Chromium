# The Turkish Chromium

A full-featured Chromium-based web browser built with Electron, featuring a beautiful Turkish-themed design.

![Turkish Chromium Logo](public/assets/logo.png)

## 🌟 Features

- **Full Tab Management**: Create, switch, and close multiple tabs
- **Advanced Navigation**: Back, forward, reload, and address bar
- **Bookmarks System**: Save and organize your favorite websites
- **History Tracking**: Keep track of your browsing history with search
- **Custom Chrome Pages**: Built-in pages for newtab, history, bookmarks, settings, and version info
- **SQLite Database**: Local storage for bookmarks and history
- **Turkish-Themed Design**: Beautiful red and white color scheme inspired by Turkish flag
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Secure Browsing**: Sandboxed tabs with Chromium security features

## 🚀 Installation & Running

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Steps to Run

1. **Install Dependencies**
   ```bash
   cd /app/electron-browser
   yarn install
   # or
   npm install
   ```

2. **Run the Browser**
   ```bash
   yarn start
   # or
   npm start
   ```

3. **Run in Development Mode** (with DevTools open)
   ```bash
   yarn dev
   # or
   npm run dev
   ```

## 📦 Building Executables

To build standalone executables for your platform:

```bash
# Build for current platform
yarn build
# or
npm run build

# Package without installer (faster)
yarn pack
# or
npm run pack
```

Built files will be in the `dist/` directory.

### Platform-Specific Builds

- **Windows**: Creates `.exe` installer
- **macOS**: Creates `.dmg` installer
- **Linux**: Creates `.AppImage`

## 🎨 Custom Chrome Pages

The browser includes custom internal pages:

- `chrome://newtab` - Beautiful start page with shortcuts and bookmarks
- `chrome://history` - Browsing history with search and grouping
- `chrome://bookmarks` - Bookmark manager with folders
- `chrome://settings` - Browser settings and preferences
- `chrome://version` - About page with version information

## 🗂️ Project Structure

```
electron-browser/
├── main.js              # Electron main process
├── preload.js           # Preload script (IPC bridge)
├── package.json         # Dependencies and build config
├── src/
│   ├── index.html       # Browser UI (tabs, toolbar, address bar)
│   ├── renderer.js      # Browser UI logic
│   └── pages/           # Custom chrome:// pages
│       ├── newtab.html
│       ├── history.html
│       ├── bookmarks.html
│       ├── settings.html
│       └── version.html
├── public/
│   └── assets/
│       └── logo.png     # Turkish Chromium logo
└── database/            # SQLite database (auto-created)
```

## 💾 Data Storage

Browser data is stored locally using SQLite in your system's user data directory:

- **Windows**: `%APPDATA%\turkish-chromium\`
- **macOS**: `~/Library/Application Support/turkish-chromium/`
- **Linux**: `~/.config/turkish-chromium/`

Database includes:
- Browsing history
- Bookmarks
- User settings

## 🔧 Development

### Architecture

- **Main Process** (`main.js`): Manages browser windows, BrowserViews, and database
- **Renderer Process** (`src/`): Handles browser UI and user interactions
- **Preload Script** (`preload.js`): Secure bridge between main and renderer processes

### Adding New Features

1. Add IPC handlers in `main.js`
2. Expose APIs in `preload.js`
3. Use APIs in renderer process (`renderer.js` or custom pages)

### Database Schema

```sql
-- History table
CREATE TABLE history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  title TEXT,
  visit_time INTEGER NOT NULL,
  favicon TEXT
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL UNIQUE,
  title TEXT,
  favicon TEXT,
  folder TEXT DEFAULT 'Bookmarks Bar',
  created_time INTEGER NOT NULL
);

-- Settings table
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

## 🎯 Key Technologies

- **Electron 28.x**: Desktop application framework
- **Chromium**: Web rendering engine
- **Better-SQLite3**: Fast SQLite database
- **BrowserView API**: Native tab implementation
- **Node.js**: Backend runtime

## 🛡️ Security Features

- Context isolation enabled
- Node integration disabled in tabs
- Sandboxed renderer processes
- Secure IPC communication
- No direct file system access from web content

## 📝 License

MIT License - Feel free to use and modify as needed.

## 🇹🇷 About

**The Turkish Chromium** is a full-featured web browser built with pride, featuring a beautiful Turkish-themed design with the iconic red and white colors.

---

Built with ❤️ using Electron and Chromium
