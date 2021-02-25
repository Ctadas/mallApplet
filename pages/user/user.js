// pages/user/user.js
let request_urls = require('../../utils/request_urls.js');
let user_management = require('../../utils/user_management.js');
let utils = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		user_info:{
			avatarUrl:'/images/not_login.png'
		},
		is_login:false,
		order_form_function:[
			{
				code:'1',
				name:'待确认',
				image:'/images/paird1.png'
			},
			{
				code:'2',
				name:'待打单',
				image:'/images/confirm1.png'
			},
			{
				code:'3',
				name:'已完成',
				image:'/images/complete1.png'
			},
			{
				code:'4',
				name:'已取消',
				image:'/images/cancel.png'
			},
		]
	},
	//获取用户信息
	get_user_info: function(){
		let that = this;
		wx.getSetting({
			success (res) {
				if(res.authSetting["scope.userInfo"]){
					let login_result = user_management.login(true);
					login_result.then(function(res){
						if(res){
							wx.getUserInfo({
								success: function(res) {
								  var userInfo = res.userInfo
								  that.setData({
									user_info : userInfo
								  })
								}
							})
							that.setData({
								is_login:res
							})
						}else{
							wx.lin.showToast({
								title: '登陆出错，请重新授权登陆！',
								icon: 'error'
							});
						}
					})
				}else{
					wx.lin.showToast({
						title: '您拒绝了授权，请重新授权登陆！',
						icon: 'error'
					});
				}
			}
		})
	},
	//推出登陆
	logout: function(){
		let that = this;
		try {
			wx.clearStorageSync();
			that.setData({
				user_info:{avatarUrl:'/images/not_login.png'},
				is_login:false,
			});
			wx.lin.showToast({
				title: '退出登陆成功！',
				icon: 'success'
			});
		} catch(e) {
			wx.lin.showToast({
				title: '退出登陆失败！',
				icon: 'error'
			});
		}
	},
	//跳转到订单列表
	jump_order_form_list: function(e){
		let code = '0';
		if(e.detail.cell){
			code = e.detail.cell.code
		}
		
		wx.navigateTo({
		  url: '/pages/order_form_list/order_form_list?code='+code,
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		let is_login = user_management.check_and_login();
		is_login.then(function(res){
			if(res){
				wx.getUserInfo({
					success: function(res) {
					  var userInfo = res.userInfo
					  that.setData({
						user_info : userInfo
					  })
					}
				})
				that.setData({
					is_login:res
				})
			}
		});
		let window_height = utils.getWindowHeight();
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