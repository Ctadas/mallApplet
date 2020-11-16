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
		btnGroupData:[
			{
				name:'推荐',
				icon:'/images/tuijian.png',
				toUrl:'/pages/logs/logs',
			},
			{
				name:'推荐1',
                icon:'/images/tuijian.png',
				toUrl:'/pages/logs/logs',
			},
			{
				name:'推荐2',
                icon:'/images/tuijian.png',
				toUrl:'/pages/logs/logs',
			},
            {
                name: '推荐3',
                icon: '/images/tuijian.png',
                toUrl: '/pages/logs/logs',
            },
            {
                name: '推荐4',
                icon: '/images/tuijian.png',
                toUrl: '/pages/logs/logs',
            },
            {
                name: '推荐5',
                icon: '/images/tuijian.png',
                toUrl: '/pages/logs/logs',
            },
		],
       
	},
	btnClick: function(e){
		let jumpUrl = e.detail.cell.toUrl;
		wx.switchTab({
            url: jumpUrl,
        })
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
        let that = this;
        wx.request({
			url: request_urls.get_recommended_info,
            data:{
                is_recommend:true
            },
            success:function(res){
                that.setData({
                    pushInformation:res.data
                })
                // 瀑布流渲染
                wx.lin.renderWaterFlow(that.data.pushInformation, false, () => {

                })
            }
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