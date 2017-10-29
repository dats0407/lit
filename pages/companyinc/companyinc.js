/*
* @Author: lupinyi
*/

Page({
  data: {
    style: "default",
    name: "",
    subname: "",
    introduction: ''
    
  },



  onLoad: function (params) {
    var appInstance = getApp();
    var style = appInstance.globalData.style ? appInstance.globalData.style : "default";

    let introduction = params.introduction;
    this.setData({
      style: style,
      introduction: introduction
    });
  }
})
