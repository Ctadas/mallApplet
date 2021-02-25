//let domain = 'http://127.0.0.1:8000/';
// let domain = 'http://192.168.1.107:8000/';
let domain = 'http://8.129.72.123:8888/';

module.exports = {
	base_domain: domain,
	//获取推荐信息
	get_specification_info: domain +'ProductManagement/specification/',
	//获取商品信息
	get_product_info: domain +'ProductManagement/product_info/',
	//获取规格信息
	get_classifications: domain + 'ProductManagement/classification/',
	//检查TOKEN
	check_token: domain + 'UserManagement/token/verify/',
	//微信登陆接口
	login: domain +'UserManagement/wx_login/',
	//购物车接口
	shopping_cart:domain+'BusinessManagement/shopping_cart/',
	//商品清单接口
	product_list:domain+'BusinessManagement/product_list/',
	//订单创建接口
	order_form_create:domain+'BusinessManagement/order_form_create/',
	//订单接口
	order_form:domain+'BusinessManagement/order_form/',
	//轮播图接口
	carouse_reveal:domain+'FeaturesManagement/carouse_reveal/',
	//通知接口
	notice:domain+'FeaturesManagement/notice/',
}