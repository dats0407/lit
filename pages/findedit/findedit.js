/*
* @Author: lizeyu
*/

import newData from '../../Datas/mgtv.js';
const config = require('../../config')
const AJAX = require('../../utils/request')
var util = require('../../utils/util.js')
var wxapi = require('../../utils/wxapi.js')
var utilMd5 = require('../../utils/md5.js');  
var qiniuUploader = require('../../utils/qiniuUploader.js')

Page({
  	data: {
  		qiniuToken: false,
  		imgUrlArr: [],
  		uploading: false,
  		findId: false,
  		content: "",
  		imgClassName: "show",
      model: false
 	},

 	onLoad: function(options){
    var model = "";
    var _this = this;
    wx.getSystemInfo({
      success:function(res){
        console.log("机型："+res.model);
        _this.setData({    
          model: res.model  
        });
      }
    });

 		this.getQiniuToken();

 		this.setData({    
      		findId: options.findid    
   		});

   		if(options.findid){
   			this.setData({    
      			findId: options.findid,
      			imgClassName: "hide"  
   			});
   		}

 		console.log(options);
 	},

 	//图片选择提示
  chooseImageTap: function(){
		let _this = this;
		wx.showActionSheet({
	 		itemList: ['从相册中选择', '拍照'],
		 	itemColor: "#f7982a",
		 	success: function(res) {
		 		if (!res.cancel) {
		 			if(res.tapIndex == 0){
		 				_this.chooseWxImage('album')
		 			}else if(res.tapIndex == 1){
		 				_this.chooseWxImage('camera')
		 			}
	 			}
	 		}
		});
	},

	//选择了图片后
	chooseWxImage:function(type){
		var token = this.data.qiniuToken;//token
		console.log("西牛token："+token);
		/*if(!token){
			console.log("正在获取token");
			return;
		}*/
    if((this.data.imgUrlArr).length >= 9){
      wxapi.showModal("您只能上传9张图哦~");
      return;
    }

		let _this = this;
		_this.uploading = true;
		wx.chooseImage({
			cont: 9 - (_this.data.imgUrlArr).length,
 			sizeType: ['compressed'],
 			sourceType: [type],
 			success: function (res) {
 				_this.uploading = false;
 				/*var dataArr = [];
 				qiniuUploader.uploadImage(token, res., fileName, callback);
				*/
 				var dataArr = res.tempFilePaths;
        //wxapi.showModal('选图成功');
 				//console.log(_this.data.imgUrlArr);
        var total = dataArr.length+_this.data.imgUrlArr.length;
        if( (dataArr.length+_this.data.imgUrlArr.length) > 9){
          wxapi.showModal("对不起，您只能上传9张图哦，您当前只能再上传"+(9-_this.data.imgUrlArr.length)+"张~");
          return;
        }

 				for(var i in dataArr){
          //console.log(dataArr[i]);
 					//_this.drawCanvasAndUpload(_this.data.imgUrlArr[i], token, i);
 					_this.uploadFileOpt(token, (_this.data.imgUrlArr).length+i, dataArr[i]);
 				} 
 			},
 			fail: function(res){
        console.log("fail");
        //wxapi.showModal('选图失败');
 				_this.uploading = false;
 			},
    	complete: function() {
        console.log("complete");
      	_this.uploading = false;
    	}
 		});
 	},

 	// 生成图片
  	prodImageOpt:function(callback){
    	var that = this;
    	
    },

    uploadFileOpt: function(token, num, imgUrl){
    	var fileName = "wx_"+num+"_" + token;

      fileName = utilMd5.hexMD5(fileName);

      //fileName = fileName.substr(8, 16)+num;

      let _this = this;
      //wxapi.showModal("未压缩："+imgUrl);
      this.drawCanvasAndUpload(imgUrl, num, token, fileName);

      //var rs = {hash: "FjivIiGZp2-QGu4RfnVkl-HCO2Uc", key: "wxapp_1509153731677_0_sCazvORk0bvckP4JOjB-QNOx1MowZSI6ImNpcy1maW5kIiwiZGVhZGxpbmUiOjE1MDkxNTcyMTl9", imageURL: "wxapp_1508555793084_0_sCazvORk0bvckP4JOjB-QNOx1MoBNijn7kGM0ROO:JPyi_bfWc7nGQs41Vf2B4tsR4V4=:eyJzY29wZSI6ImNpcy1maW5kIiwiZGVhZGxpbmUiOjE1MDg1NTkzMDR9"};
    },

  drawCanvasAndUpload: function(imgurl, num, token, fileName){
    var _this = this;

    //直接走小程序自带的压缩
    //if(this.data.model.indexOf("iPhone") <= 0 && true){
      _this.uploadImg(token, imgurl, fileName);
    /*}else{
      _this.drawImg(imgurl, num, token, fileName);
    }*/
	},
  //用canvas压缩图片
  drawImg: function(imgurl, num, token, fileName){
    console.log(imgurl.width);
    var _this = this;
    try{
      wx.getImageInfo({
          src: imgurl,
          success: function (res) {
            const ctx = wx.createCanvasContext('attendCanvasId'+num);
            //图片大小缩小一倍
            ctx.drawImage(imgurl, 0, 0, res.width/2, res.height/2);
            ctx.draw();
            //保存图片文件
            wx.canvasToTempFilePath({ 
              canvasId: 'attendCanvasId'+num,
              success: function(res) {
                _this.uploadImg(token, imgurl, fileName);
              },
              fail: function(e){
                console.log("压缩失败"+e);
                _this.uploadImg(token, imgurl, fileName);
              },
              complete: function(e){
                console.log("压缩完成"+e);
                console.log("complete");
              }
            });
          },
          fail: function(e){
            _this.uploadImg(token, imgurl, fileName);
          },
          complete: function(e){

          }
      });
    }catch(e){
      _this.uploadImg(token, imgurl, fileName);
    }
  },
  //上传图片到七牛
  uploadImg: function(token, imgurl, fileName){
    var _this = this;
    wx.showLoading({
      title: '上传中',
    });

    util.uploadImage(token, imgurl, fileName, function(rs){
      wx.hideLoading();

      if(!rs.imageURL){
        wxapi.showModal("上传图片失败：" +JSON.stringify( rs ) );
        return;
      }
      //wxapi.showModal("上传图片结果：" +JSON.stringify( rs ) );

      var tmpArr = _this.data.imgUrlArr;

      var imgurl = config.qiniuCdn+rs.imageURL;

      console.log(imgurl);

      tmpArr.push(imgurl);

      _this.setData({
        imgUrlArr: tmpArr
      });
    });
  },

 	//返回发现页
 	tofind: function(event){

      	wx.navigateBack();

 	},

 	contentInput: function(e){
    var _this = this;
 		//限制字数
    var content = e.detail.value;
    var length = 0;
    if(this.data.findId){
      //是评论
      length = 128;
    }else{
      //是主题
      length = 1024;
    }

    if(content.length >= length){
      //console.log(e.detail.cursor,length,_this.data.content);
   		this.setData({
        content: content.substr(0, length)
      });
    }else{
      this.setData({
        content: content
      });
    }
 	},

  deleteImg: function(e){
    var key = e.currentTarget.dataset.id;

    var imgUrlArr = this.data.imgUrlArr;

    imgUrlArr.splice(key, 1);

    this.setData({
      imgUrlArr: imgUrlArr
    });
  },

 	//提交按钮
 	toSubmit: function(e){
 		console.log("点击了提交按钮");

    var _this = this;

    if(!this.data.content && this.data.imgUrlArr.length <= 0){

      wxapi.showModal('请填写内容');

      return;
    }

 		if(this.uploading == true){
 			console.log("正在提交，请稍候");
 			return;
 		}

 		console.log("上传的图片url：");
 		console.log(this.data.imgUrlArr);

 		let url = "";
    let data = {};

    data.companyId = config.companyId;

 		if(this.data.findId){
      data.findId = this.data.findId;

      data.comment = this.data.content;

 			url = config.requestUrlPrefix + 'find/comment';

      _this.submit(url, data, _this.data.findId);
 		}else{
      data.content = this.data.content;

      data.originPicUrls = (this.data.imgUrlArr).join(";");

      data.thumbnailPicUrls = (this.data.imgUrlArr).join(";");

      url = config.requestUrlPrefix + 'find/add';

      if(this.data.imgUrlArr.length == 1){
          wx.getImageInfo({
              src: _this.data.imgUrlArr[0],
              success: function (res) {

                //降级算法，算出合适的高宽
                var width = res.width;
                var height = res.height;

                for(var o=4; o>0; o--){
                  if(res.width/o < 190){
                    continue;
                  }else{
                    width = parseInt(res.width/o);
                    height = parseInt(res.height/o);
                    break;
                  }
                }

                if(width <= 0){
                  return;
                }

                data.thumbnailPicsArr = [ _this.data.imgUrlArr[0]+"?imageView2/1/w/"+width+"/h/"+height ];
              },
              fail: function(e){

              },
              complete: function(e){
                data.thumbnailPicUrls = (data.thumbnailPicsArr).join(";");
                _this.submit(url, data, _this.data.findId);
              }
          });
      }else{
        data.thumbnailPicUrls = (this.data.imgUrlArr).join(";");

        _this.submit(url, data, _this.data.findId);
      }
 		}

    
 		
 	},

  submit: function(url, data, findId){
    var _this = this;
    this.uploading = true

    AJAX.Request(url, "POST", data, function (res) {

      _this.uploading == false;

      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];  //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
     
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          needReload: true,
          needReloadFindId: findId ? findId  : 0,
          nowPage: 1,
          pageEnd: false
        })

      /*wx.navigateTo({
            url: '../find/find'
          });*/

          console.log(res);

          wx.navigateBack();
    });
  },

	/**
	   * 获取七牛token
	   */
	getQiniuToken: function(){
	    var that = this
	    AJAX.Request(config.qiniuUploadTokenUrl, "GET", {}, function (res) {
	    	//console.log(res);
	      	that.setData({
	        	qiniuToken: res.uptoken
	      	})
	    });
	},

  /**   
     * 预览图片  
     */  
    previewImage: function (e) {
      var _this = this;    
      var current=e.target.dataset.src;

      wx.previewImage({  
          current: current, // 当前显示图片的http链接  
          urls: _this.data.imgUrlArr // 需要预览的图片http链接列表  
      })  
    } 


})
