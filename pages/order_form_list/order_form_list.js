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
				content:[]
			},
			{
				id:'1',
				name:'待付款订单',
				content:[]
			},
			{
				id:'2',
				name:'待确认订单',
				content:[]
			},
			{
				id:'3',
				name:'已完成订单',
				content:[]
			},
		],
		active_tab:0,
		order_form_list:[],

	},
	//子组件回调
	login_handler:function(e){
		let msg = e.detail.msg;
		if(msg){
			this.get_order_form_list();
		}
	},
	//标签切换时间
	changeTabs:function(e){
		let that = this;
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
			if(change_status_code == '4'){
				wx.lin.showToast({
					title: '取消成功',
					icon: 'success'
				})
			}else{
				wx.lin.showToast({
					title: '支付成功',
					icon: 'success'
				})
			}
			that.get_order_form_list();
		};
		let error_callback = () =>{
			if(change_status_code == '4'){
				wx.lin.showToast({
					title: '取消失败',
					icon: 'error'
				})
			}else{
				wx.lin.showToast({
					title: '支付失败',
					icon: 'error'
				})
			}
		};
		user_management.unified_request(url,method,data,callback,error_callback);
	},
	//获取所有订单
	get_order_form_list:function(){
		let that = this;
		let url = request_urls.order_form;
		let method = 'GET';
		let data = {};
		let callback = (res) => {
			if(res.data.code == 0){
				that.setData({
					order_form_list:res.data.data
				})
				that.assort_order_form();
			}else{
				wx.lin.showToast({
					title: '获取订单失败',
					icon: 'error'
				})
				that.setData({
					order_form_list:[]
				})
			}
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
	assort_order_form:function(){
		let that = this;
		let order_form_list = that.data.order_form_list;
		let tab_list = that.data.tab_list;
		let groupByDict = _.groupBy(order_form_list, function(o) {
			return o.status.code;
		});
		tab_list.forEach(item =>{
			if(item.id == '0'){
				item.content = order_form_list
			}else{
				item.content = groupByDict[item.id]
			}
			if(item.content == undefined){
				item.content = []
			}
		})
		that.setData({
			tab_list:tab_list
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		that.login_pupop = that.selectComponent("#login_pupop");
		let window_height = utils.getWindowHeight();
		that.setData({
			windowHeight:window_height
		})
		let active_code = options.code;
		that.setData({
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

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})