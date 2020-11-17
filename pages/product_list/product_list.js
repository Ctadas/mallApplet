// pages/product_list/product_list.js
let request_urls = require('../../utils/request_urls.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		order_list:[
			{
				name:'默认',
				is_selected:true
			},
			{
				name: '销量',
				is_selected: false
			},
			{
				name: '价格',
				is_selected: false
			},
		],
		type_id:null,
		product_list:[],
		page:1,
		page_size:5,
		data_cout:0,
		loadmore_config: {
			show: false,
			type: 'loading'
		}
	},
	change_order:function(e){
		let that = this;
		let selected_index = e.detail.index;
		let temp = [];
		that.data.order_list.forEach((item,index)=>{
			if(index == selected_index){
				item.is_selected = true;
			}else{
				item.is_selected = false;
			}
			temp.push(item);
		});	
		that.setData({
			order_list:temp
		})
	},
	get_product_list:function(){
		let that = this;
		let page = that.data.page;
		let page_size = that.data.page_size;
		let type_id = that.data.type_id;
		wx.request({
			url: request_urls.get_specification_info,
			data: {
				product__type_classification__id: type_id,
				page: page,
				page_size: page_size
			},
			success: function (res) {
				let product_list = that.data.product_list;
				product_list = product_list.concat(res.data.results);
				page = page+1;
				that.setData({
					product_list: product_list,
					page: page,
					data_cout: res.data.count
				});
				
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		let type_id = options.type_id;
		that.setData({
			type_id:type_id
		})
		that.get_product_list();
		

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
		let that = this;
		let loadmore_config = that.data.loadmore_config;
		let page = that.data.page;
		let page_size = that.data.page_size;
		let data_count = that.data.data_cout;
		if ((page - 1) * page_size < data_count) {
			loadmore_config.show = true;
			loadmore_config.type = "loading";
			that.setData({
				loadmore_config: loadmore_config
			})
			that.get_product_list();
		} else {
			loadmore_config.show = true;
			loadmore_config.type = "end";
			that.setData({
				loadmore_config: loadmore_config
			})
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})