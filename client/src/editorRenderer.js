const cancelButton = document.getElementById('cancel')
cancelButton.addEventListener('click', () => window.close())

var accountData = {}

getPasswords()

var accountId = window.localStorage.getItem('accountId')

if (accountId !== null && accountId != 'undefined') {
    updatePasswordView(accountId)
}

function getPasswords() {
    window.localStorage.removeItem('passwords')
    window.electronAPI.accessPasswords()

    const passwords = window.localStorage.getItem('passwords')
    if (passwords !== null) accountData = JSON.parse(passwords)
    
    window.localStorage.removeItem('passwords')
    console.log('here' + accountData)
}

function save() {
    const title = document.getElementById('title').value
    const username = document.getElementById('username').value
    const password = document.getElementById('editorPassword').value
    const url = document.getElementById('url').value
    const notes = document.getElementById('notes').value
    console.log(title)
    console.log(url)
    if (! title) {
        window.alert("Title required")
    } else {
        if (title != accountId) {
            delete accountData[accountId]
            accountId = title
        }
        accountData[accountId] = {
            'username': username,
            'password': password,
            'url': url,
            'notes': notes
        }
        console.log(accountData)
        // console.log(JSON.stringify(accountData))
        window.electronAPI.updatePasswords(JSON.stringify(accountData))
    }
    
    // console.log(window.localStorage.getItem('passwords'))
    // window.close()
}

function updatePasswordView(accountName) {
    // Update the username, password fields to the specified account info
    const username = accountData[accountName]['username']
    const password = accountData[accountName]['password']
    const url = accountData[accountName]['url']
    const notes = accountData[accountName]['notes']

    const accountTitle = document.getElementById('title')
    accountTitle.value = accountName

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
    console.log(length)
    console.log(numbers)
    console.log(symbols)

    window.electronAPI.generatePassword(length, numbers, symbols)
}

const saveButton = document.getElementById('save')
saveButton.addEventListener('click', save, true)

const passwordButton = document.getElementById('password-button')
passwordButton.addEventListener('click', (event) => {
    event.preventDefault()
    generateNewPassword()
})
