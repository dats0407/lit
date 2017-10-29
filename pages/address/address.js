// Page({
//   data: {
//     markers: [{
//       iconPath: "../../image/find.png",
//       id: 0,
//       latitude: 22.598613,
//       longitude: 113.844733,
//       width: 50,
//       height: 50
//     }]
//   }
 
// })


Page({
  data: {
    /*markers: [{
      iconPath: "../../image/maps.png",
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 50,
      height: 50
    }],*/
    /*controls: [{
      id: 1,
      iconPath: '../../image/maps.png',
      position: {
        left: 0,
        top: 300,
        width: 50,
        height: 50
      },
      clickable: true
    }],*/
    longitude: 0,
    latitude: 0
  },

  onLoad: function (params) {
    this.getLocation();
  },
  getLocation:function(e) {  
    //console.log(e)  
    var that = this  
    wx.getLocation({  
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: function(res){  
        console.log(res)       
        that.setData({  
          longitude:res.longitude,  
          latitude:res.latitude        
        });
      }  
　   })  
  },
  regionchange(e) {
    console.log(e.type,23)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})