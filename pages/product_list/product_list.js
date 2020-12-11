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
				ordering_field:'name',
				is_selected:true
			},
			{
				name: '销量',
				icon: 'down',
				ordering_field:'sales',
				is_selected: false
			},
			{
				name: '价格',
				icon: 'down',
				ordering_field:'price',
				is_selected: false
			},
		],
		type_id:null,
		product_list:[],
		page:1,
		page_size:5,
		ordering_field:'name', //默认排序字段
		type_id:'', //类型分类
		data_cout:0,
		loadmore_config: {
			show: false,
			type: 'loading'
		}
	},
	//跳转详情界面
	to_info:function(e){
		let data = e.currentTarget.dataset.item;
		let specification_id = data.id;
		let product_id = data.product.id;
		wx.navigateTo({
			url: `/pages/product_info/product_info?specification_id=${specification_id}&product_id=${product_id}`
		});
	},
	//排序事件方法
	change_order:function(e){
		let that = this;
		let selected_index = e.detail.index;
		let selected_name = e.detail.cell.name;
		let selected_ordering_field = e.detail.cell.ordering_field;
		let selected_ordering_icon = e.detail.cell.icon;
		let selected_ordering_is_selected = e.detail.cell.is_selected;
		// 处理点击事件按钮切换显示效果
		let temp = [];
		that.data.order_list.forEach((item,index)=>{
			if(index == selected_index){
				//判断是否为初次点击,切换相应图标
				if(selected_name != '默认'){
					if(item.is_selected == true){
						if(selected_ordering_icon == 'up'){
							item.icon = 'down';
						}else{
							item.icon = 'up';
						}
					}else{
						item.icon = 'down';
					}
				}
				item.is_selected = true;
			}else{
				item.is_selected = false;
			}
			temp.push(item);
		});	
		that.setData({
			order_list:temp
		});
		
		let page = that.data.page;
		let ordering_field = that.data.ordering_field;
		page = 1;
		//判断是否为初次点击,选择正序还是倒序
		if(selected_ordering_is_selected == true){
			if(selected_ordering_icon == 'up'){
				ordering_field = '-'+selected_ordering_field;
			}else{
				ordering_field = selected_ordering_field;
			}
		}else{
			if(selected_name == '默认'){
				ordering_field = selected_ordering_field;
			}else{
				ordering_field = '-'+selected_ordering_field;
			}
		}
		
		that.setData({
			page:page,
			ordering_field: ordering_field
		});
		that.get_product_list();
	},
	//获取商品方法
	get_product_list:function(){
		let that = this;
		let page = that.data.page;
		let page_size = that.data.page_size;
		let type_id = that.data.type_id;
		let ordering_field = that.data.ordering_field;
		wx.request({
			url: request_urls.get_specification_info,
			data: {
				product__type_classification__id: type_id,
				page: page,
				page_size: page_size,
				ordering: ordering_field,
			},
			success: function (res) {
				if(res.data.code == 0){
					let product_list = that.data.product_list;
					if(page == 1){
						product_list = res.data.data.results;
					}else{
						product_list = product_list.concat(res.data.data.results);
					}
					page = page+1;
					that.setData({
						product_list: product_list,
						page: page,
						data_cout: res.data.data.count
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