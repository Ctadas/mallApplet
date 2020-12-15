// pages/product_info/product_info.js
let request_urls = require('../../utils/request_urls.js');
let user_management = require('../../utils/user_management.js');
let utils = require('../../utils/util.js');
import '../../utils/lodash/lodashUtils';
import _ from '../../utils/lodash/lodash';

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
		counter_count:1,
		purchase_quantity:1,
		loading_show:true,
		product_list:[]


	},
	//商品添加
	add_product:function(){
		let that = this;
		let specification_id = that.data.specification_id;
		let has_specification = that.data.has_specification;
		let has_specification_id = that.data.has_specification_id;
		let shopping_cart_id = that.data.shopping_cart_id;
		let purchase_quantity = that.data.purchase_quantity;
		let error_callback = ()=>{
			wx.lin.showToast({
				title: '请先登陆再进行操作！',
				icon: 'error',
				success: (res) => {
					
				},
				complete: (res) => {
					
				}
			})
		};
		if(has_specification){
			let url = request_urls.product_list+has_specification_id+'/';
			let method = 'PUT';
			let data = {
				purchase_quantity:purchase_quantity,
				partial:true
			};
			let callback = (res) => {
				let return_data = res.data;
				if(return_data.code == 0){
					wx.lin.showToast({
						title: '添加成功',
						icon: 'success'
					})
				}
			};
			user_management.unified_request(url,method,data,callback,error_callback);
		}else{
			let url = request_urls.product_list;
			let method = 'POST';
			let data = {
				product:specification_id,
				shopping_cart:shopping_cart_id,
				purchase_quantity:purchase_quantity,
				order_form:null
			};
			let callback = (res) => {
				let return_data = res.data;
				if(return_data.code == 0){
					that.get_shopping_cart();
					wx.lin.showToast({
						title: '添加成功',
						icon: 'success'
					})
				}
			};
			user_management.unified_request(url,method,data,callback,error_callback);
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
				let shopping_cart_id = res.data.data[0].id;
				let product_list = res.data.data[0].product_list;
				let has_specification = false;
				let specification_id = that.data.specification_id;
				let has_specification_id = null;
				if(product_list){
					product_list.forEach(item =>{
						if(item.product.id == specification_id){
							has_specification = true;
							has_specification_id = item.id;
						}
					})
				}
				that.setData({
					shopping_cart_id:shopping_cart_id,
					product_list:product_list,
					has_specification:has_specification,
					has_specification_id:has_specification_id
				});
				that.data.loding_ready();
			}else{
				wx.lin.showToast({
					title: '获取购物车失败',
					icon: 'error'
				})
			}
		};
		let error_callback = () =>{
			that.data.loding_ready();
		};
		user_management.unified_request(url,method,data,callback,error_callback);
		
	},
	//切换规格信息
	change_specification:function(e){
		let that = this;
		let click_id = e.currentTarget.dataset.id;
		that.setData({
			specification_id: click_id,
			loading_show:true,
			has_specification:false,
			has_specification_id:null,
			purchase_quantity:1,
			counter_count:1
		});
		//判断商品是否在购物车
		let product_list = that.data.product_list;
		let has_specification = that.data.has_specification;
		let has_specification_id = that.data.has_specification_id
		if(product_list){
			product_list.forEach(item =>{
				if(item.product.id == click_id){
					has_specification = true;
					has_specification_id = item.id;
				}
			})
		}
		that.setData({
			has_specification:has_specification,
			has_specification_id:has_specification_id
		});
		
		let loding_ready = _.after(1,function(){
			that.setData({
				loading_show :false
			})
		})

		that.get_specification_data();
	},
	//获取规格数据
	get_specification_data:function(){
		let that = this;
		let specification_id = that.data.specification_id;
		wx.request({
			url: request_urls.get_specification_info+specification_id,
			success:function(res){
				if(res.data.code == 0){
					let specification_info = res.data.data;
					that.setData({
						specification_info :specification_info
					})
					that.data.loding_ready();
				}else{
					wx.lin.showToast({
						title: '获取规格数据失败',
						icon: 'error'
					})
				}
				
			}
		})
	},
	//商品信息
	get_product_data:function(){
		let that = this;
		let product_id = that.data.product_id;
		wx.request({
			url: request_urls.get_product_info+product_id,
			success:function(res){
				if(res.data.code == 0){
					let product_info = res.data.data;
					that.setData({
						product_info :product_info,
						
					})
					that.data.loding_ready();
				}else{
					wx.lin.showToast({
						title: '获取商品信息失败',
						icon: 'error'
					})
				}
			}
		})
	},
	//跳转购物车
	to_shoppingcart:function(){
		wx.switchTab({
		  url: '/pages/shopping_cart/shopping_cart',
		})
	},
	//超出数量提醒
	counter_out:function(){
		wx.lin.showToast({
			title: '超出货品库存',
			icon: 'warning'
		})
	},
	//计数器变化
	counter_change:function(res){
		let that = this;
		that.setData({
			purchase_quantity:res.detail.count
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
		//初次进入的加载调用
		let loding_ready = _.after(3,function(){
			that.setData({
				loading_show :false
			})
		})
		that.setData({
			windowHeight: window_height,
			specification_id: specification_id,
			product_id: product_id,
			loding_ready:loding_ready
		});
		
		that.get_specification_data();
		that.get_product_data();
		that.get_shopping_cart();
		
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