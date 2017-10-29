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
    winHeight: 0,
    itemHeight: 575,
    originWinHeight: 1000,
    orderItemNum: 0,
    // tab切换  
    currentTab: 0,
    allOrders: [],
    toPayOrders: [],
    toDeliveryOrder: [],
    toReceiptOrdders: [],
    xcxName: "",
    hasOrder: false,
    loadingFinish: false
  },
  onLoad: function () {
    var that = this;

    /** 
     * 获取系统信息 
     */
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       winWidth: res.windowWidth,
    //       winHeight: res.windowHeight
    //     });
    //   }
    // });
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       originWinHeight: res.windowHeight
    //     });
    //   }
    // });

    // var xcxName = wx.getStorageSync('xcxName');

    var itemHeight = that.data.itemHeight;
    var originWinHeight = that.data.originWinHeight;
    AJAX.Request(config.orderListUrl, "GET", {}, function (res) {
      that.setData({
        allOrders: res,
        xcxName: app.globalData.xcxName,
        hasOrder: res.length > 0 ? true : false,
        loadingFinish: true,
        winHeight: res.length == 0 ? originWinHeight : res.length * itemHeight
      })
    });



    // wx.createSelectorQuery().select('#orderItem').fields({
    //   dataset: true,
    //   size: true,
    //   scrollOffset: true
    // }, function (res) {
    //   res.height
    //   // console.log("res height:" + res.height);
    //   // that.setData({
    //   //   winHeight: orderItmeNum * res.height
    //   // })
    // }).exec();

  },

  /** 
    * 滑动切换tab 
    */
  bindChange: function (e) {
    //如果该字段是touch，表示是滑动切换；否则是由于点击切换造成current改变而引起
    if (e.detail.source == 'touch') {
      var that = this;
      that.setData({
        currentTab: e.detail.current,
        hasOrder: false,
        loadingFinish: false
      });

      this.loadTabViews(e.detail.current);
    }
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    var currentTab = e.target.dataset.current;
    if (this.data.currentTab === currentTab) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        hasOrder: false,
        loadingFinish: false
      });

      this.loadTabViews(currentTab);
    }
  },

  loadTabViews: function (currentTab) {
    var that = this;
    var itemHeight = that.data.itemHeight;
    var originWinHeight = that.data.originWinHeight;
    if (currentTab == 1) {
      if (util.isEmpty(that.data.toPayOrders)) {
        AJAX.Request(config.orderListUrl, "GET", { state: 1 }, function (res) {
          that.setData({
            toPayOrders: res,
            hasOrder: res.length > 0 ? true : false,
            loadingFinish: true,
            winHeight: res.length == 0 ? originWinHeight : res.length * itemHeight
          })
        })
      } else {
        that.setData({
          winHeight: that.data.toPayOrders.length * itemHeight
        })
      }
    } else if (currentTab == 2) {
      if (util.isEmpty(that.data.toDeliveryOrder)) {
        AJAX.Request(config.orderListUrl, "GET", { state: 2 }, function (res) {
          that.setData({
            toDeliveryOrder: res,
            hasOrder: res.length > 0 ? true : false,
            loadingFinish: true,
            winHeight: res.length == 0 ? originWinHeight : res.length * itemHeight
          })
        })
      } else {
        that.setData({
          winHeight: that.data.toDeliveryOrder.length * itemHeight
        })
      }
    } else if (currentTab == 3) {
      if (util.isEmpty(that.data.toReceiptOrdders)) {
        AJAX.Request(config.orderListUrl, "GET", { state: 4 }, function (res) {
          that.setData({
            toReceiptOrdders: res,
            hasOrder: res.length > 0 ? true : false,
            loadingFinish: true,
            winHeight: res.length == 0 ? originWinHeight : res.length * itemHeight
          })
        })
      } else {
        that.setData({
          winHeight: that.data.toReceiptOrdders.length * itemHeight
        })
      }
    } else if (currentTab == 0) {
      if (util.isEmpty(that.data.allOrders)) {
        AJAX.Request(config.orderListUrl, "GET", {}, function (res) {
          that.setData({
            allOrders: res,
            hasOrder: res.length > 0 ? true : false,
            loadingFinish: true,
            winHeight: res.length == 0 ? originWinHeight : res.length * itemHeight
            // winHeight: res.length * that.data.originWinHeight / 2
          })
        })
      } else {
        that.setData({
          winHeight: that.data.allOrders.length * itemHeight
        })
      }
    }
  },

  toOrderDetail: function (e) {
    wx.navigateTo({
      url: '../orderdetail/orderdetail?orderId=' + e.currentTarget.dataset.id
    })
  },

  cancelOrder: function (e) {
    var data = {
      orderId: e.currentTarget.dataset.id
    }
    AJAX.Request(config.cancelOrderUrl, "GET", data, function (res) {
      wx.redirectTo({
        url: 'orderlist',
      })
    })
  },

  payNow: function (e) {
    var data = {
      orderNo: e.currentTarget.dataset.id
    };
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
    var data = {
      orderId: e.currentTarget.dataset.id
    }
    AJAX.Request(config.confirmReceiptUrl, "GET", data, function (res) {
      wx.redirectTo({
        url: 'orderlist',
      })
    })
  },
})  