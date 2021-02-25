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
		search:'',
		order_form_list:{
			count:0,
			next:null,
			previous:null,
			results:[]
		},
		loadmore_config: {
			show: false,
			type: 'loading'
		},
		is_loading_more:false,
	},
	//子组件回调
	login_handler:function(e){
		let msg = e.detail.msg;
		if(msg){
			that.setData({
				loading_show:true,
			});
			this.get_order_form_list();
		}
	},
	//搜索
	search_order:function(e){
		let that = this;
		let search_value = e.detail.value; 
		if(search_value.length != 0){
			that.setData({
				search:search_value,
				loading_show:true,
				order_form_list:{
					count:0,
					next:null,
					previous:null,
					results:[]
				},
			});
			that.get_order_form_list();
		}
	},
	//取消搜索
	cancel_search:function(e){
		let that = this;
		that.setData({
			search:'',
			order_form_list:{
				count:0,
				next:null,
				previous:null,
				results:[]
			},
			loadmore_config: {
				show: false,
			},
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
			that.setData({
				loading_show:false
			})
			that.get_order_form_list();
			if(change_status_code == '4'){
				wx.lin.showToast({
					title: '取消成功',
					icon: 'success'
				})
			}else{
				wx.lin.showToast({
					title: '确认成功',
					icon: 'success'
				})
			}
			
		};
		let error_callback = () =>{
			if(change_status_code == '4'){
				wx.lin.showToast({
					title: '取消失败',
					icon: 'error'
				})
			}else{
				wx.lin.showToast({
					title: '确认失败',
					icon: 'error'
				})
			}
		};
		user_management.unified_request(url,method,data,callback,error_callback);
	},
	//订单详情
	to_info:function(e){
		let that = this;
		let order_id = e.currentTarget.dataset.order.id;
		wx.navigateTo({
		  url: '/pages/order_form_info/order_form_info?order_form_id='+order_id,
		})
	},
	//获取搜索内容
	get_order_form_list:function(next_url){
		let that = this;
		let url = request_urls.order_form;
		let search = that.data.search;
		let refresh = true;
		let method = 'GET';
		let data = {
			search:search,
		};
		if(next_url){
			url = next_url;
			data= {};
			refresh = false;
		};
		let callback = (res) => {
			let return_data = res.data.data;
			let order_form_list = that.data.order_form_list;
			if(refresh){
				that.setData({
					order_form_list:return_data,
				});
			}else{
				order_form_list.results = order_form_list.results.concat(return_data.results);
				order_form_list.next = return_data.next;
				that.setData({
					order_form_list:order_form_list
				});
			}
					
			that.setData({
				loading_show:false,
				is_loading_more:false
			})
		};
		let error_callback = () =>{
			wx.lin.showToast({
				title: '获取订单失败',
				icon: 'error'
			})
			that.setData({
				order_form_list:[],
				loading_show:false,
				is_loading_more:false
			})
		};
		let unlogin_callback = () =>{
			that.login_pupop.show_pupop();
			that.setData({
				order_form_list:[],
				loading_show:false,
				is_loading_more:false
			})
		};
		user_management.unified_request(url,method,data,callback,error_callback,unlogin_callback);
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		
		let search = options.search;
		that.login_pupop = that.selectComponent("#login_pupop");
		let window_height = utils.getWindowHeight();
		that.setData({
			loading_show:true,
			windowHeight:window_height,
			search:search
		});
		that.get_order_form_list();
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
		let is_loading_more = that.data.is_loading_more;
		if(is_loading_more){
			return;
		}
		that.setData({
			is_loading_more:true
		})
		let loadmore_config = that.data.loadmore_config;
		let order_form_list = that.data.order_form_list;

		if(order_form_list.next != null){
			loadmore_config.show = true;
			loadmore_config.type = "loading";
			that.setData({
				loadmore_config: loadmore_config
			});
			let next_url = order_form_list.next;
			that.get_order_form_list(next_url);
		}else{
			loadmore_config.show = true;
			loadmore_config.type = "end";
			that.setData({
				loadmore_config: loadmore_config
			})
		};
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})