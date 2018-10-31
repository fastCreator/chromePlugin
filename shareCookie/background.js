chrome.cookies.onChanged.addListener((changeInfo) => {
  if (!window.config.domain || !window.config.url) {
    return
  }
  let uri = new URL(window.config.url)
  if (changeInfo.cookie.domain === window.config.domain) {
    let o = Object.assign({}, changeInfo.cookie)
    o.url = window.config.url
    o.domain = uri.hostname
    delete o.hostOnly
    delete o.session
    chrome.cookies.set(o, (cookie) => {
      console.log(cookie)
    })
  }
})