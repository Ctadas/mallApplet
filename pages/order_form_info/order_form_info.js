// pages/order_form_info/order_form_info.js
let request_urls = require('../../utils/request_urls.js');
let user_management = require('../../utils/user_management.js');
let utils = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		countdown_time:'10'
	},
	countdown_end:function(){
		this.get_order_form_info();
	},
	//计算倒计时
	countdown_function:function(e){
		let that = this;
		let create_time = new Date(that.data.order_form.create_time);
		let now_time = new Date();
		console.log(create_time,now_time)
		let countdown_time = Math.ceil(60 - (now_time.getTime() - create_time.getTime())/1000);
		let a = `${countdown_time}`
		that.setData({
			countdown_time:a
		})
	},	
	//订单操作
	order_operation:function(e){
		let that = this;
		let order_id = e.currentTarget.dataset.order.id;
		let code = e.currentTarget.dataset.order.status.code;
		let change_status_code = e.currentTarget.dataset.change_status_code
		let url = request_urls.order_form_create+order_id+'/';
		let method = 'PUT';
		let data = {
			code:code,
			change_status_code:change_status_code
		};
		let callback = (res) => {
			if(change_status_code == '4'){
				wx.lin.showToast({
					title: '取消成功',
					icon: 'success'
				})
			}else{
				wx.lin.showToast({
					title: '支付成功',
					icon: 'success'
				})
			}
			that.get_order_form_info();
		};
		let error_callback = () =>{
			if(change_status_code == '4'){
				wx.lin.showToast({
					title: '取消失败',
					icon: 'error'
				})
			}else{
				wx.lin.showToast({
					title: '支付失败',
					icon: 'error'
				})
			}
		};
		user_management.unified_request(url,method,data,callback,error_callback);
	},
	//获取订单信息
	get_order_form_info:function(){
		console.log(1)
		let that = this;
		let order_form_id = that.data.order_form_id;
		let url = `${request_urls.order_form}${order_form_id}`;
		let method = 'GET';
		let data = {};
		let callback = (res) => {
			if(res.data.code == 0){
				let return_data = res.data.data;
				let product_list = return_data.product_list;
				that.setData({
					order_form:return_data,
					product_list:product_list
				});
				that.countdown_function();
			}
		};
		let error_callback = () =>{
			wx.lin.showToast({
				title: '获取订单失败',
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
	//子组件回调
	login_handler:function(e){
		let msg = e.detail.msg;
		if(msg){
			this.get_shopping_cart();
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		let order_form_id = options.order_form_id;
		let window_height = utils.getWindowHeight();
		that.login_pupop = that.selectComponent("#login_pupop");
		that.setData({
			order_form_id: order_form_id,
			windowHeight:window_height
		});
		that.get_order_form_info();
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