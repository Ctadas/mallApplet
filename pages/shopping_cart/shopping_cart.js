const { product_list } = require('../../utils/request_urls.js');
// pages/shopping_cart/shopping_cart.js
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
	//跳转之分类
	jump_classification:function(){
		wx.switchTab({
		  url: '/pages/classification/classification',
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
		let count = res.detail.count;
		let productListId = res.target.dataset.productListId;
		let purchaseQuantity = res.target.dataset.purchaseQuantity;
		//判断是否跟原始值相同，不相同进行更新操作
		if(count != purchaseQuantity){
			that.upload_product_list(productListId,count);
		}

	},
	//更新商品列表
	upload_product_list:function(product_list_id,purchase_quantity){
		let that = this;
		that.setData({
			loading_show:true
		})
		let url = request_urls.product_list+product_list_id+'/';
		let method = 'PUT';
		let data = {
			purchase_quantity:purchase_quantity,
			partial:true
		};
		let callback = (res) => {
			if(res.data.code == 0){
				that.get_shopping_cart();
			}
		};
		user_management.unified_request(url,method,data,callback);
	},
	//跳转详细页面
	to_info:function(e){
		let data = e.currentTarget.dataset.item;
		let specification_id = data.specification.id;
		let product_id = data.specification.product.id;
		wx.navigateTo({
			url: `/pages/product_info/product_info?specification_id=${specification_id}&product_id=${product_id}`
		});
	},
	//删除购物车的商品
	delete_product:function(e){
		let that = this;
		that.setData({
			loading_show:true
		})
		let item_id = e.currentTarget.dataset.item_id;
		let url = request_urls.product_list+item_id+'/';
		let method = 'DELETE';
		let data = {};
		let callback = (res) => {
			if(res.data.code == 0){
				that.get_shopping_cart();
				wx.lin.showToast({
					title: '删除成功',
					icon: 'success'
				});
			}
		};
		let error_callback = () =>{
			wx.lin.showToast({
				title: '删除失败',
				icon: 'error'
			})
		};
		user_management.unified_request(url,method,data,callback,error_callback);
	},
	//展示更多操作
	show_more:function(e){
		let that = this;
		let item_id = e.currentTarget.dataset.item_id;
		let product_list = that.data.product_list;
		product_list.forEach(item=>{
			if(item.id == item_id){
				item.mask_show = true;
			}else{
				item.mask_show = false;
			}
		});
		that.setData({
			product_list:product_list
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
				let return_data = res.data.data[0];
				let product_list = return_data.product_list;
				product_list.forEach(item =>{
					item['mask_show'] = false;
				})
				that.setData({
					loading_show:false,
					shopping_cart:return_data,
					product_list:product_list
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
		let unlogin_callback=()=>{
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
	//结算时间
	settlement:function(e){
		let that = this;
		let shopping_cart_id = that.data.shopping_cart.id;
		wx.navigateTo({
			url: '/pages/order_form/order_form'
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
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
		let that =this;
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