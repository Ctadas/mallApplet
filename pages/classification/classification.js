// pages/classification/classification.js
let request_urls = require('../../utils/request_urls.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
	choose_type:function(e){
		let that = this;
		let type_id = e.detail.cell.id;
		wx.navigateTo({
			url: '/pages/product_list/product_list?type_id=' + type_id,
		})
	},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		let that = this;

		//获取页面高度
		wx.getSystemInfo({
			success(res){
				// 获取可使用窗口宽度
				let clientHeight = res.windowHeight;
				// 获取可使用窗口高度
				let clientWidth = res.windowWidth;
				// 算出比例
				let ratio = 750 / clientWidth;
				// 算出高度(单位rpx)
				let height = clientHeight * ratio;
				// 设置高度
				that.setData({
					windowHeight: height
				});
			}
		})
		//获取分类信息
		wx.request({
			url: request_urls.get_classifications,
			success:function(res){
        let code = res.data.code;
        let data = res.data.data;
				that.setData({
					classifications : data
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