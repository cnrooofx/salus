const form = document.getElementById('unlock-form')
var userEmail

form.addEventListener('submit', () => {
    const password = document.getElementById('password').value
    window.electronAPI.login(userEmail, password)
})

accessUserData().then((email) => {
    userEmail = email
})

async function accessUserData() {
    const userData = await window.electronAPI.getUserData()
    return new Promise((resolve, reject) => {
        if (userData) {
            const userDataJSON = JSON.parse(userData)
            resolve(userDataJSON['email'])
        } else {
            reject('No accounts')
        }
    })
}
