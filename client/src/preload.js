const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setWelcomeEmail: (email) => ipcRenderer.on('setWelcomeEmail', email),
    authenticateUser: (email, password) => {
        ipcRenderer.invoke('authenticate', email, password)
    },
    openEditor: (accountId) => {
        ipcRenderer.invoke('openEditor', accountId)
    },
    accessPasswords: () => {
        ipcRenderer.send('accessPasswords')
    },
    updatePasswords: () => {
        const updatedPasswords = window.localStorage.getItem('passwords')
        ipcRenderer.send('updatePasswords', updatedPasswords)
    }
})

ipcRenderer.on('accountId', (event, accountId) => {
    if (accountId !== 'undefined') {
        window.localStorage.setItem('accountId', accountId)
    }
})

ipcRenderer.on('passwordData', (event, passwords) => {
    // console.log(passwords)
    window.localStorage.setItem('passwords', passwords)
})

ipcRenderer.on('passwordUpdate', () => {
    window.location.reload()
})
