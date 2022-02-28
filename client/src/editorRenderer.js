const cancelButton = document.getElementById('cancel')
cancelButton.addEventListener('click', () => window.close())

const saveButton = document.getElementById('save')
saveButton.addEventListener('click', () => save())

window.electronAPI.accessPasswords()
var accountData = JSON.parse(window.localStorage.getItem('passwords'))

var accountId = window.localStorage.getItem('accountId')
console.log(accountId)
if (accountId !== null) {
    updatePasswordView(accountId)
}

function save() {
    const title = document.getElementById('title').value
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const url = document.getElementById('url').value
    const notes = document.getElementById('notes').value

    if (title !== accountId) {
        delete accountData[accountId]
        accountId = title
    }
    accountData[accountId] = {
        'username': username,
        'password': password,
        'url': url,
        'notes': notes
    }
    console.log(JSON.stringify(accountData))
    window.localStorage.setItem('passwords', JSON.stringify(accountData))
    window.electronAPI.updatePasswords()
    
    console.log(window.localStorage.getItem('passwords'))
}

function updatePasswordView(accountName) {
    // Update the username, password fields to the specified account info
    const username = accountData[accountName]['username']
    const password = accountData[accountName]['password']
    const url = accountData[accountName]['url']
    const notes = accountData[accountName]['notes']

    const accountTitle = document.getElementById('title')
    accountTitle.setAttribute('value', accountName)

    const usernameBox = document.getElementById('username')
    usernameBox.setAttribute('value', username)

    const passwordBox = document.getElementById('password')
    passwordBox.setAttribute('value', password)

    const urlBox = document.getElementById('url')
    urlBox.setAttribute('value', url)

    const notesBox = document.getElementById('notes')
    notesBox.innerHTML = notes
}
