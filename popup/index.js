let bg = chrome.extension.getBackgroundPage();
let $inputs = document.getElementsByTagName('input')
for (let i = 0; i < $inputs.length; i++) {
  let $el = $inputs[i]
  let name = $el.dataset.name
  let cmd = $el.dataset.cmd
  let v = bg.config[name] || null
  let type = 'value'
  if ($el.type === 'checkbox') {
    type = 'checked'
  }
  $el[type] = v
  let fuc = (e) => {
    let v = e.target[type]
    bg.setConfig(name, v)
    if (cmd) {
      execCMD(cmd, v)
    }
  }
  $el.oninput = (e) => {
    fuc(e)
  }
}
let imgs = []

document.querySelector('.screenshot').onclick = () => {
  capture()
}

function deal(o) {
  var c = document.createElement("canvas");
  c.width = o.width
  c.height = o.height
  var ctx = c.getContext("2d");
  imgs.forEach(it => {
    let sx = it.img.width - it.width
    let sy = it.img.height - it.height
    let swidth = it.img.width
    let sheight = it.img.height
    let x = it.x
    let y = it.y
    let width = it.img.width
    let height = it.img.height
    ctx.drawImage(it.img, sx, sy, swidth, sheight, x, y, width, height);
  })
  imgs = []
  var url = c.toDataURL('image/png');
  this.downloadFile('网页截图.png', url);
}

function capture() {
  chrome.tabs.executeScript({ code: 'scrollY()' }, (o) => {
    setTimeout(() => {
      chrome.tabs.captureVisibleTab((dataUrl) => {
        o[0].url = dataUrl
        imgs.push(o[0])
        if (o[0].end) {
          chrome.tabs.executeScript({ code: 'setEnd()' })
          chrome.tabs.executeScript({ code: 'getWH()' }, (o) => {
            dealImgs(() => {
              deal(o[0])
            })
          })
        } else {
          capture()
        }
      })
    }, 50);
  })
}

function dealImgs(cb) {
  let ret = []
  let index = imgs.length
  imgs.forEach(it => {
    let img = new Image()
    img.src = it.url
    img.onload = () => {
      it.img = img
      ret.push(it)
      index--
      deal()
    }
  })
  function deal() {
    if (!index) {
      cb()
    }
  }
}

//下载
function downloadFile(fileName, content) {
  let aLink = document.createElement('a');
  let blob = this.base64ToBlob(content); //new Blob([content]);

  let evt = document.createEvent("HTMLEvents");
  evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);

  // aLink.dispatchEvent(evt);
  aLink.click()
}
//base64转blob
function base64ToBlob(code) {
  let parts = code.split(';base64,');
  let contentType = parts[0].split(':')[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;

  let uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

function execCMD(cmd, value) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { cmd: cmd, value: value }, function (response) {
    })
  })
}