/*
* @Author: lizeyu
*/

Page({
  data: {
    videoArr: [
      {
        "title": "晶方圆灭蚊灯产品三维动画",
        "videoSrc": "http://cisvideoqiniu.kazhedui.cn/demo/Jinsdon_Demo0629__0.mp4",
        "label1": "scence.Wong",
        "label2": "案例展示",
        "videoVisibility": "none",
        "imageVisibility": "",
        "coverImg": "http://osteg9z4m.bkt.clouddn.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20170718211540.jpg",
        "productId": 1,
        "id": 0
      },
      {
        "title": "立体声耳机，享受你的生活",
        "coverImg": "http://osteg9z4m.bkt.clouddn.com/2-1.jpg",
        "videoSrc": "http://cisvideoqiniu.kazhedui.cn/demo/%E5%A4%A9%E5%A4%A9%E5%8A%A8%E5%90%ACT2%E8%80%B3%E6%9C%BA3D%E5%AE%A3%E4%BC%A0%E7%89%87%E2%80%94%E2%80%94%E7%A8%8B%E8%A7%86%E7%A7%91%E6%8A%80%E5%87%BA%E5%93%81-%E5%9B%BD%E8%AF%AD%E6%B5%81%E7%95%85.mp4",
        "label1": "阿黄同学",
        "label2": "企业文化",
        "videoVisibility": "none",
        "imageVisibility": "",
        "productId": 2,
        "id": 1
      },
      {
        "title": "黑金本色，产品工艺视频",
        "coverImg": "http://osteg9z4m.bkt.clouddn.com/3-1.jpg",
        "videoSrc": "http://cisvideoqiniu.kazhedui.cn/demo/%E7%A8%8B%E8%A7%86%E5%87%BA%E5%93%81-%E7%81%AD%E8%9A%8A%E7%81%AF%E4%BA%A7%E5%93%81%E5%AE%A3%E4%BC%A0%E5%8A%A8%E7%94%BB-%E5%9B%BD%E8%AF%AD%E6%B5%81%E7%95%85%282%29.mp4",
        "label1": "陈朝辉",
        "label2": "产品工艺",
        "videoVisibility": "none",
        "imageVisibility": "",
        "productId": 3,
        "id": 2
      },
      {
        "title": "白金时代自拍杆，用户自拍", 
        "coverImg": "http://osteg9z4m.bkt.clouddn.com/4-1.jpg",
        "videoSrc": "http://cisvideoqiniu.kazhedui.cn/24385a7c678888628b1dc36ccae19742.mp4",
        "label1": "Linda Lee",
        "label2": "企业文化",
        "videoVisibility": "none",
        "imageVisibility": "",
        "productId": 4,
        "id": 3
      },
      {
        "title": "EXTRA跑步机，畅想健康生活",
        "coverImg": "http://osteg9z4m.bkt.clouddn.com/5-1.jpg",
        "videoSrc": "http://cisvideoqiniu.kazhedui.cn/%E4%BF%A1%E6%8B%93%E8%BD%A6%E9%A1%B6%E7%81%AF-%E4%B8%AD%E9%AB%98_0.mp4",
        "label1": "Adam",
        "label2": "厂家介绍",
        "videoVisibility": "none",
        "imageVisibility": "",
        "productId": 5,
        "id": 4
      },
    ],
  },


  //当点击一个视频的时候，停止其他正在播放的视频，并将其设置为隐藏状态
  startPlay: function (e) {
    var curIndex = e.currentTarget.dataset.id;

    let _this = this;
    var _videoArr = _this.data.videoArr;
    var videoNum = _videoArr.length;

    for (var i = 0; i < videoNum; i++) {
      if (i != curIndex) {
        this.videoContext = wx.createVideoContext('video' + _videoArr[i].id);
        this.videoContext.pause();
        _videoArr[i].videoVisibility = "none";
        _videoArr[i].imageVisibility = "";
      }
    }
    _videoArr[curIndex].videoVisibility = "";
    _videoArr[curIndex].imageVisibility = "none";

    this.setData({
      videoArr: _videoArr,
    })


    this.videoContext = wx.createVideoContext('video' + curIndex);
    this.videoContext.play();

  }




})
