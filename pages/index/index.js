// pages/index/index.js
let request_urls = require('../../utils/request_urls.js');
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
		recommended_page: 1,
		recommended_page_size: 4,
		recommended_data_count: 0,
		loadmore_config:{
			show:false,
			type:'loading'
		}

	},
	btnClick: function(e){
		let jumpUrl = e.detail.cell.toUrl;
		wx.switchTab({
            url: jumpUrl,
        })
	},
	get_recommended_data:function(callbak){
		let that = this;
		let page = that.data.recommended_page;
		let page_size = that.data.recommended_page_size;
		wx.request({
			url: request_urls.get_specification_info,
			data: {
				is_recommend: true,
				page: page,
				page_size: page_size
			},
			success: function (res) {
				let code = res.data.code;
				let data = res.data.data.results;
				let count = res.data.data.cout;
				if(code == 0){
					// 瀑布流渲染
					wx.lin.renderWaterFlow(data, false, () => {
						page = page+1;
						that.setData({
							recommended_page:page,
							recommended_data_count: count
						})
					})
				}
				
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.get_recommended_data();
        
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