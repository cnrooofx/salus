const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')
const Store = require('electron-store')
const https = require('https')
const crypto = require('crypto')
var generator = require('generate-password')

const storage = new Store()
console.log(storage.get('logged-in'))
var iCounter = 0

// storage.set('passwords', {'account1': {
//     'username': 'username',
//     'password': 'password',
//     'url': 'url',
//     'notes': 'notes'
// }})
let win
let child
ipcMain.on('storeID') = (event,id) =>{
    storage.set('usr_data', id)
}

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 500,
        minHeight: 300,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'hiddenInset',
        show: false
    })
    // win.webContents.openDevTools()
    
    // win.loadFile(path.join(__dirname, 'main.html'))
    if (storage.get('logged-in')) { 
        win.loadFile(path.join(__dirname, 'unlock.html'))
        win.webContents.on('did-finish-load', () => {
            let userEmail = storage.get('userEmail')
            win.webContents.send("setWelcomeEmail", userEmail)
        })
    } else {
        win.loadFile(path.join(__dirname, 'login.html')) 
    }
    win.once('ready-to-show', () => win.show())
}

function createModal() {
    child = new BrowserWindow({
        parent: win,
        modal: true,
        width: 550,
        height: win.height < 500 ? win.height * 0.7 : 500,
        maxHeight: 500,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // child.webContents.openDevTools()
    child.loadFile(path.join(__dirname, 'editor.html'))
    child.once('ready-to-show', () => child.show())
}

app.whenReady().then(() => {
    ipcMain.handle('authenticate', authenticateUser)
    ipcMain.on('openEditor', (event, accountId) => {
        createModal()
        child.webContents.send('accountId', accountId)
    })
    ipcMain.on('generatePassword', (event, length, numbers, symbols) => {
        generatePassword(length, numbers, symbols)
    })
    ipcMain.handle('accessPasswords', () => {
        return Promise.resolve(storage.get('passwords'))
    })
    ipcMain.handle('updatePasswords', () => {
        return Promise.resolve(storage.set('passwords', updatedPasswords))
    })
    createWindow()
})


app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

async function authenticateUser(event, email, password) {
    getSalt(email, password)
    if (storage.get('logged-in') == false){
        console.log("login error")
        return false
    }
    storage.set('userEmail', email)
    return true
}

//=====================================================================
//User Authentication + Login
//=====================================================================
//post to server
async function post_to_server(path,info) {
    return new Promise(async (resolve, reject) =>{
        const toSend = info
        var options = {
            hostname: 'www.salussecurity.live',
            port: 5443,
            path: path,
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
                if (str != "false") {
                    console.log("Success")
                    resolve(str)
                }
                else {
                    console.log("Error In Uploading Data " + str)
                    reject("error")
                }
            })
        }
        var req = https.request(options, callback);
        req.write(toSend);
        req.end();
    })
}


function signUP(email,pass) {
    salt = crypto.randomBytes(16).toString('hex');
    hash = crypto.pbkdf2Sync(pass, this.salt, 1000, 64, `sha512`).toString(`hex`);
    const iv = crypto.randomBytes(16);
    const data = JSON.stringify({
        "email": email,
        "salt": salt,
        "pass": hash,
        "iv": iv
    })
   post_to_server('/signup', data)
  .then((data) => {
    if (data == "true"){
        console.log('yes');
        //redirect
        }
    else{
        console.log('no');
        console.log(data);
        }
  }, (reason)=>{console.log(reason)});
  }
/*
Checks for users email in database and returns salt value. (If email exists)
Passes email, password and salt to check credentials to validate password.
*/
function logIn(email,pass) {
    post_to_server('/salt', JSON.stringify({"email":email}))
    .then((data) => {
      if (data != "false"){
        console.log('woo');
        console.log(data);
        verify(email,pass,data);
      }
      else{
      }
    }, (reason)=>{console.log(reason)}) ;
    }


/*
Method takes in user salt, email and password.
Generates hashed password and sends off to server along with email.
If match what's in database, set login status to true
else returns false.
*/

