const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')
const Store = require('electron-store')
const https = require('https')
const crypto = require('crypto')

const storage = new Store()
console.log(storage.get('logged-in'))
var iCounter = 0

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 500,
        minHeight: 300,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'hiddenInset'
    })
    win.webContents.openDevTools()
    
    if (storage.get('logged-in')) { 
        win.loadFile(path.join(__dirname, 'unlock.html'))
        win.webContents.on('did-finish-load', () => {
            userEmail = storage.get('userEmail')
            win.webContents.send("setWelcomeEmail", userEmail)
        })
    } else {
        win.loadFile(path.join(__dirname, 'login.html')) 
    }
}


app.whenReady().then(() => {
    ipcMain.handle('authenticate', authenticateUser)
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

function getSalt(email, password) {
    const toSend = JSON.stringify({
        "email": email,
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

    callback = function (response) {
        var str = "";
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            if (str != "false") {
                console.log('Salt Obtained: ' + str)
                checkCredentials(str, email, password)
                return true
            }
            else {
                console.log(str + '\nSalt not Obtained')
                storage.set('logged-in',false);
            }
        })
    }
    var req = https.request(options, callback);
    req.write(toSend);
    req.end();
}
//=====================================================================
function checkCredentials(salt, email, password) {
    /*
    Method takes in user salt, email and password.
    Generates hashed password and sends off to server along with email.
    If match what's in database, set login status to true
    else returns false.
    */
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
            if (str == "true") {
                console.log(str + '\nUser Verified')
                storage.set('logged-in', true)
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