const button = document.getElementById('login-button')

button.addEventListener('click', async () => {
    const email = document.getElementById("email").value()
    const email = document.getElementById("password").value()
    console.log(email)
    await window.electronAPI.authenticateUser(email, password)
    window.electronAPI.StoreID(id)
})
