window.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-form')
    loginButton.addEventListener('submit', login, 'false')

    function login(event) {
        event.preventDefault()
        const email = document.getElementById('email').value
        const loginText = document.getElementById('login-text')
        console.log("hey")
        loginText.innerHTML = email
    }
})
