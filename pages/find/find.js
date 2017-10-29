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
    findArr: [],
    titleImg: "http://osteg9z4m.bkt.clouddn.com/5-1.jpg",
    needReload: false,
    needReloadFindId: 0,
    nowPage: 1,
    pageEnd: false,
    loadding: false,
    menuShow: "hide"
  },

  onLoad: function(e){
    var _this = this;

    _this.loadListData();

    //设置定时器，是否需要刷新页面或者重新加载评论
    setInterval(function(){
      //console.log(_this.data.needReload, 1);
      if(_this.data.needReload == true){
        console.log(_this.data.needReloadFindId);
        if(_this.data.needReloadFindId == 0){
          _this.loadListData();

          _this.setData({
            findArr:[],
            needReload: false,
            needReloadFindId: 0,
            nowPage: 1,
            pageEnd: false
          });
        }else{
          _this.loadFindComment();

          _this.setData({
            needReload: false,
            needReloadFindId: 0
          });
        }

        
      }
    }, 1000);
  },

  loadMoreFindComment: function(e){
    var findId = e.currentTarget.dataset.id;

    this.setData({
      needReloadFindId: findId
    });

    this.loadFindComment();

  },

  loadFindComment: function(){
    var _this = this;

    if(this.data.loadding == true){
      return;
    }

    let data = {};

    this.setData({
      loadding: true
    });

    //console.log(_this.data.needReloadFindId);

    AJAX.Request(config.requestUrlPrefix + '/find/commentList?companyId=' + config.companyId + '&findId='+_this.data.needReloadFindId, "GET", data, function (res) {
      
      var findArr = _this.data.findArr;

      for(var i in findArr){
        if(findArr[i].id == res[0].findId){
          console.log(findArr[i].comments, res, res[0]);

          findArr[i].comments = res;
          findArr[i].addmoreClassName = "hide";
        }
      }

      _this.setData({
        findArr: findArr,
        needReload: false,
        needReloadFindId: 0,
        loadding: false,

      });
    });
  },

  loadListData: function(callback){

    if(this.data.pageEnd == true || this.data.loadding == true){
      return;
    }

    this.setData({
      loadding: true
    });

    var _this = this;
    let data = {};
    AJAX.Request(config.requestUrlPrefix + 'find/list?companyId=' + config.companyId + '&pageSize=5&curPage='+this.data.nowPage, "GET", data, function (res) {
       //var res = [{"id":1,"content":"这款产品非常好用","userId":5,"userName":"陆影","userAvator":"https://wx.qlogo.cn/mmopen/vi_32/QE9A6x4Cq4jwUznSeAPEchqzmDMbp6mceiaOyqgQEaZVtDT9aIJQVWumcdAgwiawr85Idr7Ew199an7lDh2kTOaw/0","createTime":"8小时前","thumbsUp":2,"hasThumbsUp":true,"originPics":"http://cisvideoqiniu.kazhedui.cn/cis/bolang/detail2-2.jpg","thumbnailPics":"http://cisvideoqiniu.kazhedui.cn/cis/bolang/detail2-2.jpg,http://cisvideoqiniu.kazhedui.cn/cis/bolang/detail2-2.jpg","comments":null},{"id":2,"content":"矮油不错哦","userId":2,"userName":"李泽宇","userAvator":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erHVQYic6jiaiaqbPy9bFQCnILmDtwUuWV5ccLHSXgMPWJOZrVBs5mxOsu54uUY51YVcRXOm0Mvw9Dwg/0","createTime":"8小时前","thumbsUp":1,"hasThumbsUp":true,"originPics":"http://cisvideoqiniu.kazhedui.cn/cis/bolang/detail2-2.jpg","thumbnailPics":"http://cisvideoqiniu.kazhedui.cn/cis/bolang/detail2-2.jpg","comments":null}]

        var data = res;
        var tmpImgArr = [];
        for(var i in data){

          if(data[i].hasThumbsUp){
            data[i].handImg = "../../image/hand_on.png";
          }else{
            data[i].handImg = "../../image/hand.png"
          }

          data[i].menuShow = "hide";

          data[i].thumbnailPicsArr = data[i].thumbnailPics.split(";");

          if( (data[i].thumbnailPicsArr.length) == 1 && data[i].thumbnailPics){
            var pic = data[i].thumbnailPicsArr[0];
            var picArr = pic.split("?");
            if(!picArr[1]){
              data[i].thumbnailPicsArr = [ picArr[0]+"?imageView2/1/w/350/h/500" ];
              data[i].thumImgStyle = "width:350rpx;height:500rpx;";
            }else{
              var picStyle = picArr[1].split("/");
              data[i].thumImgStyle = "width:"+picStyle[3]+"rpx;height:"+picStyle[5]+"rpx;";
            }
            //异步获取图片大小
            /*tmpImgArr.push(data[i].thumbnailPics);
            wx.getImageInfo({
                src: data[i].thumbnailPicsArr[0],
                success: function (res) {
                  console.log(res);
                  //请求异步，所以要重新定位图片的键值
                    var newData = _this.data.findArr;
                    for(var w in newData){
                      for(var x in tmpImgArr){
                        if(newData[w].thumbnailPics == tmpImgArr[x]){
                          if(res.width > 350 || res.width <= 0){
                            res.height = 500;
                            res.width = 350;
                          }


                          newData[w].thumbnailPicsArr = [ (tmpImgArr[x]+"?imageView2/1/w/"+res.width+"/h/"+res.height) ];

                          newData[w].thumImgStyle = "width:"+res.width+"rpx;height:"+res.height+"rpx;";
                          break;
                        }
                      }
                    }

                    _this.setData({
                      findArr: newData
                    });
                },
                fail: function(e){

                },
                complete: function(e){

                }
            });*/
          }else{
            for(var t in data[i].thumbnailPicsArr){
              data[i].thumbnailPicsArr[t] = data[i].thumbnailPicsArr[t]+"?imageView2/1/w/190/h/190";
            }
          }

          data[i].originPicsArr = data[i].originPics.split(";");

          if(data[i].comments.length == 5){
            data[i].addmoreClassName = "show";
          }else{
            data[i].addmoreClassName = "hide";
          }
        }

        var pageEnd = false;
        if(data.length < 5){
          pageEnd = true;
        }

        var findArr = (_this.data.findArr).concat(data);

        _this.setData({
          findArr: findArr,
          nowPage: ++_this.data.nowPage,
          pageEnd: pageEnd,
          needReload: false,
          needReloadFindId: 0,
          loadding: false
        });

        if(callback){
          callback();
        }
        
    });
  },

  onReachBottom: function(e){
    this.loadListData();
  },

  onPullDownRefresh: function(){
    this.setData({
      findArr: [],
      nowPage: 1,
      pageEnd: false,
      needReload: false
    });

    this.loadListData(function(){
      wx.stopPullDownRefresh();
    });
  },

  deleteFind: function(event){
    var findId = event.currentTarget.dataset.id;
    var _this = this;
    let data = {};
    AJAX.Request(config.requestUrlPrefix + 'find/delete?companyId=' + config.companyId + '&findId='+findId, "GET", data, function (res) {
      var findArr = _this.data.findArr;

      for(var i in findArr){
        if(findArr[i].id == findId){
          findArr.splice(i, 1);
        }
      }
      _this.setData({
        findArr: findArr,
      });
        /*_this.setData({
          findArr: [],
          nowPage: 1,
          pageEnd: false,
          needReload: false
        });

        _this.loadListData();*/
    });
  },

  toAdd: function (e){
    wx.navigateTo({
        url: '../findedit/findedit'
      });
  },

  //点赞
  zan: function(event){

    var findId = event.currentTarget.dataset.id;
    var findArr = this.data.findArr;

    for(var i in findArr){
      if(findArr[i].id == findId && findArr[i].hasThumbsUp){
        return;
      }
    }

    var _this = this;
    let data = {};
    AJAX.Request(config.requestUrlPrefix + 'find/thumbsUp?companyId=' + config.companyId + '&findId='+findId, "GET", data, function (res) {
      for(var i in findArr){
        if(findArr[i].id == findId){
          findArr[i].handImg = "../../image/hand_on.png";
          ++findArr[i].thumbsUp;
        }
      }

      _this.setData({
        findArr: findArr
      });
    });
  },

  //去评论
  goToComment: function(event){
    var findId = event.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../findedit/findedit?findid='+findId
    });
  },

  showMenu: function(event){
    var findId = event.currentTarget.dataset.id;

    var findArr = this.data.findArr;

    for(var i in findArr){
      if(findArr[i].id == findId){
        console.log(findArr[i].id, findId);
        if(findArr[i].menuShow == "hide"){
          findArr[i].menuShow = "show";
          console.log("show");
        }else{
          findArr[i].menuShow = "hide";
          console.log("hide");
        }
      }
    }

    this.setData({
      findArr: findArr
    });

  },

  /**   
     * 预览图片  
     */  
    previewImage: function (e) {
      var _this = this;   

      var current = e.currentTarget.dataset.src; 

      var findId = e.currentTarget.dataset.id;

      var findArr = this.data.findArr;

      var imgArr = [];
      var imgThumbArr = [];

      for(var i in findArr){
        if(findArr[i].id == findId){
          imgArr = findArr[i].originPicsArr;
          imgThumbArr = findArr[i].thumbnailPicsArr;
        }
      }

      var first = 0;
      for(var m in imgThumbArr){
        if(imgThumbArr[m] == current){
          first = m;
          break;
        }
      }

      wx.previewImage({  
          current: imgArr[first], // 当前显示图片的http链接  
          urls: imgArr // 需要预览的图片http链接列表  
      }); 
    }

})
