const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    authenticateUser: (email, password) => ipcRenderer.invoke('authenticate', email, password),
    setWelcomeEmail: (email) => ipcRenderer.on('setWelcomeEmail', email),
    openEditor: (accountId) => ipcRenderer.invoke('openEditor', accountId)
})

ipcRenderer.on('accountId', (event, accountId) => {
    if (accountId !== 'undefined') {
        document.querySelector('body').setAttribute('id', accountId)
    }
})
