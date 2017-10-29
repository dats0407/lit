import newData from '../../Datas/mgtv.js';
const config = require('../../config')
Page({

  data: {
    loading: false,
    loadtxt: '正在加载',
    productArr: [],
    xcxName: '',

  },

  onLoad: function (params) {

    wx.showLoading({
      title: '加载中',
    })

    var typeId = params.typeId;

    //如果typeId是0，则显示全部商品
    if(typeId == 0){
      let param = {
        API_URL: config.templatesUrlPrefix + config.companyId + '/productList.js',
        data: {}
      };

      newData.result(param).then(data => {
        let datas = data.data;
        this.setData({
          productArr: data.data
        })
        wx.hideLoading();
      })
    }else{
      let param = {
        API_URL: config.templatesUrlPrefix + config.companyId + '/type.js',
        data: {}
      };

      newData.result(param).then(data => {
        let datas = data.data;
        var productArr;
        
        for(var typeData in datas){
          if (datas[typeData].id ==  typeId){
            productArr = datas[typeData].products;
          }
        }
        this.setData({
          productArr: productArr
        })
        wx.hideLoading();
      })
    }
  },


  toProduct: function(e){
    wx.navigateTo({
      url: '../Play/play?productId=' + e.currentTarget.dataset.productid
    })
  }

});