const form = document.getElementById('signup-form')
console.log('hii')
form.addEventListener('submit', (event) => {
    event.preventDefault()
    console.log('hi')
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    window.electronAPI.signup(email, password)
})



