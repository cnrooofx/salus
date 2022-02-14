const button = document.getElementById('btn')

button.addEventListener('click', () => {
    const title = 'this is the new title'
    window.electronAPI.setTitle(title)
})
