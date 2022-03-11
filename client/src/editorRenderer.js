const cancelButton = document.getElementById('cancel')
cancelButton.addEventListener('click', () => window.close())

var accountData
var userData
var accountId = window.localStorage.getItem('accountId')

window.electronAPI.accessPasswords().then((passwords) => {
    if (typeof passwords != 'object') {
        accountData = JSON.parse(passwords)
    } else {
        accountData = passwords
    }
    if (accountId !== null && accountId != 'undefined') {
        accessUserData().then(() => {
            updatePasswordView(accountId)
        }, (error) => console.log(error)) 
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
        const accountDetails = {
            'username': username,
            'password': password,
            'url': url,
            'notes': notes
        }
        accountData[title] = accountDetails
        // accountData[title] = encrypt(accountDetails)

        window.electronAPI.updatePasswords(accountData)
    }
}

function updatePasswordView(accountName) {
    // Update the username, password fields to the specified account info
    const accountDetails = accountData[accountName]
    // const accountDetails = JSON.parse(decrypt(accountData[accountName]))
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

function encrypt(msg) {
    const iv = userData['iv']
    const key = crypto.scryptSync(userData['pass'], userData['salt'], 24)
    const algorithm = 'aes-192-cbc'
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    cipher.write(msg)
    cipher.end()
    let out = ''
    out += cipher.read().toString('hex')
    return out
}

function decrypt(encrypted_msg) {
    const iv = userData['iv']
    const key = crypto.scryptSync(userData['pass'], userData['salt'], 24)
    const algorithm = 'aes-192-cbc'
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    decipher.write(encrypted_msg, 'hex')
    decipher.end()
    let out = ''
    out += decipher.read().toString('utf8')
    return out
}
