let request_urls = require('../../utils/request_urls.js');
let user_management = require('../../utils/user_management.js');
let utils = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		loading_show:true,
	},
	//子组件回调
	login_handler:function(e){
		let msg = e.detail.msg;
		if(msg){
			this.get_shopping_cart();
		}
	},
	//获取购物车
	get_shopping_cart:function(){
		let that = this;
		let url = request_urls.shopping_cart;
		let method = 'GET';
		let data = {};
		let callback = (res) => {
			if(res.data.code == 0){
				let return_data = res.data.data[0];
				let product_list = return_data.product_list;
				if(product_list.length == 0){
					wx.switchTab({
					  url: '/pages/shopping_cart/shopping_cart',
					})
				}
				that.setData({
					shopping_cart:return_data,
					product_list:product_list,
					loading_show:false
				})
			}
		};
		let error_callback = () =>{
			wx.lin.showToast({
				title: '获取购物车失败',
				icon: 'error'
			})
			
			that.setData({
				product_list:[],
				loading_show:false
			})
		};
		let unlogin_callback = () =>{
			that.login_pupop.show_pupop();
			that.setData({
				product_list:[],
				loading_show:false
			})
		}
		user_management.unified_request(url,method,data,callback,error_callback,unlogin_callback);
		
	},
	//提交订单
	submit:function(){
		let that = this;
		let url = request_urls.order_form_create;
		let method = 'POST';
		let data = {
			shopping_cart_id:that.data.shopping_cart.id
		};
		let callback = (res) => {
			if(res.data.code == 0){
				let return_data = res.data.data;
				wx.lin.showToast({
					title: '订单提交成功',
					icon: 'success'
				})
				wx.navigateTo({
					url: '/pages/order_form_info/order_form_info?order_form_id='+return_data.id,
				})
			}
		};
		let error_callback = () =>{
			wx.lin.showToast({
				title: '订单提交失败',
				icon: 'error',
			})
		};
		user_management.unified_request(url,method,data,callback,error_callback);
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that =this;
		let window_height = utils.getWindowHeight();
		that.login_pupop = that.selectComponent("#login_pupop");
		that.setData({
			windowHeight:window_height
		})
		
		
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		let that = this;
		that.get_shopping_cart();
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})