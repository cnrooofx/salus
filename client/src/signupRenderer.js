var crypto = require('crypto');
const https = require('https');

const button = document.getElementById('signup-button')

button.addEventListener('click', async () => {
    const email = document.getElementById("email").value
    const email = document.getElementById("password").value
    await window.electronAPI.authenticateUser(email, password)
    window.electronAPI.StoreID(id)
})


//const button = document.getElementById('signup-button')
//button.addEventListener('click', async () => {
//    const email = document.getElementById("email").value
//    const email = document.getElementById("password").value
//    console.log(email)
//    const isAuth = await window.electronAPI.set_credentials(email, password);
//})

/*
Must add email and password checks, (well formed, password reqs etc...)
*/
async function set_credentials(email, password) {
    /*
    Assumes good email and password
    If successfully added to database, returns true
    Else returns False.
    */

    salt = crypto.randomBytes(16).toString('hex');
    hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    const iv = crypto.randomBytes(16);
    const data = JSON.stringify({
        "email": email,
        "salt": salt,
        "pass": hash,
        "iv": iv
    })
    return data;
}


async function post_to_server(info) {
    const toSend = info
    var options = {
        hostname: 'www.salussecurity.live',
        port: 5443,
        path: '/signup',
        method: 'POST',
        headers: {
            'Content-Type': 'application/JSON',
            'Content-Length': toSend.length
        }

    }

    const callback = function (response) {
        var str = "";
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            if (str == "true") {
                console.log("User Data Uploaded")
                console.log(str)
                signUpStatus = true

            }
            else {
                console.log("Error In Uploading Data\n" + str)
                signUpStatus = false;
            }
        })
    }
    var req = https.request(options, callback);
    req.write(toSend);
}

console.log(set_credentials('email','password'))

