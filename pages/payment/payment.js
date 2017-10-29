/*
* @Author: lizeyu
*/
const config = require('../../config')
const AJAX = require('../../utils/request')
var util = require('../../utils/util.js')
var wxapi = require('../../utils/wxapi.js')
var app = getApp()

Page({

  data: {
    addrId: '',
    hasSetAddr: false,
    userName: "",
    phone: "",
    detailAddrStr: "",
    productName: "",
    productDesc: "",
    productTotalPrice: 0,
    productPrice: 0,
    orderPrice: 0,
    couponValue: 0,
    postageValue: 0,
    productNum: 0,
    quantity: 1,
    productId: 0,
    province: "",
    city: "",
    area: "",
    detail: "",
    xcxName: "",
    picUrl: "",
    btnDisabled: false,
    btnLoading: false,
    hasCoupon: false
  },

  onLoad: function (params) {

    var productId = params.productId;
    var data = {
      product_id: productId
    };

    var that = this;

    // var xcxName = wx.getStorageSync("xcxName");

    AJAX.Request(config.toBuyNowUrl, "GET", data, function (res) {
      that.setData({
        hasSetAddr: res.hasSetAddr,
        userName: res.userName,
        phone: res.phone,
        detailAddrStr: res.detailAddrStr,
        productName: res.productName,
        productDesc: res.productDesc,
        productPrice: res.productPrice,
        orderPrice: res.orderPrice,
        productTotalPrice: res.productTotalPrice,
        hasCoupon: res.hasCoupon,
        couponValue: res.couponValue,
        postageValue: res.postageValue,
        province: res.province,
        city: res.city,
        area: res.area,
        detail: res.detail,
        picUrl: res.picUrl,
        productId: productId,
        xcxName: app.globalData.xcxName,
        couponUserId: res.couponUserId
      })

      let _hasSetAddr = res.hasSetAddr;
      if (!_hasSetAddr) {
        wx.showModal({
          title: '提示',
          content: '您还未设置收货地址，请创建地址后再付款',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../userAddr/userAddr?hasSetAddr=false&' + 'productId=' + that.data.productId,
              })
            }
          }
        })
      }
    });

    AJAX.Request(config.queryLatestCouponUrl, "GET", {companyId: config.companyId}, function (res) {
      that.setData({
        xcxName: app.globalData.xcxName
      })

    });


  


  },

  pay: function (e) {
    var that = this;
    that.setData({
      btnDisabled: true,
      btnLoading: true
    });
    // var userName = that.data.userName;
    // var productId = that.data.productId;
    // var phone = that.data.phone;
    // var detailAddrStr = that.data.detailAddrStr;

    // var orderMessage = e.detail.value.orderMessage;
    // var quantity = e.detail.value.quantity;

    var data = {
      quantity: e.detail.value.productQuantity,
      productId: that.data.productId,
      userName: that.data.userName,
      phone: that.data.phone,
      orderMessage: e.detail.value.orderMessage,
      detailAddrStr: that.data.detailAddrStr,
      companyId: config.companyId,
      couponUserId: that.data.couponUserId
    };
    AJAX.Request(config.placeOrderUrl, "POST", data, function (res) {
      // wx.reLaunch({
      //   url: '../payment/payment?productId=' + that.data.productId,
      // })
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

            // wx.redirectTo({
            //   url: '../orderlist/orderlist'
            // })
          },
          'fail': function (res) {
            console.log("fail msg:" + res.errMsg);
            wx.showToast({
              title: '支付失败',
            });

            wx.redirectTo({
              url: '../orderlist/orderlist'
            })
          },
          'complete': function (res) {
            wx.redirectTo({
              url: '../orderlist/orderlist'
            })
            console.log("complete msg:" + res.errMsg);
            // wx.redirectTo({
            //   url: '../orderlist/orderlist'
            // })
          }
        })
    })
  },

  toUserAddr: function () {
    var that = this;
    var userName = that.data.userName;
    var hasSetAddr = that.data.hasSetAddr;
    var phone = that.data.phone;
    var province = that.data.province;
    var city = that.data.city;
    var area = that.data.area;
    var detail = that.data.detail;
    var productId = that.data.productId;

    wx.navigateTo({
      url: '../userAddr/userAddr?hasSetAddr=' + hasSetAddr
      + '&phone=' + phone
      + '&userName=' + userName
      + '&province=' + province
      + '&city=' + city
      + '&area=' + area
      + '&detail=' + detail
      + '&productId=' + productId
    })
  },

  plusQuantity: function () {
    var that = this;
    var _quantity = that.data.quantity + 1;
    if (_quantity >= config.maxBuyQuantity) {
      _quantity = config.maxBuyQuantity;
    }
    that.changeQuantity(_quantity);
  },

  minusQuantity: function () {
    var that = this;
    var _quantity = that.data.quantity - 1;
    if (_quantity <= 1) {
      _quantity = 1;
    }
    that.changeQuantity(_quantity);
  },

  inputQuantity: function (e) {
    var that = this;
    var _quantity = e.detail.value;
    if (_quantity <= 1) {
      _quantity = 1;
    } else if (_quantity >= config.maxBuyQuantity) {
      _quantity = config.maxBuyQuantity;
    }
    that.changeQuantity(_quantity);
  },

  changeQuantity: function (quantity) {
    var that = this;
    that.setData({
      quantity: quantity
    })

    var data = {
      productId: that.data.productId,
      quantity: quantity
    }

    AJAX.Request(config.updateBuyQuantityUrl, "GET", data, function (res) {
      that.setData({
        orderPrice: res.orderPrice,
        couponValue: res.couponValue,
        postageValue: res.postageValue,
        productTotalPrice: res.productTotalPrice
      })
    })

  }


})