async function verify(email,pass,salt){
  hash = crypto.pbkdf2Sync(pass, salt, 1000, 64, `sha512`).toString(`hex`);
  post_to_server('/login', JSON.stringify({"email":email,"pass":hash}))
.then((data) => {
  if (data != "false"){
        console.log("WAHOO")
        //redirect
  }
  else{
    console.log(data + "bedjkbdjb")
  }
},(reason)=>{console.log(reason)});
}

function checkCredentials(salt, email, password) {
    hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    console.log("Hashed Password: " + hash);
    const toSend = JSON.stringify({
        "email": email,
        "pass": hash
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

    callback = function (response) {
        var str = "";
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            if (str != "false") {
                console.log('User Verified');
                console.log(str);
                storage.set('logged-in', true);
                storage.set('usr_data', str);
            }
            else {
                console.log(str + '\nUser Rejected')
                storage.set('logged-in', false)
            }
        })
    }
    var req = https.request(options, callback);
    req.write(toSend);
    req.end();
}

function generatePassword(length = 10, numbers = false, symbols = false) {
    var password = generator.generate({
        length: length,
        numbers: numbers,
        symbols: symbols
    })
    console.log(password)
    child.webContents.send('insertPassword', password)
}

//=====================================================================
// Getting and Sending user data to server
//=====================================================================
/*
Method takes in user id.
If match what's in database, return user's id + data.
*/
function getData() {
    const data = JSON.parse(storage.get('user_data'));
    const toSend = JSON.stringify({
        "id": data['_id']
    })
    var options = {
        host: 'www.salussecurity.live',
        port: 5443,
        path: '/password',
        method: 'GET',
        headers: {
            'Content-Type': 'application/JSON',
            'Content-Length': toSend.length
        }
    };

    callback = function (response) {
        var str = "";
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            if (str != "") {
                console.log(str)
                storage.set('passwords',JSON.parse(str)["pass"])
            }
            else {
                console.log(str + '\nUser Rejected')
            }
        })
    }
    var req = https.request(options, callback);
    req.write(toSend);
    req.end();
}

/*
Method takes in user id.
If match what's in database, updates user's data.
*/
function sendData() {
    const data = JSON.parse(storage.get('user_data'));
    const toSend = JSON.stringify({
        "id": data['_id'],
        "pass": encrypt(storage.get('passwords'),generate_key(data['password'],data['salt']),data['iv'])
    })
    var options = {
        host: 'www.salussecurity.live',
        port: 5443,
        path: '/send_password',
        method: 'POST',
        headers: {
            'Content-Type': 'application/JSON',
            'Content-Length': toSend.length
        }
    };

    callback = function (response) {
        var str = "";
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            if (str != "") {
                console.log(str)
                storage.set('passwords',str["pass"])
            }
            else {
                console.log(str + '\nUser Rejected')
            }
        })
    }
    var req = https.request(options, callback);
    req.write(toSend);
    req.end();
}

//=====================================================================
//Encryption & Decryption Of User Passwords + Key generation
//=====================================================================
//Uses user's hashed password and salt to generate a symmetric key.
function generate_key(){
    const data = JSON.parse(storage.get('user_data'))
    const password = data['password'];
    const salt = data['salt'];
    const key = crypto.scryptSync(password, salt, 24);
    return key
}

//Encrypts and returns a message
//Generates key and gets iv from user_data in electron storage
function encrypt(msg){
    const data = JSON.parse(storage.get('user_data'));
    const iv = data['iv'];
    const key = generate_key();
    const algorithm = 'aes-192-cbc';
    const cipher = crypto.createCipheriv(algorithm,key,iv);
    cipher.write(msg);
    cipher.end();
    out="";
    out += cipher.read().toString('hex');
    //console.log(out);
    return out;
}

//Decrypts and returns encrypted message
//Generates key and gets iv from user_data in electron storage
function decrypt(encrypted_msg){
    const data = JSON.parse(storage.get('user_data'));
    const iv = data['iv'];
    const key = generate_key();
    const algorithm = 'aes-192-cbc';
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    decipher.write(encrypted_msg, 'hex')
    decipher.end();
    out = "";
    out += decipher.read().toString('utf8');
    return out;
}

//=====================================================================


//add key, iv to database
//add key, iv to user data package being sent back on login
//add update passwords request to server... takes id and new password package
