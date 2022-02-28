const button = document.getElementById('login-button')

button.addEventListener('click', async () => {
    const email = 'conorbradley49@gmail.com'
    const password = '1234'
    console.log(email)
    const isAuth = await window.electronAPI.authenticateUser(email, password)
})
window.electronAPI.setWelcomeEmail((event, email) => {
    document.querySelector('#email').setAttribute('value', email)
})