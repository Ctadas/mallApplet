import { promisic } from '../miniprogram_npm/lin-ui/utils/util.js'
let request_urls = require('./request_urls.js');

function unified_request(url,method,data,callback,error_callback=()=>{}){
	let is_login = check_and_login(true);
	is_login.then(function(res){
		if(res){
			let token_storange = wx.getStorageSync('access_token');
			if(token_storange){
				wx.request({
					url: url,
					method:method,
					data:data,
					header:{
						'Authorization': 'Bearer ' + token_storange
					},
					success:function(res){
						callback(res);
					}
				})
			}else{
				error_callback();
				console.log('获取缓存token失败')
			}
		}else{
			error_callback();
			console.log('登陆失败')
			
		}
	})
}

async function check_and_login(show_tip){
	let strorage_value = wx.getStorageSync('access_token')
	//判断没有token的缓存
	if (strorage_value) {
		const check_WXsession_res = await promisic(wx.checkSession)()
		const checkToken_res = await promisic(wx.request)({
			url: request_urls.check_token,
			method:'POST',
			data: {
				token:strorage_value
			},
		})
		if(check_WXsession_res.errMsg == 'checkSession:ok' && checkToken_res.data.code == 0){
			return true;
		}else{
			return login(false);
		}
	}
	//判断没有token的缓存，直接跳转到登陆页面进行登陆
	else{
		if(show_tip){
			// wx.lin.showToast({
			// 	title: '请先登陆再进行操作！',
			// 	icon: 'error',
			// 	success: (res) => {
				 
			// 	},
			// 	complete: (res) => {
					
			// 	}
			// })
			return false;
		}else{
			return false;
		}
		
	}
}



async function login(show_tip){
	const wx_login_res = await promisic(wx.login)()
	if(wx_login_res){
		let login_result =  await promisic(wx.request)({
			url: request_urls.login,
			method: 'POST',
			data:{
				code: wx_login_res.code
			}
		})
		// 获取后台用户失败
		if(login_result.data.code == 0){
			let token = login_result.data.data.token.access;
			let user_id = login_result.data.data.user_id;
			try {
				wx.setStorageSync('access_token', token)
				//wx.setStorageSync('user_id', user_id)
			} 
			catch (e) {
	
			}
			if(show_tip){
				wx.lin.showToast({
					title: '登陆成功！',
					icon: 'success',
					success: (res) => {
					},
					complete: (res) => {
					}
				})
				return true;
			}
			else{
				return true;
			}
		}
		else{
			wx.lin.showToast({
				title: '后台登陆失败，请重试！',
				icon: 'error',
				success: (res) => {
					
				},
				complete: (res) => {
					
				}
			})
			return false;
		}
	}else{
		wx.lin.showToast({
			title: '登陆发生错误，请重新登陆！',
			icon: 'error',
			success: (res) => {
			 
			},
			complete: (res) => {
			 
			}
		})
		return false;
	}
}

async function request_login(code){
	const res =  await promisic(wx.request)({
		url: request_urls.login,
		method: 'POST',
		data:{
			code: code
		}
	})
	// 获取后台用户失败
	if(res.data.code == 0){
		let token = res.data.data.token.access;
		let user_id = res.data.user_id;
		try {
			wx.setStorageSync('access_token', token)
			wx.setStorageSync('user_id', user_id)
		} 
		catch (e) {

		}
		return  true;
	}else{
		
		return  false;
	}
}

// 检查微信session是否过期
async function check_WXsession(access_token){
	const check_WXsession_res = await promisic(wx.checkSession)()
									
	if(check_WXsession_res){
		return true
	}else{
		return false
	}
}
// 检查后台Token是否过期
async function check_token(access_token){
	const checkToken_res = await promisic(wx.request)({
		url: request_urls.check_token,
		data: {
			token:access_token
		},
	}).catch(()=>{})
	if(checkToken_res){
		return true
	}else{
		return false
	}
}

module.exports = {
	check_WXsession:check_WXsession,
	check_token:check_token,
	login:login,
	check_and_login:check_and_login,
	unified_request:unified_request
}