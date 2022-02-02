//const mongoose = require('mongoose');
var crypto = require('crypto');
const { application } = require('express');
const https = require('https')

function set_password(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,`sha512`).toString(`hex`);
    post_to_server(this.hash,this.salt)
}

function post_to_server(hash,salt){
    const data = JSON.stringify({
        "hash":hash,
        "salt":salt
    })
    const options = {
        hostname: '',
        port: 0000,
        path: '',
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

console.log(set_password('12345'))