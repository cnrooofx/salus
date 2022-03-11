const cancelButton = document.getElementById('cancel')
cancelButton.addEventListener('click', () => window.close())

var accountData
var accountId = window.localStorage.getItem('accountId')

window.electronAPI.accessPasswords().then((passwords) => {
    if (typeof passwords != 'object') {
        accountData = JSON.parse(passwords)
    } else {
        accountData = passwords
    }
    if (accountId !== null && accountId != 'undefined') {
        updatePasswordView(accountId)
    }
}, (error) => {
    console.log(error)
    accountData = {}
})

function save() {
    const title = document.getElementById('title').value
    const username = document.getElementById('username').value
    const password = document.getElementById('editorPassword').value
    const url = document.getElementById('url').value
    const notes = document.getElementById('notes').value
    console.log('title ' + title)
    console.log(url)
    if (! title) {
        window.alert("Title required")
    } else {
        accountData[title] = {
            'username': username,
            'password': password,
            'url': url,
            'notes': notes
        }
        window.electronAPI.updatePasswords(accountData)
    }
}

function updatePasswordView(accountName) {
    // Update the username, password fields to the specified account info
    let username
    let password
    let url
    let notes

    if ('username' in accountData[accountName]) {
        username = accountData[accountName]['username']
    }
    if ('password' in accountData[accountName]) {
        password = accountData[accountName]['password']
    }
    if ('url' in accountData[accountName]) {
        
        url = accountData[accountName]['url']
    }
    if ('notes' in accountData[accountName]) {
        notes = accountData[accountName]['notes']
    }
    const accountTitle = document.getElementById('title')
    accountTitle.value = accountName

    const usernameBox = document.getElementById('username')
    if (username) {
        usernameBox.value = username
    } else {
        usernameBox.value = ''
    }
    const passwordBox = document.getElementById('editorPassword')
    if (password) {
        passwordBox.value = password
    } else {
        passwordBox.value = ''
    }
    const urlBox = document.getElementById('url')
    if (url) {
        urlBox.value = url
    } else {
        urlBox.value = ''
    }
    const notesBox = document.getElementById('notes')
    if (notes) {
        notesBox.innerHTML = notes
    } else {
        notesBox.innerHTML = ''
    }
    
}

function generateNewPassword() {
    const length = document.getElementById('length').value
    const numbers = document.getElementById('numbers').checked
    const symbols = document.getElementById('symbols').checked
    window.electronAPI.generatePassword(length, numbers, symbols)
}

const saveButton = document.getElementById('save')
saveButton.addEventListener('click', (event) => {
    event.preventDefault()
    save()
})

const passwordButton = document.getElementById('password-button')
passwordButton.addEventListener('click', (event) => {
    event.preventDefault()
    generateNewPassword()
})