const path = require('path')
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const Store = require('electron-store')

const storage = new Store()
storage.set('logged-in', false)

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.webContents.openDevTools()
    win.loadFile(path.join(__dirname, 'login.html'))
    // storage.get('logged-in') ? 
    //     win.loadFile(path.join(__dirname, 'unlock.html')) :
    //     win.loadFile(path.join(__dirname, 'login.html'))
}

app.whenReady().then(() => {
    // ipcMain.on('set-title', handleSetTitle)
    // ipcMain.handle('openFile', handleFileOpen)
    ipcMain.handle('authenticate', getSalt)
    createWindow()
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
        return
    } else {
        return filePaths[0]
    }
}

// function handleSetTitle(event, title) {
//     const webContents = event.sender
//     const win = BrowserWindow.fromWebContents(webContents)
//     if (storage.get('logged-in')) {
//         title = 'already logged in' 
//     } else {
//         storage.set('logged-in', true)
//     }
//     win.setTitle(title)
// }

async function getSalt(event, details) {
    console.log('hello');
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
                return checkCredentials(str, email, password);
            }
            else {
                console.log(str + '\nSalt not Obtained')
                return false;
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
    If match what's in database, returns true
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
                return true;
            }
            else {
                console.log(str + '\nUser Rejected')
                return false;
            }
        })
    }
    var req = https.request(options, callback);
    req.write(toSend);
    req.end();
}