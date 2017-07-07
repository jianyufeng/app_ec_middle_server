/****************************
 * 缓存操作类
 ****************************/

function Cache() {}

//设置内存缓存信息
Cache.prototype.setMemoryCache = function (apiInfo,cacheData) {

	//判断是否需要进行内存缓存操作,基本配置信息
	if (!config.base.isMemoryCache) {
		return false;
	}

	//获取该接口是否开启缓存权限
	var apiName = apiInfo.apiFullName;

	//获取私有缓存配置信息
	var customCacheInfo = APIConfig.API[apiName].cache;

	//判断接口自身权限是否允许被缓存
	if (customCacheInfo != undefined) {
		if (!customCacheInfo.isMemoryCache && customCacheInfo.isMemoryCache != undefined) {
			return false;
		}
	}

	//获取缓存有效时间
	var cacheExpiration = config.base.cacheExpiration;

	//查看是否有私有设置的有效时间
	if (customCacheInfo != undefined) {
		if (customCacheInfo.cacheExpiration != undefined) {
			cacheExpiration = customCacheInfo.cacheExpiration;
		}
	}

	//生成需要缓存的KEY名，根据RESTFUL接口全名
	var cacheKeyName = apiInfo.reqUrl;

	//将需要缓存的数据字符串化
	var cacheData = JSON.stringify(cacheData);

	//向缓存数据库中写入缓存
	redisClient.set(cacheKeyName,cacheData,function(err,reply){

		//判断是否设置成功
		if(err){
			console.log("内存缓存失败");
			return;
		}

		//设置失效时间
		redisClient.expire(cacheKeyName,cacheExpiration);

		console.log("内存缓存成功");
		console.log(reply);
	});

};

//获取内存缓存信息
Cache.prototype.getMemoryCache = function(req,res,next){

	//如果不是GET请求直接通过
	if(req.method != 'GET'){
		return next();
	}

	//判断是否读取内存缓存
	if(!config.base.isGetMemoryCache){
		return next();
	}


	//获取完成RESTFUL名
	var restfulAPIName = req.routeInfo.reqUrl;

	//查询该接口是否有内存缓存
	redisClient.get(restfulAPIName, function(err, reply) {

		if(err || reply == null){
			console.log("内存缓存读取失败");
			next();
		}else{
			//直接返回缓存结果
			console.log("读取缓存数据...");
			RES.response(res, true, JSON.parse(reply));
		}



	});


};

module.exports = Cache;