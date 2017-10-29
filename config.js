/**
 * 小程序配置文件
 */

var companyId = 1

var maxBuyQuantity = 50

// 内网开发环境
// var domainName = "http://192.168.1.103:8080/cis" ;
// var domainName = "http://localhost:8080/cis";

// 线上正式环境
var domainName = "https://www.kazhedui.cn/cis";

var server_host = "https://xjx-determination-ssl.xunlei.com";

var config = {

  // 下面的地址配合云端 Server 工作
  domainName,
  companyId,
  maxBuyQuantity,

  requestUrlPrefix: `https://www.kazhedui.cn/cis/`,

  qiniuCdn: `http://oxvaybaf1.bkt.clouddn.com/`,

  // templatesUrlPrefix: `${domainName}/templates/cis/`,
  templatesUrlPrefix: `https://www.kazhedui.cn/templates/cis/`,

  loginUrl: `${domainName}/auth/auth`,

  //校验是否第三方登录
  checkThirdLoginUrl: `${domainName}/auth//checkIsLogin`,

  // 保存用户地址信息
  saveAddrUrl: `${domainName}/addr/save`,

  //跳转到订单中心拉取订单信息
  toBuyNowUrl: `${domainName}/buynow/tobuynow`,

  //下单
  placeOrderUrl: `${domainName}/buynow/placeOrder`,

  //查询订单
  orderListUrl: `${domainName}/order/list`,

  //查询订单详情
  orderDetailUrl: `${domainName}/order/detail`,

  //查询用户地址信息
  userAddrUrl: `${domainName}/addr/query`,

  //取消订单
  cancelOrderUrl: `${domainName}/order/cancel`,

  //确认收货
  confirmReceiptUrl: `${domainName}/order/confirmDelivery`,

  //立即支付
  payNowUrl: `${domainName}/wxpay/pay`,

  //查询发现列表
  findListUrl: `${domainName}/find/list`,

  updateBuyQuantityUrl: `${domainName}/buynow/update`,
  // 七牛上传token
  qiniuUploadTokenUrl: `${domainName}/qiniu/qiuniuToken`
 
};

module.exports = config
