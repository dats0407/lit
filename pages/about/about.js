Page({
  data: {
    name: "",
  },



  onLoad: function (params) {
    let name = params.xcxName;
    this.setData({
      name: name
    });
  }
});