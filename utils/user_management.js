import { promisic } from '../miniprogram_npm/lin-ui/utils/util.js'
let request_urls = require('./request_urls.js');


async function getStorage(){
	const getStorage_res = await promisic(wx.getStorage)({
		key: 'access_token',
	}).catch(()=>{})
	if(getStorage_res){

	}else{
		
	}
}

async function checkToken(){
	const checkToken_res = await promisic(wx.request)({
		url: request_urls.get_specification_info,
		data: {
			product__type_classification__id: type_id,
			page: page,
			page_size: page_size,
			ordering: ordering_field,
		},
	}).catch(()=>{})
	if(getStorage_res){

	}else{
		
	}
}

module.exports = {
	getStorage:getStorage
}