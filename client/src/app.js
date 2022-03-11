const path = require('path')
const { app, BrowserWindow, ipcMain, clipboard } = require('electron')
const Store = require('electron-store')
const https = require('https')
const crypto = require('crypto')
const generator = require('generate-password')

const storage = new Store()

let win
let child

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
	if (storage.get('logged-in')) {
		win.loadFile(path.join(__dirname, 'unlock.html'))
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
		const hasPassswords = storage.has('passwords')
		return new Promise((resolve, reject) => {
			if (hasPassswords) {
				const passwords = storage.get('passwords')
				if (Object.keys(passwords).length > 0) {
					resolve(passwords)
				} else {
					reject('empty passwords (safe to ignore)')
				}
			} else {
				reject('no passwords yet (safe to ignore)')
			}
		})
	})
	ipcMain.on('updatePasswords', (event, updatedPasswords) => {
		storage.set('passwords', updatedPasswords)
		sendData()
		child.close()
		win.reload()
	})
	ipcMain.on('storeID', (event, id) => {
		storage.set('usr_data', id)
	})
	ipcMain.handle('login', (event, email, password) => {
		console.log('HERE')
		login(email, password)
	})
	ipcMain.handle('signup', (event, email, password) => {
		console.log('THERE')
		signup(email, password)
	})
	ipcMain.handle('getUserData', () => {
		return Promise.resolve(storage.get('usr_data'))
	})
	ipcMain.on('copyToClipboard', (event, data) => clipboard.writeText(data))
	createWindow()
})


app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.on('quit', () => {
	storage.delete('passwords')
})

async function authenticateUser(event, email, password) {
	login(email, password)
	const loginStatus = storage.get('logged-in', false)
	if (loginStatus) {
		storage.set('userEmail', email)
	} else {
		console.log("login error")
	}
	return loginStatus
}

//=====================================================================
//User Authentication + Login
//=====================================================================
//post to server
async function post_to_server(serverPath,info) {
	return new Promise(async (resolve, reject) => {
		const toSend = info
		var options = {
			hostname: 'www.salussecurity.live',
			port: 5443,
			path: serverPath,
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
					// console.log("Success")
					resolve(str)
				}
				else {
					// console.log("Error In Uploading Data " + str)
					reject("error")
				}
			})
		}
		var req = https.request(options, callback);
		req.write(toSend);
		req.end();
	})
}


function signup(email, pass) {
	salt = crypto.randomBytes(16).toString('hex');
	hash = crypto.pbkdf2Sync(pass, this.salt, 1000, 64, `sha512`).toString(`hex`);
	key = generate_key(hash,salt)
	const iv = crypto.randomBytes(16);
	const data = JSON.stringify({
		"email": email,
		"salt": salt,
		"pass": hash,
		"key": key,
		"iv": iv
	})
	post_to_server('/signup', data)
	.then((data) => {
		if (data == "true"){
			console.log('yes');
			win.loadFile(path.join(__dirname, 'login.html'))
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
function login(email, pass) {
	const emailString = JSON.stringify({ "email": email })
	post_to_server('/salt', emailString).then(
		(data) => {
			return new Promise((resolve, reject) => {
				if (data != "false") {
					resolve(verify(email, pass, data))
				}
				else {
					resolve(false)
				}
			})
		
		}, (error) => console.log(error))
}


/*
Method takes in user salt, email and password.
Generates hashed password and sends off to server along with email.
If match what's in database, set login status to true
else returns false.
*/

async function verify(email,pass,salt){
	console.log('verifying')
	hash = crypto.pbkdf2Sync(pass, salt, 1000, 64, `sha512`).toString(`hex`);
	post_to_server('/login', JSON.stringify({"email":email,"pass":hash}))
		.then((data) => {
			if (data != 'false') {
				storage.set('logged-in', true)
				storage.set('usr_data', data)
				getData()
				win.loadFile(path.join(__dirname, 'main.html'))
				return true
			}
			return false
		}, (error) => console.log(error))
	
	return false
}

function generatePassword(length = 10, numbers = false, symbols = false) {
	var password = generator.generate({
		length: length,
		numbers: numbers,
		symbols: symbols
	})
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
	const data = JSON.parse(storage.get('usr_data'));
	const toSend = JSON.stringify({
		"id": data['_id']
	})
	var options = {
		host: 'www.salussecurity.live',
		port: 5443,
		path: '/passwords',
		method: 'POST',
		headers: {
			'Content-Type': 'application/JSON',
			'Content-Length': toSend.length
		}
	};
	
	callback = function (response) {
		//console.log("djhge")
		var str = "";
		response.on('data', function (chunk) {
			str += chunk;
		});
		response.on('end', function () {
			if (str != "") {
				console.log(str)
				storage.set('passwords',JSON.parse(str)["pass"])
				win.reload()
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
	const data = JSON.parse(storage.get('usr_data'));
	const toSend = JSON.stringify({
		"id": data['_id'],
		"pass": storage.get('passwords')
	})
	console.log()
	var options = {
		host: 'www.salussecurity.live',
		port: 5443,
		path: '/password',
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
function generate_key(password,salt){
	return crypto.scryptSync(password, salt, 24);
}

//Encrypts and returns a message
//Generates key and gets iv from user_data in electron storage
function encrypt(msg){
	const data = JSON.parse(storage.get('usr_data'));
	const iv = data['iv'];
	const key = generate_key(data['password'],data['salt']);
	const algorithm = 'aes-192-cbc';
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	cipher.write(msg);
	cipher.end();
	let out = '';
	out += cipher.read().toString('hex');
	return out;
}

//Decrypts and returns encrypted message
//Generates key and gets iv from user_data in electron storage
function decrypt(encrypted_msg){
	const data = JSON.parse(storage.get('usr_data'));
	const iv = data['iv'];
	const key = generate_key();
	const algorithm = 'aes-192-cbc';
	const decipher = crypto.createDecipheriv(algorithm, key, iv)
	decipher.write(encrypted_msg, 'hex')
	decipher.end();
	let out = '';
	out += decipher.read().toString('utf8');
	return out;
}

//=====================================================================


//add key, iv to database
//add key, iv to user data package being sent back on login
//add update passwords request to server... takes id and new password package
