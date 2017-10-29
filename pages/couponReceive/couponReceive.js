const config = require('../../config')
const AJAX = require('../../utils/request')
var util = require('../../utils/util.js')
var wxapi = require('../../utils/wxapi.js')

Page({
  data: {

  },

  onLoad: function (params) {
    console.log("here");
    var that = this;
    var data = {
      companyId: config.companyId,
      couponId: 1,  //暂时写死
    }
    AJAX.Request(config.queryByCouponIdUrl, "GET", data, function (res) {

      if(res.hasReceived){
        wx.redirectTo({
          url: '../couponUse/couponUse?couponName=' + res.coupon.couponName,
        })
      }
    })
  },

  receiveCoupon: function () {
    var that = this;
    var data = {
      companyId: config.companyId,
      couponId: 1,  //暂时写死
      sourceType: 1,  //1表示来源是客户端领取
    }
    AJAX.Request(config.receiveCouponUrl, "GET", data, function (res) {
      // that.setData({
      //   hasReceived: true,
      //   coupon: res.coupon
      // })
      wx.redirectTo({
        url: '../couponUse/couponUse?couponName=' + res.coupon.couponName,
      })

    })
  },

  onShareAppMessage: function () {
    return {
      title: '送你立减金',
      path: 'pages/couponReceive/couponReceive'
    }
  }



})