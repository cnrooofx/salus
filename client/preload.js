window.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementBy('login-form')
    loginButton.addEventListener('submit', login, 'false')

    function login(event) {
        event.preventDefault()
        const email = document.getElementById('email').value
        const loginText = document.getElementById('login-text')
        loginText.innerHTML = email
    }
})
