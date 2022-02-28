// Initialize button with user's preferred color
let loginBut = document.getElementById("loginBut");

chrome.storage.sync.get("color", ({ color }) => {
  loginBut.style.backgroundColor = color;
});
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

function changePopup(){
    chrome.browserAction.setPopup({
       popup:"main.html"
    });
}

loginBut.addEventListener("click", async () => {

    postData('http://salussecurity.live:5000/login', { "email":"aidan@u1cc.ie","pass": "fuwbfuwbfuwb"})
  .then(data => {
    if (data != false){
        document.getElementById("p1").innerHTML = data // JSON data parsed by `data.json()` call
        changePopup();
    }
    else {
        document.getElementById("p1").innerHTML = "False"
    }
  });
    });
  

  // The body of this function will be executed as a content script inside the
  // current page
  function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
    });
  }