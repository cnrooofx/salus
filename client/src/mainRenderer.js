const accountData = {
    "account1": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account2": {
        "user": "test2@gmail.com",
        "pass": "password"
    },
    "account3": {
        "user": "test3@gmail.com",
        "pass": "longest password"
    },
    "Salus": {
        "user": "admin@salussecurity.live",
        "pass": "123456789"
    },
    "Google": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "Facebook": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "Instagram": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "Twitter": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "Reddit": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "GitHub": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "UCC": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "Digital Ocean": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account4": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account5": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account6": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account7": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account8": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account9": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account10": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account11": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account12": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account13": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account14": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account15": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account16": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account17": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account18": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account19": {
        "user": "test@gmail.com",
        "pass": "short"
    },
    "account20": {
        "user": "test@gmail.com",
        "pass": "short"
    }
}
// const accountData = {}

const sidebar = document.getElementById('sidebar')
var sidebarSelection = null


if (Object.keys(accountData) == 0) {
    createListElement('empty', 'No Accounts Yet')
} else {
    initialisePasswordView()

    for (var account in accountData) {
        const listElement = createListElement(account, account)
        listElement.addEventListener('click', (event) => {
            const accountId = event['target']['id']
            changeSidebarSelection(accountId)
        })
        if (sidebarSelection == null) {
            changeSidebarSelection(account)
            sidebarSelection = listElement
        }
    }
}

function showHidePassword() {

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
    updatePasswordView(accountName)
}

function updatePasswordView(accountName) {
    // Update the username, password fields to the specified account info
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

    const hideLabel = document.createElement('label')
    const hideLabelText = document.createTextNode('Show Password:')
    hideLabel.setAttribute('for', 'hideButton')
    hideLabel.appendChild(hideLabelText)
    passwordSection.appendChild(hideLabel)

    const hideButton = document.createElement('input')
    hideButton.setAttribute('name', 'hideButton')
    hideButton.setAttribute('type', 'checkbox')
    // hideButton.setAttribute('onclick', )
    passwordSection.appendChild(hideButton)

    const editButton = document.createElement('button')
    const editButtonText = document.createTextNode('Edit')
    editButton.appendChild(editButtonText)
    passwordSection.appendChild(editButton)
}
