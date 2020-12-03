import { promisic } from '../miniprogram_npm/lin-ui/utils/util.js'
let request_urls = require('./request_urls.js');


async function get_storage(){
	const storage_res = await promisic(wx.getStorage)({
		key: 'access_token',
	}).catch(()=>{})
	if(storage_res){
		let access_token = storage_res.data;
		let token_status = check_token(access_token);
		let WXsession_status = check_WXsession();
	}else{
		console.log('error')
	}
}

async function login(){
	const wx_login_res = await promisic(wx.login)()
	if(wx_login_res){
		return request_login(wx_login_res.code);
	}else{
		console.log(2)
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
		return  true
	}else{
		console.log(res)
	}
}

// 检查微信session是否过期
async function check_WXsession(access_token){
	const check_WXsession_res = await promisic(wx.checkSession)()
									.catch(()=>{
										return false
									})
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
	get_storage:get_storage,
	check_WXsession:check_WXsession,
	check_token:check_token,
	login:login
}