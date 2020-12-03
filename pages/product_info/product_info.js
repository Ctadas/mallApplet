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
		specification_info:{
			stock:10,
		},
		purchase_quantity:1


	},
	test:function(){
		
		let that = this;
		let toekn_storange = wx.getStorageSync('access_token');
		let user_id = wx.getStorageSync('user_id');
		let specification_id = that.data.specification_id;
		let purchase_quantity = 5;
		if(toekn_storange && user_id){
			wx.request({
				url: 'http://127.0.0.1:8000/BusinessManagement/shopping_cart/',
				data:{
					user__id:user_id
				},
				success:function(res){
					let shopping_cart_id = res.data[0].id;
					let product_list = res.data[0].product_list;
					let has_specification = false;
					let has_specification_id = null;
					product_list.forEach(item =>{
						if(item.product.id == specification_id){
							has_specification = true;
							has_specification_id = item.id;
							
						}
					})
					if(has_specification){
						console.log(1)
						wx.request({
							url: 'http://127.0.0.1:8000/BusinessManagement/product_list/'+has_specification_id+'/',
							method:'PUT',
							header:{
								'Authorization': 'Bearer ' + toekn_storange
							},
							data:{
								purchase_quantity:purchase_quantity,
								partial:true
							},
							success:function(res){
								console.log(res)
							}
						})
					}else{
						wx.request({
							url: 'http://127.0.0.1:8000/BusinessManagement/product_list/',
							method:'POST',
							data:{
								product:specification_id,
								shopping_cart:shopping_cart_id,
								purchase_quantity:purchase_quantity,
								order_form:null
							},
							success:function(res){
								console.log(res)
							}
						})
					}
				}
			})
			
		}
		
	},
	//切换规格信息
	change_specification:function(e){
		let that = this;
		let click_id = e.currentTarget.dataset.id;
		that.setData({
			specification_id: click_id
		});
		that.get_specification_data();
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
	//超出数量提醒
	counter_out:function(){
		wx.lin.showToast({
			title: '超出货品库存',
			icon: 'warning'
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