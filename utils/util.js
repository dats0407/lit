const config = require('../config')
const AJAX = require('./request')


function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function currentDate() {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function currentTime() {
  var date = new Date()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [hour, minute, second].map(formatNumber).join(':')
}

function currentTimeExceptSecond() {
  var date = new Date()
  var hour = date.getHours()
  var minute = date.getMinutes()
  return [hour, minute].map(formatNumber).join(':')
}

function currentDateTime() {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 字符串转时间戳
function formatDatetimeToTimestamp(dateTime) {
  return new Date(dateTime).getTime() / 1000
}

// 时间戳转字符串
function formatTimestampToDatetime(tiimestamp) {
  var date = new Date(tiimestamp)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 时间戳转字符串
function formatTimestampToDatetimeExceptSecond(tiimestamp) {
  var date = new Date(tiimestamp)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

// 时间戳转字符串
function formatTimestampToDate(tiimestamp) {
  var date = new Date(tiimestamp)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

// 判断两个日期相差的天数
function diffDate(sdate, edate) {
  return (new Date(edate).getTime() - new Date(sdate).getTime()) / (24 * 3600 * 1000) + 1
}

function isAfterNow(time) {
  if (new Date().getTime() < time) {
    return true;
  }

  return false;
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

// 判断对象是否为空
function isEmpty(obj) {
  for (var name in obj) {
    return false;
  }

  return true;
}

function Rad(d) {
  return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}

// 计算俩点之间的距离是否小于给定的值
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function isDistanceInner(lat1, lng1, lat2, lng2) {
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  console.debug("距离")
  console.debug(s)
  //s=s.toFixed(4);
  return s <= 200;
}

// 调用本机相机
function chooseImage(callback) {
  wx.chooseImage({
    sourceType: ['camera'],
    sizeType: ['original'],
    count: 1,
    success: function (res) {
      console.debug(res)
      callback(res)
    }
  })
}

// 上传图片到七牛云
const qiniuUploader = require("./qiniuUploader")
function uploadImage(token, filePath, fileName, callback) {
  // 图片上传到七牛（https://github.com/gpake/qiniu-wxapp-sdk/blob/master/README.md?ref=developer.qiniu.com）
  qiniuUploader.upload(
    filePath, (res) => {
      console.debug(res.imageUrl)
      callback(res)
    }, (error) => {
      console.error('upload image to qiniu error: ' + error);
      callback(error)
    }, {
      uploadURL: 'https://up-z2.qbox.me', // 华南
      // 自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
      key: fileName,
      // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
      // 由其他程序生成七牛 uptoken
      uptoken: token
      // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "0MLvWPnyy..."}
      // uptokenURL: 'UpTokenURL.com/uptoken', 
      // uptokenFunc: function () { return 'zxxxzaqdf'; }   
    });
}

/**
 * 支付订单
 */
function payOrder(amount, cb) {
  var deviceInfo = "未知设备信息..."
  getSystemInfo(function (res) {
    deviceInfo = res
  })
  console.debug("设备信息： " + deviceInfo)

  var subject = "充值" + amount + "元"
  AJAX.Request(config.payOrderUrl, "POST", {
    channel: "wxpay_small_app",
    amount: amount,
    paid: amount,
    subject: subject,
    device_info: deviceInfo
  }, function (res) {
    cb(res)
  })
}

/**
 * 查询订单状态
 */
function getOrderStatus(payMD5Id, cb) {
  AJAX.Request(config.payStatusUrl, "GET", {
    pay_md5: payMD5Id
  }, function (res) {
    cb(res)
  })
}

/**
 * 系统信息
 */
function getSystemInfo(cb) {
  wx.getSystemInfo({
    success: function (res) {
      cb(res.model)
    }
  })
}

function getFormatDate(arg) {
  if (arg == undefined || arg == '') {
    return '';
  }

  var re = arg + '';
  if (re.length < 2) {
    re = '0' + re;
  }

  return re;
}

function isInArray(value, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
}

module.exports = {
  formatTime: formatTime,
  formatDatetimeToTimestamp: formatDatetimeToTimestamp,
  formatTimestampToDatetime: formatTimestampToDatetime,
  formatTimestampToDatetimeExceptSecond: formatTimestampToDatetimeExceptSecond,
  formatTimestampToDate: formatTimestampToDate,
  isAfterNow: isAfterNow,
  diffDate: diffDate,
  formatLocation: formatLocation,
  currentDate: currentDate,
  currentTime: currentTime,
  currentDateTime: currentDateTime,
  currentTimeExceptSecond: currentTimeExceptSecond,
  isEmpty: isEmpty,
  isDistanceInner: isDistanceInner,
  chooseImage: chooseImage,
  uploadImage: uploadImage,
  payOrder: payOrder,
  getOrderStatus: getOrderStatus,
  getSystemInfo: getSystemInfo,
  getFormatDate: getFormatDate,
  isInArray: isInArray
}



