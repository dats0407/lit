
/**
 * 三级联动组件
 * http://blog.csdn.net/sinat_17775997/article/details/54573560
 */
var tcity = require("../../utils/citys.js");
const config = require('../../config')
const AJAX = require('../../utils/request')
var util = require('../../utils/util.js')
var wxapi = require('../../utils/wxapi.js')

var app = getApp()
Page({
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    userName: "",
    phone: "",
    detailAddr: "",
    provinceId: 0,
    cityId: 0,
    areaId: 0
  },

  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }

    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },

  open: function () {
    this.setData({
      condition: !this.data.condition,
      province: this.data.province,
      city: this.data.city,
      county: this.data.county,
    })
  },

  onLoad: function (params) {

    wx.showLoading({
      title: '加载中',
    })
    let userName = params.userName;
    let hasSetAddr = params.hasSetAddr;
    let phone = params.phone;
    let detail = params.detail;
    let province = params.province;
    let city = params.city;
    let area = params.area;
    let productId = params.productId;

    console.log("here: " + userName);

    console.log("onLoad");
    var that = this;

    tcity.init(that);

    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name,
      'userName': userName,
      'phone': phone,
      'province': province,
      'city': city,
      'county': area,
      'detailAddr': detail,
      'productId': productId
    })

    wx.hideLoading();

    console.log('初始化完成');
  },

  save: function (e) {
    var that = this;
    var result = that.checkParams(e);

    var province = that.data.province;
    var city = that.data.city;
    var county = that.data.county;
    var data = {
      userName: e.detail.value.userName,
      phone: e.detail.value.phone,
      detailAddr: e.detail.value.detailAddr,
      areaInfo: province + city + county,
      province: province,
      city: city,
      area: county
    }
    AJAX.Request(config.saveAddrUrl, "POST", data, function (res) {
      wx.reLaunch({
        url: '../payment/payment?productId=' + that.data.productId,
      })
    })
  },

  checkParams: function (e) {
    var userName = e.detail.value.userName;
    var phone = e.detail.value.phone;
    var detailAddr = e.detail.value.detailAddr;

    var province = this.data.province;
    var city = this.data.city;
    var county = this.data.county;

    if (util.isEmpty(userName)) {
      wxapi.showModal('请填写收货人姓名');
      return false;
    }

    if (util.isEmpty(phone)) {
      wxapi.showModal('请填写收货人联系电话');
      return false;
    }

    if (util.isEmpty(detailAddr)) {
      wxapi.showModal('请填写收货人详细地址');
      return false;
    }

    if (province == 'undefined' || province == ''
      || city == 'undefined' || city == ''
      || county == 'undefined' || county == ''
    ) {
      wxapi.showModal('请选择区域');
      return false;
    }
  }
})
