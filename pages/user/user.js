// pages/user/user.js
let user_management = require('../../utils/user_management.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		user_info:{
			avatarUrl:'/images/not_login.png'
		},
		is_login:false
	},
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