function showModalAll(title, content, showCancel, cancelText, cancelColor, confirmText, confirmColor) {  
  wx.showModal({
    title: title,
    content: content,
    showCancel: showCancel,
    cancelText: cancelText,
    cancelColor: cancelColor,
    confirmText: confirmText,
    confirmColor: confirmColor,
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}

function showModal(title){
  showModalAll(title, '', false, '', '', '', '')
}

function showModalWithContent(title, content){
  showModalAll(title, content, false, '', '', '', '')
}

function showToastWithDuration(title, second){
  wx.showToast({
    title: title,
    duration: second*1000
  })
}

function showToast(title) {
  wx.showToast({
    title: title
  })
}

function getStorage(key, callback){
  wx.getStorage({
    key: key,
    success: function (res) {
      callback(res);
    }
  })
}

function setStorage(key, data){
  wx.setStorage({
    key: key,
    data: data
  })
}

module.exports = {
  showModal: showModal,
  showModalWithContent: showModalWithContent,
  showToast: showToast,
  showToastWithDuration: showToastWithDuration,
  getStorage: getStorage,
  setStorage: setStorage
}