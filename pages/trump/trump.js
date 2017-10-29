/*
* @Author: lizeyu
*/

import newData from '../../Datas/mgtv.js';
const config = require('../../config')
const AJAX = require('../../utils/request')
var util = require('../../utils/util.js')
var wxapi = require('../../utils/wxapi.js')
var app = getApp()
Page({

  data: {
    loading: false,
    loadtxt: '正在加载',
    videoplayVisibity: "",
    bg: '',
    style: '',
    trumpArr: [],
    xcxName: '',
    curIndex: 0

  },

  onLoad: function (params) {

    var appInstance = getApp();
    var style = appInstance.globalData.style ? appInstance.globalData.style : "default";
    this.setData({
      style: style,
    });

    wx.showLoading({
      title: '加载中',
    })
      
    let param = {
      API_URL: config.templatesUrlPrefix + config.companyId + '/homepage.js',
      data: {}
    };

    newData.result(param).then(data => {
      let datas = data.data;
      this.setData({
        trumpArr: data.data,
        bg: datas[0].bgUrl
      })
      wx.hideLoading();
    }).catch(e => {
      this.setData({
        loadtxt: '数据加载异常',
        loading: false
      })
    })
  },

  onShow: function(){
    let _this = this;
    // var xcxName = wx.getStorageSync('xcxName');
    wx.setNavigationBarTitle({
      title: app.globalData.xcxName
    })
  },

  changeSwiper: function (e) {
    let _this = this;
    let index = e.detail.current;

    this.setData({
      curIndex: index,
      bg: _this.data.trumpArr[index].bgUrl,
      videoplayVisibity: _this.data.trumpArr[index].videoUrl == "" ? "hidden" : ""       
    })
  },

  toDetail: function (e) {
    let _this = this;
    var index = _this.data.curIndex;
    var productId = _this.data.trumpArr[index].productId;
    wx.navigateTo({
      url: '../Play/play?productId=' + productId 
    })
  },

  onShareAppMessage: function () {
    var xcxName = this.data.xcxName;
    return {
      title: xcxName,
      path: 'pages/trump/trump'
    }
  }

})