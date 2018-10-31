let hastranslate = false
chrome.storage.sync.get('config', (d) => {
  if (d.config.translate) {
    translate(d.config.translate)
  }
})

function translate(v) {
  hastranslate = v
  if (v) {
    let node = document.createElement('div')
    node.id = 'tools-translate'
    node.innerHTML = `
    <div class="selectDiv">选中译文:<span class="text"></span></div>
    <div class="hy">中英互译:<input class="zh" data-to="en" placeholder="中文">&lt;=&gt;<input class="en" data-to="zh" placeholder="英文">
    `
    document.body.prepend(node)
    let inputs = node.querySelectorAll('.hy input')
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].onblur = (e) => {
        let v = e.target.value
        if (v) {
          sendMsg({ text: e.target.value, options: { to: e.target.dataset.to }, type: e.target.dataset.to });
        }
      }
    }
  } else {
    let node = document.getElementById('tools-translate')
    if (node) {
      document.body.removeChild(node)
    }
  }
}

var port = chrome.extension.connect({ name: "translate" });
port.onMessage.addListener(function (msg) {
  let str = ''
  msg.trans_result.forEach(it => {
    str += it.dst
  })
  let type = msg.type
  if (type === 'body') {
    document.body.innerHTML = str
  } else if (type === 'select') {
    document.querySelector('#tools-translate .text').innerText = str
  } else {
    document.querySelector(`#tools-translate .${msg.type}`).value = str
  }
});
select(document, function (text, target) {
  sendMsg({ text: text, options: { to: 'zh' }, type: 'select' });
});
// 跨浏览器选中文字事件 
function select(o, fn) {
  o.onmouseup = function (e) {
    var event = window.event || e;
    var target = event.srcElement ? event.srcElement : event.target;
    if (/input|textarea/i.test(target.tagName) && /firefox/i.test(navigator.userAgent)) {
      //Firefox在文本框内选择文字 
      var staIndex = target.selectionStart;
      var endIndex = target.selectionEnd;
      if (staIndex != endIndex) {
        var sText = target.value.substring(staIndex, endIndex);
        fn(sText, target);
      }
    }
    else {
      //获取选中文字 
      var sText = document.selection == undefined ? document.getSelection().toString() : document.selection.createRange().text;
      if (sText != "") {
        //将参数传入回调函数fn 
        fn(sText, target);
      }
    }
  }
}

function sendMsg(obj) {
  if (hastranslate) {
    port.postMessage(obj);
  }
}