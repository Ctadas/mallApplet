// pages/order_form_list/order_form_list.js
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
		loading_show:true,
		tab_list:[
			{
				id:'0',
				name:'全部订单',
				content:{
					count:0,
					next:null,
					previous:null,
					results:[]
				}
			},
			{
				id:'1',
				name:'待确认',
				content:{
					count:0,
					next:null,
					previous:null,
					results:[]
				}
			},
			{
				id:'2',
				name:'待打单',
				content:{
					count:0,
					next:null,
					previous:null,
					results:[]
				}
			},
			{
				id:'3',
				name:'已完成',
				content:{
					count:0,
					next:null,
					previous:null,
					results:[]
				}
			},
			{
				id:'4',
				name:'已取消',
				content:{
					count:0,
					next:null,
					previous:null,
					results:[]
				}
			},
		],
		active_tab:0,
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
			});
			wx.navigateTo({
			  url: '/pages/order_form_search/order_form_search?search='+search_value,
			})
		}
	},
	//取消搜索
	cancel_search:function(e){
		let that = this;
		that.setData({
			search:'',
		})
	},
	//标签切换时间
	changeTabs:function(e){
		let that = this;
		let status_code = e.detail.activeKey;
		let tab_list = that.data.tab_list;
		let find_tab = _.find(tab_list, function(o) { return o.id == status_code; });
		if(find_tab){
			// if(find_tab.content.results.length == 0){
			that.setData({
				loading_show:true,
				active_tab:status_code,
				loadmore_config: {
					show: false,
					type: 'loading'
				},
			});
			that.get_order_form_list();
			// }
		}
	},
	//订单详情
	to_info:function(e){
		let that = this;
		let order_id = e.currentTarget.dataset.order.id;
		wx.navigateTo({
		  url: '/pages/order_form_info/order_form_info?order_form_id='+order_id,
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
	//获取所有订单
	get_order_form_list:function(next_url){
		let that = this;
		let url = request_urls.order_form;
		let active_tab = that.data.active_tab;
		let method = 'GET';
		let refresh = true;
		let data = {
			status__code:active_tab
		};
		if(active_tab == '0'){
			data= {}
		}
		if(next_url){
			data={};
			url = next_url;
			refresh = false;
		};
		let callback = (res) => {
			
			that.setData({
				order_form_list:res.data.data
			})
			that.assort_order_form(refresh);
		
			that.setData({
				loading_show:false
			})
		};
		let error_callback = () =>{
			wx.lin.showToast({
				title: '获取订单失败',
				icon: 'error'
			})
			that.setData({
				order_form_list:[],
				loading_show:false
			})
		};
		let unlogin_callback = () =>{
			that.login_pupop.show_pupop();
			that.setData({
				order_form_list:[],
				loading_show:false
			})
		};
		user_management.unified_request(url,method,data,callback,error_callback,unlogin_callback);
	},
	//分配订单
	assort_order_form:function(refresh){
		let that = this;
		let order_form_list = that.data.order_form_list;
		let tab_list = that.data.tab_list;
		let status_code = that.data.active_tab;
		let find_tab_index = _.findIndex(tab_list, function(o) { return o.id == status_code; });
		if(refresh){
			tab_list[find_tab_index].content = order_form_list;
		}
		else{
			tab_list[find_tab_index].content.results = tab_list[find_tab_index].content.results.concat(order_form_list.results);
			tab_list[find_tab_index].content.next = order_form_list.next;
		}

		// let groupByDict = _.groupBy(order_form_list, function(o) {
		// 	return o.status.code;
		// });
		// tab_list.forEach(item =>{
		// 	if(item.id == '0'){
		// 		item.content = order_form_list
		// 	}else{
		// 		item.content = groupByDict[item.id]
		// 	}
		// 	if(item.content == undefined){
		// 		item.content = []
		// 	}
		// })
		that.setData({
			tab_list:tab_list,
			is_loading_more:false
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		that.login_pupop = that.selectComponent("#login_pupop");
		let window_height = utils.getWindowHeight();
		let active_code = options.code;
		that.setData({
			windowHeight:window_height,
			active_tab:active_code
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
	onShow: function (e) {
		let that = this;
		that.setData({
			loading_show:true,
		})
		that.get_order_form_list();
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
		let tab_list = that.data.tab_list;
		let status_code = that.data.active_tab;
		let find_tab = _.find(tab_list, function(o) { return o.id == status_code; });

		if(find_tab.content.next != null){
			loadmore_config.show = true;
			loadmore_config.type = "loading";
			that.setData({
				loadmore_config: loadmore_config
			});
			let next_url = find_tab.content.next;
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