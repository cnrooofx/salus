const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setWelcomeEmail: (email) => ipcRenderer.on('setWelcomeEmail', email),
    login: (email, password) => {
        ipcRenderer.invoke('login', email, password)
    },
    signup: (email, password) => {
        ipcRenderer.invoke('signup', email, password)
    },
    openEditor: (accountId) => {
        ipcRenderer.send('openEditor', accountId)
    },
    accessPasswords: () => ipcRenderer.invoke('accessPasswords'),
    getUserData: () => ipcRenderer.invoke('getUserData'),
    updatePasswords: (updatedPasswords) => {
        ipcRenderer.send('updatePasswords', updatedPasswords)
    },
    generatePassword: (length, numbers, symbols) => {
        ipcRenderer.send('generatePassword', length, numbers, symbols)
    },
    storeId: (id) => {
        ipcRenderer.send('storeID', id)
    },
    redirectMain: () => ipcRenderer.send('redirectMain'),
    copyToClipboard: (data) => ipcRenderer.send('copyToClipboard', data)
})

ipcRenderer.on('accountId', (event, accountId) => {
    window.localStorage.clear('accountId')
    if (accountId !== null && typeof accountId !== 'undefined') {
        window.localStorage.setItem('accountId', accountId)
    }
})

ipcRenderer.on('passwordUpdate', (event) => {
    window.location.reload()
})

ipcRenderer.on('insertPassword', (event, password) => {
    console.log(password)
    const passwordField = document.getElementById('editorPassword')
    if (passwordField != null) {
        passwordField.value = password
    }
})
