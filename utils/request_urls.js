let domain = 'http://127.0.0.1:8000/';

module.exports = {
	base_domain: domain,
	//获取推荐信息
	get_specification_info: domain +'ProductManagement/specification/',
	get_classifications: domain + 'ProductManagement/classification/'
}