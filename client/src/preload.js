const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setWelcomeEmail: (email) => ipcRenderer.on('setWelcomeEmail', email),
    authenticateUser: (email, password) => {
        ipcRenderer.invoke('authenticate', email, password)
    },
    openEditor: (accountId) => {
        ipcRenderer.send('openEditor', accountId)
    },
    accessPasswords: async () => {
        ipcRenderer.send('accessPasswords')
    },
    updatePasswords: (updatedPasswords) => {
        ipcRenderer.send('updatePasswords', updatedPasswords)
        ipcRenderer.once('passwordUpdate', () => {
            window.close()
        })
    },
    generatePassword: (length, numbers, symbols) => {
        ipcRenderer.send('generatePassword', length, numbers, symbols)
    }
})

ipcRenderer.on('accountId', (event, accountId) => {
    if (accountId !== null && typeof accountId !== 'undefined') {
        window.localStorage.setItem('accountId', accountId)
    }
})

ipcRenderer.on('passwordData', (event, passwords) => {
    // console.log(passwords)
    window.localStorage.setItem('passwords', passwords)
})

ipcRenderer.on('passwordUpdate', (event) => {
    console.log('reloading' + event)
    // window.location.reload()
})

ipcRenderer.on('insertPassword', (event, password) => {
    console.log(password)
    const passwordField = document.getElementById('editorPassword')
    if (passwordField != null) {
        passwordField.value = password
    }
})
