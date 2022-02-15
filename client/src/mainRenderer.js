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

if (Object.keys(accountData) == 0) {
    console.log("empty")
    const listElement = createListElement("empty", "No Accounts Yet")
    sidebar.appendChild(listElement)
} else {
    var idCounter = 0

    for (var account in accountData) {
        const listElement = createListElement("account" + idCounter, account)
        sidebar.appendChild(listElement)
        listElement.onclick = sidebarClickHandler(event)
    }
}

function createListElement(id, text) {
    const listItem = document.createElement('li')
    const listText = document.createTextNode(text)
    listItem.setAttribute("id", id)
    listItem.appendChild(listText)

    return listItem
}

function sidebarClickHandler(event) {
    console.log(event)
}
