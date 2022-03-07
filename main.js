const { app, BrowserWindow, ipcMain } = require('electron')
const network = require('./src/api/network')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    maxWidth: 1280,
    maxHeight: 720,
    darkTheme: true,
    autoHideMenuBar: true,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  //Development mode only
  win.webContents.openDevTools()

  win.loadFile('./src/index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  ipcMain.removeAllListeners('BR_NETWORK')
  app.quit()
})

