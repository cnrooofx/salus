const form = document.getElementById('login-form')

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    window.electronAPI.login(email, password)
})
