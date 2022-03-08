var crypto = require('crypto');
const https = require('https');

const form = document.getElementById('signup-form')

button.addEventListener('submit', async () => {
    const email = document.getElementById("email").value
    const pass = document.getElementById("password").value
    await window.electronAPI.signup(email, password)
    
})



