const config = require('../../config')
const AJAX = require('../../utils/request')
var util = require('../../utils/util.js')
var wxapi = require('../../utils/wxapi.js')

Page({

  data: {

  },


  onLoad: function (params) {
    var that = this;
    that.setData({
      couponName: params.couponName
    });
  },

  use: function(){
    wx.navigateTo({
      url: '../products/products?typeId=0',
    })
  },


  onShareAppMessage: function () {
    return {
      title: '送你立减金',
      path: 'pages/couponReceive/couponReceive'
    }
  }
})