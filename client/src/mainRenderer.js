const newItemButton = document.getElementById('newButton')
newItemButton.addEventListener('click', () => {
    window.electronAPI.openEditor()
})
const searchBar = document.getElementById('search')
searchBar.addEventListener('change', () => {
    populateSidebar(searchBar.value)
})
const sidebar = document.getElementById('sidebar')
var sidebarSelection = null
var selectedAccountId = null
var accountData

window.electronAPI.accessPasswords().then((passwords) => {
    if (typeof passwords != 'object') {
        accountData = JSON.parse(passwords)
    } else {
        accountData = passwords
    }
    initialisePasswordView()
    populateSidebar()
}, (error) => {
    createListElement('empty', 'No Accounts Yet')
    console.log(error)
})

function showHidePassword() {
    const passwordBox = document.getElementById('password')
    const hideButton = document.getElementById('hideButton')
    const type = passwordBox.getAttribute('type')
    if (type === 'password') {
        passwordBox.setAttribute('type', 'text')
        hideButton.innerHTML = 'Hide Password'
    } else {
        passwordBox.setAttribute('type', 'password')
        hideButton.innerHTML = 'Show Password'
    }
}

function populateSidebar(searchTerm=null) {
    var accountList = []
    var index
    var account

    while (sidebar.lastChild) {
        sidebar.removeChild(sidebar.lastChild)
    }
    if (searchTerm != null) {
        const pattern = new RegExp(searchTerm, 'i')
        const accountNames = Object.keys(accountData)
        for (index in accountNames) {
            account = accountNames[index]
            console.log(pattern.test(account))
            if (pattern.test(account)) {
                accountList.push(account)
            }
        }
    } else {
        accountList = Object.keys(accountData)
    }
    for (index in accountList) {
        account = accountList[index]
        const listElement = createListElement(account, account)
        listElement.addEventListener('click', (event) => {
            const accountId = event['target']['id']
            changeSidebarSelection(accountId)
        })
        if (sidebarSelection === null) {
            changeSidebarSelection(account)
            sidebarSelection = listElement
            selectedAccountId = account
        }
    }
}

function createListElement(id, text) {
    const listItem = document.createElement('li')
    const listText = document.createTextNode(text)
    listItem.setAttribute('id', id)
    listItem.appendChild(listText)
    sidebar.appendChild(listItem)
    return listItem
}

function changeSidebarSelection(accountName) {
    // Handle the click on a sidebar item
    // Changes the password view to match the data from the selected account
    const selectedAccount = document.getElementById(accountName)
    if (sidebarSelection) {
        sidebarSelection.setAttribute('class', '')
    }
    selectedAccount.setAttribute('class', 'active')
    sidebarSelection = selectedAccount
    selectedAccountId = accountName
    updatePasswordView(accountName)
}

function updatePasswordView(accountName) {
    console.log('update ' + accountName)
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
    accountTitle.innerHTML = accountName

    const usernameBox = document.getElementById('username')
    if (username) {
        usernameBox.value = username
    } else {
        usernameBox.value = ''
    }
    const passwordBox = document.getElementById('password')
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

function initialisePasswordView() {
    // Create the empty form elements, ready to display account information
    const passwordSection = document.getElementById('passwordView')

    const title = document.createElement('h1')
    const titleText = document.createTextNode('')
    title.setAttribute('id', 'title')
    title.setAttribute('value', '')
    title.appendChild(titleText)
    passwordSection.appendChild(title)

    passwordSection.appendChild(document.createElement('hr'))

    const usernameLabel = document.createElement('label')
    const usernameLabelText = document.createTextNode('Username:')
    usernameLabel.setAttribute('for', 'username')
    usernameLabel.appendChild(usernameLabelText)
    passwordSection.appendChild(usernameLabel)

    const usernameBox = document.createElement('input')
    usernameBox.setAttribute('name', 'username')
    usernameBox.setAttribute('type', 'text')
    usernameBox.setAttribute('value', '')
    usernameBox.setAttribute('id', 'username')
    usernameBox.setAttribute('disabled', 'true')
    passwordSection.appendChild(usernameBox)

    const passwordLabel = document.createElement('label')
    const passwordLabelText = document.createTextNode('Password:')
    passwordLabel.setAttribute('for', 'password')
    passwordLabel.appendChild(passwordLabelText)
    passwordSection.appendChild(passwordLabel)

    const passwordBox = document.createElement('input')
    passwordBox.setAttribute('name', 'password')
    passwordBox.setAttribute('type', 'password')
    passwordBox.setAttribute('value', '')
    passwordBox.setAttribute('id', 'password')
    passwordBox.setAttribute('disabled', 'true')
    passwordSection.appendChild(passwordBox)

    const hideButton = document.createElement('button')
    const hideButtonText = document.createTextNode('Show Password')
    hideButton.appendChild(hideButtonText)
    hideButton.setAttribute('id', 'hideButton')
    hideButton.addEventListener('click', () => {
        showHidePassword()
    })
    passwordSection.appendChild(hideButton)

    const copyButton = document.createElement('button')
    const copyButtonText = document.createTextNode('Copy Password')
    copyButton.appendChild(copyButtonText)
    copyButton.setAttribute('id', 'copyButton')
    copyButton.addEventListener('click', () => {
        const toCopy = document.getElementById('password').value
        console.log(toCopy)
        window.electronAPI.copyToClipboard(toCopy)
    })
    passwordSection.appendChild(copyButton)

    const urlLabel = document.createElement('label')
    const urlLabelText = document.createTextNode('Website Address:')
    urlLabel.setAttribute('for', 'url')
    urlLabel.appendChild(urlLabelText)
    passwordSection.appendChild(urlLabel)

    const urlBox = document.createElement('input')
    urlBox.setAttribute('name', 'url')
    urlBox.setAttribute('type', 'url')
    urlBox.setAttribute('id', 'url')
    urlBox.setAttribute('disabled', 'true')
    passwordSection.appendChild(urlBox)

    const notesLabel = document.createElement('label')
    const notesLabelText = document.createTextNode('Notes:')
    notesLabel.setAttribute('for', 'notes')
    notesLabel.appendChild(notesLabelText)
    passwordSection.appendChild(notesLabel)

    const notes = document.createElement('textarea')
    notes.setAttribute('id', 'notes')
    notes.setAttribute('name', 'notes')
    notes.setAttribute('readonly', 'true')
    passwordSection.appendChild(notes)

    const passwordFooter = document.createElement('footer')
    const editButton = document.createElement('button')
    const editButtonText = document.createTextNode('Edit')
    editButton.addEventListener('click', () => {
        window.electronAPI.openEditor(selectedAccountId)
    })
    editButton.appendChild(editButtonText)
    passwordFooter.appendChild(editButton)
    passwordSection.appendChild(passwordFooter)
}
