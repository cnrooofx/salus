var crypto = require('crypto');
const https = require('https')
//=====================================================================
   /*
    Method takes in user email and password.
    Communicates with server to obtain this users salt value
    If email exists in database, salt value returned.
    Salt, email and password passed onto checkCredentials() to authenticate password.
    If email not in database, returns false.
    */
function getSalt(email,password){
    const toSend = JSON.stringify({
        "email":email,
    })

    var options = {
        host: 'www.salussecurity.live',
        port: 5443,
        path: '/salt',
        method: 'POST',
        headers: {
            'Content-Type': 'application/JSON',
            'Content-Length': toSend.length
        }
    };

    callback = function(response){
        var str = "";
        response.on('data', function(chunk){
            str+=chunk;
        });
        response.on('end', function(){
            if (str!="false"){
            console.log('Salt Obtained: '+str)
            checkCredentials(str,email,password);
            }
            else{
                console.log(str+'\nSalt not Obtained')
                return false;
            }
        })
    }
    var req = https.request(options,callback);
    req.write(toSend);
    req.end();
}
//=====================================================================
function checkCredentials(salt,email,password){
    /*
    Method takes in user salt, email and password.
    Generates hashed password and sends off to server along with email.
    If match what's in database, returns true
    else returns false.
    */
    hash = crypto.pbkdf2Sync(password,salt,1000,64,`sha512`).toString(`hex`);
    console.log("Hashed Password: "+hash);
    const toSend = JSON.stringify({
        "email":email,
        "pass":password 
    })
    var options = {
        host: 'www.salussecurity.live',
        port: 5443,
        path: '/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/JSON',
            'Content-Length': toSend.length
        }
    };

    callback = function(response){
        var str = "";
        response.on('data', function(chunk){
            str+=chunk;
        });
        response.on('end', function(){
            if (str=="true"){
                console.log(str+'\nUser Verified')
                return true;
            }
            else{
                console.log(str+'\nUser Rejected')
                return false;
            }
        })
    }
    var req = https.request(options,callback);
    req.write(toSend);
    req.end();
}

getSalt("aidan@ucc.ie","fuwbfuwbfuwb")