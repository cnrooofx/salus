const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')
const Store = require('electron-store')
const storage = new Store()
storage.set('logged-in', false)

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.webContents.openDevTools()
    win.loadFile(path.join(__dirname, 'login.html'))
    // storage.get('logged-in') ? 
    //     win.loadFile(path.join(__dirname, 'unlock.html')) :
    //     win.loadFile(path.join(__dirname, 'login.html'))
}

app.whenReady().then(() => {
    ipcMain.on('set-title', handleSetTitle)
    createWindow()
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

function handleSetTitle(event, title) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    if (storage.get('logged-in')) {
        title = 'already logged in' 
    } else {
        storage.set('logged-in', true)
    }
    win.setTitle(title)
}
