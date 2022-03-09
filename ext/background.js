var local = (function(){

  var setData = function(key,obj){
      var values = JSON.stringify(obj);
      console.log(values);
      chrome.storage.sync.set({key:values}, function() {
        console.log('Settings saved');
      });
  }

  var getData = function(key){
    chrome.storage.sync.get(key, function(items) {
      console.log(items);
      console.log('Settings retrieved', items);
    });
  }
  return {set:setData,get:getData}
})();

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

postData('http://salussecurity.live:5000/passwords', { "id":54})
.then(data => {
    console.log(data)
    local.set('pass',data);
    console.log("in storage");
    local.get('pass');
    });

