const accountData = {
    "account1": {
        "user": "test@gmail.com",
        "pass": "*****"
    },
    "account2": {
        "user": "test2@gmail.com",
        "pass": "**********"
    },
    "account3": {
        "user": "test3@gmail.com",
        "pass": "*******************"
    }
}

const sidebar = document.getElementById('sidebar')
var sidebarSelection = null


if (Object.keys(accountData) == 0) {
    createListElement('empty', 'No Accounts Yet')
} else {
    initialisePasswordView()

    var idCounter = 0
    for (var account in accountData) {
        const listElement = createListElement('account' + idCounter, account)
        listElement.addEventListener('onclick', updatePasswordView)
        if (sidebarSelection == null) {
            listElement.setAttribute('class', 'active')
            updatePasswordView(account)
            sidebarSelection = listElement
        }
        idCounter++
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

function changeSidebarSelection(newElement) {
    sidebarSelection.setAttribute('class', '')
    newElement.setAttribute('class', 'active')
    sidebarSelection = newElement
}

function updatePasswordView(accountName) {
    const username = accountData[accountName]['user']
    const password = accountData[accountName]['pass']

    const accountTitle = document.getElementById('accountTitle')
    accountTitle.innerHTML = accountName

    const usernameBox = document.getElementById('usernameBox')
    usernameBox.setAttribute('value', username)

    const passwordBox = document.getElementById('passwordBox')
    passwordBox.setAttribute('value', password)
}

function initialisePasswordView() {
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

    const editButton = document.createElement('button')
    const editButtonText = document.createTextNode('Edit')
    editButton.appendChild(editButtonText)
    passwordSection.appendChild(editButton)
}
