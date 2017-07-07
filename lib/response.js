exports.response = function(res,isSuccess,data,routeInfo){
	

	//判断是否为GET请求，只有GET请求可以被缓存
	if(routeInfo != undefined && routeInfo.method == 'GET' && isSuccess) {
		
			//如果是数组的话，只对有数据的进行缓存
			if(data instanceof Array){

				if(data.length > 0){
					cache.setMemoryCache(routeInfo,data);
				}

			}else{
					cache.setMemoryCache(routeInfo,data);
			}
			
	}

	console.log("数据返回操作.");

	//结果返回
	res.send( { success : isSuccess, result : data } );

};