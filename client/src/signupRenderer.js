const form = document.getElementById('signup-form')

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password1').value
    const verify = document.getElementById('password2').value
    if (password == verify && password != '' && verify != '') {
        window.electronAPI.signup(email, password)
    } else {
        const errorBox = document.getElementById('error')
        errorBox.innerHTML = 'Passwords must match'
    }
})



