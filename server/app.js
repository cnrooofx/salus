//const mongoose = require('mongoose');
var crypto = require('crypto');
//const { application } = require('express');
const https = require('https')

function set_password(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,`sha512`).toString(`hex`);
    const data = JSON.stringify({
        "name":salt,
        "password":hash
    })
    post_to_server(data)
}


function post_to_server(info){
    const data = info
    const options = {
        hostname: 'www.salussecurity.live',
        port: 5000,
        path: '/users',
        method: 'POST',
        headers: {
            'Content-Type': 'application/JSON',
            'Content-Length': data.length
        }

    }
    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            process.stdout.write(d)
        })
    })

    req.on('error', error => {
        console.error(error)
    })

    req.write(data)
    req.end()
}

set_password('12345')