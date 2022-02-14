const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // setTitle: (title) => ipcRenderer.send('set-title', title)
    openFile: () => ipcRenderer.invoke('openFile'),
    authenticateUser: () => ipcRenderer.invoke('authenticate', details)
})

// window.addEventListener('DOMContentLoaded', () => {
//     const loginButton = document.getElementById('login-form')
//     loginButton.addEventListener('submit', login, 'false')

//     function login(event) {
//         event.preventDefault()
//         const email = document.getElementById('email').value
//         const loginText = document.getElementById('login-text')
//         loginText.innerHTML = email
//     }
// })
