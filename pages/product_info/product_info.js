// pages/product_info/product_info.js
let request_urls = require('../../utils/request_urls.js');
let utils = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		swiperConfig:{
			data: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
			indicatorDots: true,
			vertical: false,
			autoplay: true,
			interval: 2000,
			duration: 500
		},

	},
	//获取规格数据
	get_specification_data:function(){
		let that = this;
		let specification_id = that.data.specification_id;
		wx.request({
			url: request_urls.get_specification_info,
			data:{
				id: specification_id
			},
			success:function(res){
				let specification_info = res.data.results[0];
				that.setData({
					specification_info :specification_info
				})
			}
		})
	},
	get_product_data:function(){
		let that = this;
		let product_id = that.data.product_id;
		wx.request({
			url: request_urls.get_product_info,
			data:{
				id: product_id
			},
			success:function(res){
				let product_info = res.data.results[0];
				that.setData({
					product_info :product_info,
					
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		let window_height = utils.getWindowHeight();

		let specification_id = options.specification_id;
		let product_id = options.product_id;
		that.setData({
			windowHeight: window_height,
			specification_id: specification_id,
			product_id: product_id
		});
		that.get_specification_data();
		that.get_product_data();
		
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