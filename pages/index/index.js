// pages/index/index.js
let request_urls = require('../../utils/request_urls.js');
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
			interval: 4000,
			duration: 1500
		},
		notice:'',
		recommended_page: 1,
		recommended_page_size: 4,
		recommended_data_count: 0,
		loadmore_config:{
			show:false,
			type:'loading'
		}

	},
	//跳转详情
	btnClick: function(e){
		let jumpUrl = e.detail.cell.toUrl;
		wx.switchTab({
            url: jumpUrl,
        })
	},
	//获取推荐信息
	get_recommended_data:function(refresh=false){
		let that = this;
		let page = that.data.recommended_page;
		let page_size = that.data.recommended_page_size;
		let count = that.data.recommended_data_count;
		if((count != 0 && (page-1)*page_size<count) || count == 0){
			wx.request({
				url: request_urls.get_specification_info,
				data: {
					is_recommend: true,
					off_shelf:false,
					page: page,
					page_size: page_size
				},
				success: function (res) {
					let code = res.data.code;
					let data = res.data.data.results;
					let count = res.data.data.count;
					if(code == 0){
						// 瀑布流渲染
						wx.lin.renderWaterFlow(data, refresh, () => {
							page = page+1;
							that.setData({
								recommended_page:page,
								recommended_data_count: count
							})
						})
					}
					
				}
			})
		}
	},
	//获取通知内容
	get_notice:function(){
		let that = this;
		wx.request({
			url: request_urls.notice,
			data: {
				isShow: true
			},
			success: function (res) {
				let return_data = res.data;
				if(return_data.code == 0){
					that.setData({
						notice: return_data.data[0].text
					})
				}
			}
		})
	},
	//获取轮播图
	get_carouse_reveal:function(){
		let that = this;
		let swiperConfig = that.data.swiperConfig;
		wx.request({
			url: request_urls.carouse_reveal,
			success: function (res) {
				let return_data = res.data;
				if(return_data.code == 0){
					swiperConfig.data = _.sortBy(return_data.data, function(o) { return o.order; });
					that.setData({
						swiperConfig:swiperConfig
					})
				}
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		let window_height = utils.getWindowHeight();
		that.setData({
			windowHeight: window_height
		});
		that.get_notice();
		that.get_carouse_reveal();
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
		let that = this;
		that.setData({
			recommended_page: 1,
			recommended_page_size: 4,
			recommended_data_count: 0
		})
		this.get_recommended_data(true);
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
		let page = that.data.recommended_page;
		let page_size = that.data.recommended_page_size;
		let recommended_data_count = that.data.recommended_data_count;
		if ((page - 1) * page_size < recommended_data_count){
			loadmore_config.show = true;
			loadmore_config.type = "loading";
			that.setData({
				loadmore_config: loadmore_config
			})
			that.get_recommended_data();
		}else{
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