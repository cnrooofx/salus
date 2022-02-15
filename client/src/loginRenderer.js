const button = document.getElementById('btn1')

button.addEventListener('click', async () => {
    const email = 'aidan@ucc.ie'
    const password = 'fuwbfuwbfuwb'
    console.log(email)
    const isAuth = await window.electronAPI.authenticateUser(email, password)
    console.log('result is:', isAuth)
})

const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')

btn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile()
    filePathElement.innerText = filePath
})