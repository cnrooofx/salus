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
        if (title != accountId) {
            delete accountData[accountId]
        }
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
    const accountDetails = JSON.parse(decrypt(accountData[accountName]))
    console.log('update ' + accountName)
    let username
    let password
    let url
    let notes

    if ('username' in accountDetails) {
        username = accountDetails['username']
    } else {
        username = ''
    }
    if ('password' in accountDetails) {
        password = accountDetails['password']
    } else {
        password = ''
    }
    if ('url' in accountDetails) {
        url = accountDetails['url']
    } else {
        url = ''
    }
    if ('notes' in accountDetails) {
        notes = accountDetails['notes']
    } else {
        notes = ''
    }
    const accountTitle = document.getElementById('title')
    accountTitle.innerHTML = accountName

    const usernameBox = document.getElementById('username')
    usernameBox.value = username
    const passwordBox = document.getElementById('editorPassword')
    passwordBox.value = password
    const urlBox = document.getElementById('url')
    urlBox.value = url
    const notesBox = document.getElementById('notes')
    notesBox.innerHTML = notes
    
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
