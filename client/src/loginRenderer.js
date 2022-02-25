const button = document.getElementById('login-button')

button.addEventListener('click', async () => {
    const email = 'aidan@ucc.ie'
    const password = 'fuwbfuwbfuwb'
    console.log(email)
    const isAuth = await window.electronAPI.authenticateUser(email, password)
    console.log('result is:', isAuth)
})