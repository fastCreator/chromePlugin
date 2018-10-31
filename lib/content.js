// 向页面注入JS
function injectCustomJs(jsPath) {
  jsPath = jsPath || 'js/inject.js';
  var temp = document.createElement('script');
  temp.setAttribute('type', 'text/javascript');
  temp.src = chrome.extension.getURL(jsPath);
  temp.onload = function () {
    this.parentNode.removeChild(this);
  };
  document.head.appendChild(temp);
}

function message(msg) {
  let msg = document.createElement('div')
  msg.innerText = msg
  document.body.prepend('msg')
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let cmd = request.cmd
  if (cmd) {
    window[cmd](request.value)
  }
});