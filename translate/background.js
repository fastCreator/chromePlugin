const appid = '20181022000222813'
const secretKey = 'W6u7jj0UweUAMp7rlKj9'
chrome.extension.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (port.name === 'translate') {
      translate(port, msg.text, msg.options, msg.type)
    }
  });
});
function translate(port, q, options, type) {
  var salt = (new Date).getTime()
  let sign = MD5(appid + q + salt + secretKey)
  ajax('https://api.fanyi.baidu.com/api/trans/vip/translate',
    { method: 'post', type: 'form', body: Object.assign({ q: q, from: 'auto', to: 'en', appid: appid, salt: salt, sign: sign }, options) }).then(data => {
      port.postMessage(Object.assign({ type: type }, data))
    })
}