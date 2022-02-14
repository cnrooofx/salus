var crypto = require('crypto');
const https = require('https')
/*
Must add email and password checks, (well formed, password reqs etc...)
*/
function set_credentials(email, password) {
    /*
    Assumes good email and password
    If successfully added to database, returns true
    Else returns False.
    */

    this.email = email
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    const data = JSON.stringify({
        "email": email,
        "salt": salt,
        "pass": hash
    })
    post_to_server(data)
}


function post_to_server(info) {
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

    callback = function (response) {
        var str = "";
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            if (str == "true") {
                console.log("User Data Uploaded")
                return true;
            }
            else {
                console.log("Error In Uploading Data\n" + str)
                return false;
            }
        })
    }
    var req = https.request(options, callback);
    req.write(toSend);
    req.end();
}

set_credentials("conorbradley45@gmail.com", "1234")
