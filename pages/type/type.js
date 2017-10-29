/*
* @Author: lizeyu
*/
const config = require('../../config')
const AJAX = require('../../utils/request')
var util = require('../../utils/util.js')
var wxapi = require('../../utils/wxapi.js')
import newData from '../../Datas/mgtv.js';
Page({

  data: {   
    loading: false,
    loadtxt: '正在加载',  
    typeArr: []
  },

  onLoad: function (params) {
    // var appInstance = getApp();
    // var style = appInstance.globalData.style ? appInstance.globalData.style : "default";
    var companyId = config.companyId;
    var domainName = config.domainName;

    let productId = params.productId;

    let param = {
      API_URL: config.templatesUrlPrefix + companyId + '/type.js',
      data: {}
    };

    newData.result(param).then(data => {
      let datas = data.data;
      this.setData({
        typeArr:data.data
      })
    }).catch(e => {
      this.setData({
        loadtxt: '数据加载异常',
        loading: false
      })
    })

  },

  toTypeProduct: function(e){
    wx.navigateTo({
      url: '../products/products?typeId=' + e.currentTarget.dataset.id
      // url: '../products/products?typeId=0'
    })
  }

 

  
})