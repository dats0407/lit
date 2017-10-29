const config = require('../../config')
const AJAX = require('../../utils/request')
var util = require('../../utils/util.js')
var wxapi = require('../../utils/wxapi.js')
var app = getApp();
Page({

  data: {
    hasVoted: false,
    voteCodeStr: [],
    listData: [{ "rowData": [{ "code": 0, "text": "高富帅", "voteNum": 2, "hasVoted": false }, { "code": 1, "text": "白富美", "voteNum": 2, "hasVoted": false }, { "code": 2, "text": "上档次", "voteNum": 1, "hasVoted": false }, { "code": 3, "text": "高贵冷艳", "voteNum": 1, "hasVoted": true }, { "code": 4, "text": "跨境爆品", "voteNum": 1, "hasVoted": true }], "row": 1 }, { "rowData": [{ "code": 5, "text": "圣诞", "voteNum": 0, "hasVoted": false }, { "code": 6, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 7, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 8, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 9, "text": "高富帅", "voteNum": 1, "hasVoted": true }], "row": 2 }, { "rowData": [{ "code": 10, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 11, "text": "好的很", "voteNum": 1, "hasVoted": false }, { "code": 12, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 13, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 14, "text": "好的很", "voteNum": 0, "hasVoted": false }], "row": 3 }, { "rowData": [{ "code": 15, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 16, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 17, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 18, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 19, "text": "非常好", "voteNum": 0, "hasVoted": false }], "row": 4 }, { "rowData": [{ "code": 20, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 21, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 22, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 23, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 24, "text": "高富帅", "voteNum": 0, "hasVoted": false }], "row": 5 }, { "rowData": [{ "code": 25, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 26, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 27, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 28, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 29, "text": "好的很", "voteNum": 0, "hasVoted": false }], "row": 6 }, { "rowData": [{ "code": 30, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 31, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 32, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 33, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 34, "text": "非常好", "voteNum": 0, "hasVoted": false }], "row": 7 }, { "rowData": [{ "code": 35, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 36, "text": "高富帅", "voteNum": 0, "hasVoted": false }], "row": 8 }]
    // listData: [{ "rowData": [{ "code": 0, "text": "高贵冷", "voteNum": 1, "hasVoted": true }, { "code": 1, "text": "非常好啊", "voteNum": 0, "hasVoted": true }, { "code": 2, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 3, "text": "高端大气", "voteNum": 0, "hasVoted": true }, { "code": 4, "text": "非常好", "voteNum": 0, "hasVoted": false }], "row": 1 }, { "rowData": [{ "code": 5, "text": "好的很", "voteNum": 1, "hasVoted": false }, { "code": 6, "text": "高富帅", "voteNum": 1, "hasVoted": false }, { "code": 7, "text": "非常好", "voteNum": 0, "hasVoted": true }, { "code": 8, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 9, "text": "高富帅", "voteNum": 0, "hasVoted": false }], "row": 2 }, { "rowData": [{ "code": 10, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 11, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 12, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 13, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 14, "text": "好的很", "voteNum": 0, "hasVoted": false }], "row": 3 }, { "rowData": [{ "code": 15, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 16, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 17, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 18, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 19, "text": "非常好", "voteNum": 0, "hasVoted": false }], "row": 4 }, { "rowData": [{ "code": 20, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 21, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 22, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 23, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 24, "text": "高富帅", "voteNum": 0, "hasVoted": false }], "row": 5 }, { "rowData": [{ "code": 25, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 26, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 27, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 28, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 29, "text": "好的很", "voteNum": 0, "hasVoted": false }], "row": 6 }, { "rowData": [{ "code": 30, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 31, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 32, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 33, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 34, "text": "非常好", "voteNum": 0, "hasVoted": false }], "row": 7 }, { "rowData": [{ "code": 35, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 36, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 37, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 38, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 39, "text": "高富帅", "voteNum": 0, "hasVoted": false }], "row": 8 }, { "rowData": [{ "code": 40, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 41, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 42, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 43, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 44, "text": "好的很", "voteNum": 0, "hasVoted": false }], "row": 9 }, { "rowData": [{ "code": 45, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 46, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 47, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 48, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 49, "text": "非常好", "voteNum": 0, "hasVoted": false }], "row": 10 }, { "rowData": [{ "code": 50, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 51, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 52, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 53, "text": "好的很", "voteNum": 1, "hasVoted": false }, { "code": 54, "text": "高富帅", "voteNum": 0, "hasVoted": false }], "row": 11 }, { "rowData": [{ "code": 55, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 56, "text": "好的很", "voteNum": 0, "hasVoted": false }, { "code": 57, "text": "高富帅", "voteNum": 0, "hasVoted": false }, { "code": 58, "text": "非常好", "voteNum": 0, "hasVoted": false }, { "code": 59, "text": "好的很", "voteNum": 0, "hasVoted": false }], "row": 12 }]
  },

  onLoad: function (params) {
    var that = this;
    var data = {
      companyId: config.companyId,
    }
    AJAX.Request(config.impressionQueryUrl, "GET", data, function (res) {
      that.setData({
        listData: res.listData,
        hasVoted: res.hasVoted
      })
    })

    var that = this;
    // that.setData({
    //   logoUrl: app.globalData.logoUrl,
    //   // qrCodeUrl: app.globalData.impressionQrCodeUrl
    // })

    // var data = {
    //   companyId: config.companyId,
    // }
    

  },

  vote: function (e) {

    var that = this;
    var voteCode = e.currentTarget.dataset.code;
    var voteCodeStr = that.data.voteCodeStr;
    var hasVoted = that.data.hasVoted;
    if(hasVoted){
      return;
    }

    if(util.isInArray(voteCode, voteCodeStr)){
      return;
    }

    if (voteCodeStr.length < 2) {
      voteCodeStr.push(voteCode);
      that.setData({
        voteCodeStr: voteCodeStr
      })
    } else if (voteCodeStr.length == 2) {
      voteCodeStr.push(voteCode);
      var data = {
        companyId: config.companyId,
        voteResult: voteCodeStr
      }
      AJAX.Request(config.impressionVoteUrl, "GET", data, function (res) {
        that.setData({
          listData: res.listData,
          hasVoted: res.hasVoted
        })
      })
    }
  },

  toQrCode: function () {
    wx.previewImage({
      current: app.globalData.impressionQrCodeUrl, // 当前显示图片的http链接
      urls: [app.globalData.impressionQrCodeUrl] // 需要预览的图片http链接列表
    })
  },

  onShareAppMessage: function () {
    return {
      title: '猜猜大家对博浪的印象',
      path: 'pages/impression/impression'
    }
  }



})