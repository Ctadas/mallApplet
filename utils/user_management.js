import { promisic } from '../miniprogram_npm/lin-ui/utils/util.js'

async function getStorage(){
	const getStorage_res = await promisic(wx.getStorage)({
		key: 'aa',
	}).catch(()=>{})
	if(getStorage_res){

	}else{
		
	}
}

module.exports = {
	getStorage:getStorage
}