const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // setTitle: (title) => ipcRenderer.send('set-title', title)
    authenticateUser: (email, password) => {
        ipcRenderer.invoke('authenticate', email, password)
    },
    openEditor: (accountId) => {
        ipcRenderer.invoke('openEditor', accountId)
    }
})

ipcRenderer.on('accountId', (event, accountId) => {
    if (accountId !== 'undefined') {
        document.querySelector('body').setAttribute('id', accountId)
    }
})
