// pages/shopping_cart/shopping_cart.js
let request_urls = require('../../utils/request_urls.js');
let user_management = require('../../utils/user_management.js');
let utils = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},
	//跳转之分类
	jump_classification:function(){
		wx.switchTab({
		  url: '/pages/classification/classification',
		})
	},
	//获取购物车
	get_shopping_cart:function(){
		let that = this;
		let url = request_urls.shopping_cart;
		let method = 'GET';
		let data = {};
		let callback = (res) => {
			if(res.data.code == 0){
				
			}else{
				wx.lin.showToast({
					title: '获取购物车失败',
					icon: 'error'
				})
			}
		};
		user_management.unified_request(url,method,data,callback);
		
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
	
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