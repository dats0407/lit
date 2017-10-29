/*
* @Author: lizeyu
*/
import newData from '../../Datas/mgtv.js';
const config = require('../../config')
const AJAX = require('../../utils/request')
var util = require('../../utils/util.js')
var wxapi = require('../../utils/wxapi.js')
Page({
    data: {
      name: '',
      xcxName: '',
      phone: '',
      address: '',
      introduction: ''
    },

   

    onLoad (params) {

      var appInstance = getApp();
      var style = appInstance.globalData.style ? appInstance.globalData.style : "default";
      var companyId = config.companyId;

      let param = {
        API_URL: config.templatesUrlPrefix + companyId + '/company.js',
        data: {}
      };

      newData.result(param).then(data => {
        let datas = data.data;
        this.setData({
          xcxName: data.data.xcxName,
          name: data.data.name,
          phone: data.data.phone,
          address: data.data.address,
          introduction: data.data.introduction,
        })
      }).catch(e => {
        this.setData({
          loadtxt: '数据加载异常',
          loading: false
        })
      })
    },

    toCompanyInc(){
      var introduction = this.data.introduction;
      wx.navigateTo({
        url: '../companyinc/companyinc?introduction=' + introduction
      })
    },

    toAddress(){
      wx.navigateTo({
        url: '../address/address'
      })
    },

    toAbout(){
      var xcxName = this.data.xcxName;
      wx.navigateTo({
        url: '../about/about?xcxName=' + xcxName
      })

    },

    chooseVideo: function () {
      var that = this
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: function (res) {
          that.setData({
            src: res.tempFilePath
          })
        }
      })
    },

    toContactTel: function(){
     

      wx.showModal({
        title: this.data.phone,
        confirmText: '呼叫',
        success: function (res) {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: this.data.phone
            })
          } 
        }
      })
    },

    toOrderlist: function(){
      wx.navigateTo({
        url: '../orderlist/orderlist'
      })

    },

    toErweima: function(){
      // var companyQrcodeUrl = app.globalData.companyQrcodeUrl
      wx.previewImage({
        current: 'http://cisvideoqiniu.kazhedui.cn/cis/bolang/qrcode/gh_d6814030188e_430.jpg', // 当前显示图片的http链接
        urls: ['http://cisvideoqiniu.kazhedui.cn/cis/bolang/qrcode/gh_d6814030188e_430.jpg'] // 需要预览的图片http链接列表
      })
      
    },

    toImpression: function(){
      wx.navigateTo({
        url: '../impression/impression'
      })
    },

    toCoupon: function () {
      wx.navigateTo({
        url: '../couponReceive/couponReceive'
      })
    }
})
