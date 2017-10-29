/*
* @Author: lizeyu
*/
import newData from '../../Datas/mgtv.js';
const config = require('../../config')
const AJAX = require('../../utils/request')
var util = require('../../utils/util.js')
var wxapi = require('../../utils/wxapi.js')
var app = getApp();
Page({

    data:{
        name: '',
        productId:'',
        videoSrc:'',
        showMoreContent: false,
        popContent: "",
        moreContentMove: false,
        detailDesc: "",
        desc: "",
        phone: "",
        xcxName: "",
        lunboPics: [],
        hasVideo: true,
        openPay: false,
    },

    onLoad: function(params){

        var name="";
        var videoSrc="";
        var companyId = config.companyId;
        var domainName = config.domainName;

        let productId = params.productId;

        let param = {
          API_URL: config.templatesUrlPrefix + companyId + '/products/' + productId + '.js',
          data: {}
        };

        wx.showLoading({
          title: '加载中',
        })

        newData.result(param).then(data => {
          let datas = data.data;
          var videoSrc = data.data.videoUrl;
          var hasVideo = videoSrc == "" ? false : true;
          this.setData({
            // videoSrc: videoSrc,
            videoSrc: 'http://cisvideoqiniu.kazhedui.cn/cis/bolang/videofeilindeng.mp4',
            name: data.data.name,
            detailDesc: data.data.detailDesc,
            lunboPics: data.data.lunboPics,
            detailPics: data.data.detailPics,
            desc: data.data.description,
            hasVideo: hasVideo,
            productId: productId,
            openPay: app.globalData.openPay,
            phone: app.globalData.phone,
            xcxName: app.globalData.xcxName
          })
          wx.hideLoading();
        }).catch(e => {
          this.setData({
            loadtxt: '数据加载异常',
            loading: false
          })
        })

        // var that = this;
        // wxapi.getStorage('phone', function(res){
        //   that.setData({
        //     phone: res.data
        //   })
        // });

        // wxapi.getStorage('xcxName', function (res) {
        //   that.setData({
        //     xcxName: res.data
        //   })
        // });
    },

    onReady: function(){

        //实例化一个动画
        this.animation = wx.createAnimation({
          // 动画持续时间，单位ms，默认值 400
          duration: 1000, 
          /**
           * http://cubic-bezier.com/#0,0,.58,1  
           *  linear  动画一直较为均匀
           *  ease    从匀速到加速在到匀速
           *  ease-in 缓慢到匀速
           *  ease-in-out 从缓慢到匀速再到缓慢
           * 
           *  http://www.tuicool.com/articles/neqMVr
           *  step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
           *  step-end   保持 0% 的样式直到动画持续时间结束        一闪而过
           */
          timingFunction: 'linear',
          // 延迟多长时间开始
          delay: 100,
          /**
           * 以什么为基点做动画  效果自己演示
           * left,center right是水平方向取值，对应的百分值为left=0%;center=50%;right=100%
           * top center bottom是垂直方向的取值，其中top=0%;center=50%;bottom=100%
           */
          transformOrigin: 'left top 0',
          success: function(res) {
            console.log(res)
          }
        });

    },

    videoErrorCallback: function(e){
        console.log(e);
    },

    onShareAppMessage: function () {
      var xcxName = this.data.xcxName;
      return {
        title: xcxName,
        path: 'pages/trump/trump'
      }
    },

    // toVideo: function () {
    //   wx.navigateTo({
    //     url: '../Play/play?productId=5'
    //   })
    // },

    showMore: function (content) {
      //发起请求，显示内容
      this.setData({
        showMoreContent: true,
        popContent: "自拍杆是风靡世界的自拍神器，它能够在20厘米到120厘米长度间任意伸缩，使用者只需将手机或者傻瓜相机固定在伸缩杆上，通过遥控器就能实现多角度自拍。",
        moreContentMove: true,
        popContent: "自拍杆是风靡世界的自拍神器，它能够在20厘米到120厘米长度间任意伸缩，使用者只需将手机或者傻瓜相机固定在伸缩杆上，通过遥控器就能实现多角度自拍。",
        popContent: content
      });
    
    },

    hideMore: function(){
      this.setData({ 
        showMoreContent: false,
        moreContentMove: false
      });
    },

    showShareToast: function () {
      this.showMore("请点击右上角 ... 然后转发分享");
    },

    showDetailDesc: function () {
      this.showMore(this.data.detailDesc);
    },

    toContactTel: function () {
      var phone = this.data.phone;
     
      wx.showModal({
        title: phone,
        confirmText: '呼叫',
        success: function (res) {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: phone
            })
          }
        }
      })
        // wx.navigateTo({
        //   url: '../payment/payment'
        // })
    },

    toPayment: function(){
        wx.navigateTo({
          url: '../payment/payment?productId=' + this.data.productId
      })
    }
})