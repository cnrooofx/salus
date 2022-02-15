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
    var idCounter = 0
    for (var account in accountData) {
        const listElement = createListElement('account' + idCounter, account)
        listElement.addEventListener(onclick, event => {
            console.log(event)
        })
        if (sidebarSelection == null) {
            listElement.setAttribute('class', 'active')
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
