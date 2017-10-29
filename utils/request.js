var wxapi = require('./wxapi.js')
const config = require('../config')

function Request(url, method, data, callback, errorback) {

  wx.showLoading({
    title: '加载中',
  })
  var that = this;
  var sessionId = wx.getStorageSync("sessionId");
  //var sessionId = '745FBB2BFF3E80AFD502AAE94DB11D3A';
  console.log("sessionId:" + sessionId);
  // if (that.sessionId == null || that.sessionId == '') {
  //   // resetUserInfo(url, method, data, callback);
  // }
  // else {
  wx.request({
    url: url,
    method: method,
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': 'JSESSIONID=' + sessionId,
      'Cache-control': 'max-age=5'
    },
    success: function (res) {
      wx.hideLoading();
      console.debug("请求结果")
      console.debug(res)
      if (res.data.code == 0) {
        callback(res.data.data);
      }
      else if (res.data.code == 9999) {
        wxapi.showModal('网络异常，请稍候再试');
      } else if (res.data.code == 9998) {
        reLogin();
      } else if (errorback != 'undefined' && typeof errorback == "function") {
        errorback(res.data);
      } else {
        // wxapi.showModal('系统异常，请稍后再试~');
        var errMsg = res.data.msg;
        wx.showToast({
          title: errMsg,
        })
        // errorback(res.data);
      }
    },
    fail: function (res) {
      wx.hideLoading();
      wxapi.showModal('网络异常，请稍候再试');
    }
  })
}
// }

function reLogin() {
  var that = this;
  var domainName = config.domainName;
  var companyId = config.companyId;
  wx.showLoading({
    title: '登录态失效，正在重新登录',
  })
  wx.login({
    success: function (res) {
      if (res.code) {
        var code = res.code;
        var _domainName = domainName;
        var _companyId = companyId;
        console.log("code: " + code);
        wx.getUserInfo({//getUserInfo流程
          success: function (res2) {//获取userinfo成功
            var userInfo = res2.userInfo;
            var that = this;
            wx.request({
              url: config.loginUrl,
              data: {
                companyId: _companyId,
                code: code,
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                gender: userInfo.gender,
                province: userInfo.province,
                city: userInfo.city,
                country: userInfo.country,
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'content-type': 'application/json'
              }, // 设置请求的 header
              success: function (res) {
                wx.setStorageSync("sessionId", res.data.data.sessionId);
                // setTimeout(function () {
                //   wx.hideLoading();
                // }, 2000)
                console.log('服务器返回' + res.data.sessionId);
              },
              fail: function () {
                console.log("login error");
              },
              complete: function(){
                wx.hideLoading();
                wx.switchTab({
                  url: '../trump/trump',
                })
              }
            })
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });

 
}

// function resetUserInfo(url, method, data, callback) {
//   console.debug("resetUserInfo")
//   app.resetUserInfo(function () {
//     wx.request({
//       url: url,
//       method: method,
//       data: data,
//       header: {
//         'content-type': 'application/x-www-form-urlencoded',
//         '_dw_auth_cookie': app.globalData.loginToken
//       },
//       success: function (res) {
//         if (res.data.code == 200) {
//           callback(res.data.data);
//         }
//       }
//     })
//   });
// }

module.exports =
  {
    Request: Request
  }