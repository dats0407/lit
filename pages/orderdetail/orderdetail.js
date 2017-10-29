//index.js  
//获取应用实例  
const config = require('../../config')
const AJAX = require('../../utils/request')
var util = require('../../utils/util.js')
var wxapi = require('../../utils/wxapi.js')
var app = getApp()
Page({
  data: {
    /** 
        * 页面配置 
        */
    order: "",
    orderStateStr: "",
    orderTime: "",
    orderItems: "",
    postageTypeStr: "",
    productPrice: 0,
    productTotalPrice: 0,
    orderPrice: 0,
    couponValue: 0,
    postageValue: 0,
    state: 0,
    userAddr: "",
    xcxName: ""
  },
  onLoad: function (params) {
    var that = this;
    var orderId = params.orderId;
    // var xcxName = wx.getStorageSync('xcxName');
    AJAX.Request(config.orderDetailUrl, "GET", { orderId: orderId }, function (res) {
      that.setData({
        order: res.order,
        productPrice: res.orderItems[0].productPrice,
        orderPrice: res.orderPrice,
        productTotalPrice: res.productTotalPrice,
        couponValue: res.couponValue,
        postageValue: res.postageValue,
        orderStateStr: res.orderStateStr,
        orderTime: res.orderTime,
        orderItems: res.orderItems,
        postageTypeStr: res.postageTypeStr,
        xcxName: app.globalData.xcxName
      })
    })

    // AJAX.Request(config.userAddrUrl, "GET", {}, function (res) {
    //   that.setData({
    //     userAddr: res
    //   })
    // })

  },

  toOrderDetail: function (e) {
    wx.navigateTo({
      url: '../orderdetail/orderdetail?orderId=' + e.currentTarget.dataset.id
    })
  },

  cancelOrder: function (e) {
    var that = this;
    var data = {
      orderId: that.data.order.id
    }
    AJAX.Request(config.cancelOrderUrl, "GET", data, function (res) {
      wx.redirectTo({
        url: '../orderlist/orderlist',
      })
    })
  },

  payNow: function (e) {
    var that = this;
    var data = {
      orderNo: that.data.order.orderNo
    }
    AJAX.Request(config.payNowUrl, "POST", data, function (res) {
      wx.requestPayment(
        {
          'timeStamp': res.timeStamp,
          'nonceStr': res.nonceStr,
          'package': res.package,
          'signType': res.signType,
          'paySign': res.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
            });

            wx.redirectTo({
              url: '../orderlist/orderlist'
            })
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
            });

            wx.redirectTo({
              url: '../orderlist/orderlist'
            })
          },
          'complete': function (res) {
            // wx.redirectTo({
            //   url: '../orderlist/orderlist'
            // })
          }
        })
    })

  },

  remindDelivery: function (e) {
    wxapi.showToast("已提醒卖家发货");
  },

  confirmReceipt: function (e) {
    var that = this;
    var data = {
      orderId: that.data.order.id
    }
    AJAX.Request(config.confirmReceiptUrl, "GET", data, function (res) {
      wx.redirectTo({
        url: '../orderlist/orderlist',
      })
    })
  },
})  