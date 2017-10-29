/*
* @Author: mark
* @Date:   2016-09-27 16:27:19
* @Last Modified by:   mark
* @Last Modified time: 2016-09-29 10:17:44
*/
const config = require('config')
const AJAX = require('utils/request')
var util = require('utils/util.js')
var wxapi = require('utils/wxapi.js')

App(
  {
    globalData: {
      style: "",  //food;eproduct;
      hasLogin: false,
      openPay: false,
    },

    onLaunch: function () {
      console.log('CIS初始化成功');

      // this.checkSession();

      var that = this;
      wx.request({
        url: config.templatesUrlPrefix + config.companyId + '/company.js',
        success: function (res) {
          console.log(res.data);
          // wx.setStorageSync("xcxName", res.data.xcxName);
          // wx.setStorageSync("phone", res.data.phone);
          that.globalData.openPay = res.data.openPay;
          that.globalData.xcxName = res.data.xcxName;
          that.globalData.logoUrl = res.data.logoUrl;
          that.globalData.phone = res.data.phone;
          that.globalData.companyQrcodeUrl = res.data.companyQrcodeUrl;
          // that.globalData.impressionQrCodeUrl = res.data.impressionQrCodeUrl;
          that.globalData.impressionQrCodeUrl = "http://cisvideoqiniu.kazhedui.cn/cis/bolang/qrcode/gh_d6814030188e_430.jpg";
          that.globalData.couponQrCodeUrl = res.data.couponQrCodeUrl;
        }
      })
    },

    onShow: function () {
      console.log('页面显示')
      this.checkSession();

    },
    onHide: function () {
      console.log('页面隐藏')

    },
    //get locationInfo
    getLocationInfo: function (cb) {
      var that = this;
      if (this.globalData.locationInfo) {
        cb(this.globalData.locationInfo)
      } else {
        wx.getLocation({
          type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
          success: function (res) {
            that.globalData.locationInfo = res;
            cb(that.globalData.locationInfo)
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        });
      }
    },

    //校验用户是否带有登录态，如果没有，则去登录
    //登录流程：先校验微信session是否有效；如果有，则继续校验第三方session是否有效
    checkSession: function () {
      var that = this;
      wx.checkSession({
        success: function () {
          //到第三方服务器校验是否登录，如果没有登录，则登录
          that.checkThirdLogin(function () {
            that.login();
          });
        },
        fail: function () {
          //登录态过期,重新登录
          that.login();
        }
      })
    },

    login: function () {
      var that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code;
            console.log("code: " + code);
            wx.getUserInfo({//getUserInfo流程
              success: function (res2) {//获取userinfo成功
                var userInfo = res2.userInfo;
                var that = this;
                //到第三方服务器登录
                wx.request({
                  url: config.loginUrl,
                  data: {
                    companyId: config.companyId,
                    code: code,
                    nickName: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl,
                    gender: userInfo.gender,
                    province: userInfo.province,
                    city: userInfo.city,
                    country: userInfo.country
                  },
                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  header: {
                    'content-type': 'application/json'
                  }, // 设置请求的 header
                  success: function (res) {
                    // success
                    wx.setStorageSync("sessionId", res.data.data.sessionId);
                    wx.hideToast();
                    console.log('服务器返回' + res.data.data.sessionId);
                  },
                  fail: function () {
                    console.log("login error");
                  }
                })
              },
              fail: function (res) {
                console.error("APP.js getUserInfo failed ", res)
                // 弹框警告
                that.authorizeWarn()
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    },

    checkThirdLogin: function (callback) {
      var sessionId = wx.getStorageSync("sessionId");

      if (sessionId == "") {
        callback();
        return;
      }

      wx.request({
        url: config.checkThirdLoginUrl,
        data: {
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'JSESSIONID=' + sessionId,
        },
        success: function (res) {
          if (res.data.code == 9998) {
            console.log(res.data.code);
            callback();
          }
        }
      })
    },

    // 拒绝授权用户信息-警告
    authorizeWarn: function () {
      var that = this
      // 警告框展示
      wx.showModal({
        title: '警告',
        content: '若点击"不授权"，将无法正常使用小程序的功能体验，后期可通过微信【发现】—【小程序】—删除【小程序】,重新搜索授权登录;若点击"重新授权"，可继续体验功能。',
        showCancel: true,
        cancelText: "不授权",
        confirmText: "重新授权",
        success: function (res) {
          // 点击确定重新授权，进入设置页面
          if (res.confirm) {
            console.debug('ready to authorize userinfo')
            wx.openSetting({
              // 授权成功回调getUserInfo方法
              success: function (res) {
                if (res.authSetting["scope.userInfo"]) {
                  console.debug("授权成功...");
                  that.login();
                } else {
                  console.info("refuse to authorize userinfo")
                }
              }
            })
          }
        }
      })
    }

  }
)

var appInstance = getApp()
