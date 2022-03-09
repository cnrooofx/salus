var accountData;
var isPaused = true

function getData(key) {
    isPaused = true;
    chrome.storage.sync.get(key, function(items) {
        console.log('hello')
      return items;
    
    });
    isPaused = false;
}
console.log('fnewjfweif wuif"')
const sidebar = document.getElementById('sidebar')
var sidebarSelection = null
var selectedAccountId = null

// const newItemButton = document.getElementById('newButton')
// newItemButton.addEventListener('click', () => {
//     window.electronAPI.openEditor()
// })
accountData= {
    "google":{
        "user":"example",
        "pass":"1234",
        "url":'google.com',
        "notes":"my gmail account"
    }
}
if (Object.keys(accountData).length === 0) {
    createListElement('empty', 'No Accounts Yet')
} else {
    console.log(Object.keys(accountData))
    initialisePasswordView()

    for (var account in accountData) {
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

function showHidePassword() {
    const passwordBox = document.getElementById('passwordBox')
    const type = passwordBox.getAttribute('type')
    if (type === 'password') {
        passwordBox.setAttribute('type', 'text')
    } else {
        passwordBox.setAttribute('type', 'password')
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
    // Update the username, password fields to the specified account info
    const username = accountData[accountName]['user']
    const password = accountData[accountName]['pass']
    const url = accountData[accountName]['url']
    const notes = accountData[accountName]['notes']

    const accountTitle = document.getElementById('accountTitle')
    accountTitle.innerHTML = accountName

    const usernameBox = document.getElementById('usernameBox')
    usernameBox.setAttribute('value', username)

    const passwordBox = document.getElementById('passwordBox')
    passwordBox.setAttribute('value', password)

    const urlBox = document.getElementById('urlBox')
    urlBox.value = url

    const notesBox = document.getElementById('notesBox')
    notesBox.innerHTML = notes
}

function initialisePasswordView() {
    // Create the empty form elements, ready to display account information
    const passwordSection = document.getElementById('passwordView')

    const title = document.createElement('h1')
    const titleText = document.createTextNode('title')
    title.setAttribute('id', 'accountTitle')
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
    usernameBox.setAttribute('value', 'username123')
    usernameBox.setAttribute('id', 'usernameBox')
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
    passwordBox.setAttribute('value', 'passwordpassword')
    passwordBox.setAttribute('id', 'passwordBox')
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

    const urlLabel = document.createElement('label')
    const urlLabelText = document.createTextNode('Website Address:')
    urlLabel.setAttribute('for', 'url')
    urlLabel.appendChild(urlLabelText)
    passwordSection.appendChild(urlLabel)

    const urlBox = document.createElement('input')
    urlBox.setAttribute('name', 'url')
    urlBox.setAttribute('type', 'url')
    urlBox.setAttribute('id', 'urlBox')
    urlBox.setAttribute('disabled', 'true')
    passwordSection.appendChild(urlBox)

    const notesLabel = document.createElement('label')
    const notesLabelText = document.createTextNode('Notes:')
    notesLabel.setAttribute('for', 'notes')
    notesLabel.appendChild(notesLabelText)
    passwordSection.appendChild(notesLabel)

    const notes = document.createElement('textarea')
    notes.setAttribute('name', 'notes')
    notes.setAttribute('id','notesBox')
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


// var accountData = {}


