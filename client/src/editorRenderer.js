const cancelButton = document.getElementById('cancel')

cancelButton.addEventListener('click', () => {
    window.close()
})

const body = document.querySelector('body')
if (body.hasAttribute('id')) {
    const accountId = body.getAttribute('id')
    console.log(accountId)
}
