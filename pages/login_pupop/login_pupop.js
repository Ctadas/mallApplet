// pages/login_pupop/login_pupop.js
let user_management = require('../../utils/user_management.js');
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		pupop_show:false,
		loading_show:false
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		show_pupop:function(){
			this.setData({
				pupop_show:true
			})
		},
		hide_pupop:function(){
			this.setData({
				pupop_show:false
			})
		},
		to_login: function(){
			let that = this;
			that.setData({
				loading_show :true
			})
			wx.getSetting({
				success (res) {
					if(res.authSetting["scope.userInfo"]){
						let login_result = user_management.login(true);
						login_result.then(function(res){
							if(res){
								that.hide_pupop();
								that.triggerEvent('login',{'msg':true})
							}else{
								wx.lin.showToast({
									title: '登陆出错，请重新授权登陆！',
									icon: 'error'
								});
							};
							that.setData({
								loading_show :false
							})
						})
					}else{
						wx.lin.showToast({
							title: '您拒绝了授权，请重新授权登陆！',
							icon: 'error'
						});
						that.setData({
							loading_show :false
						})
					}

				}
			})
		}
	}
})
