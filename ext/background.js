let color = '#3aa757';

chrome.action.setPopup({popup: "main.html"})

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

function login_success() {
  chrome.action.setPopup({popup: "main.html"});
}

function login_failure() {
  chrome.action.setPopup({popup: "popup.html"});
}