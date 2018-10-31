chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    if (window.config.cross) {
      let resh = details.responseHeaders
      resh.push({
        name: 'Access-Control-Allow-Origin',
        value: '*'
      })
      return {
        responseHeaders: resh,
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]
)