const form = document.getElementById('login-form')

form.addEventListener('submit', () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    window.electronAPI.login(email, password)
})
