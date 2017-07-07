/****************************
 * 验权请求
 ****************************/

(function () {

	/**
	 * 向验权服务器获取身份令牌操作
	 **/
	exports.authAction = function (req,res,cb) {

		//判断是否为post请求,暂定只有post请求才需要验权
		if(req.method != 'POST'){
			cb();
		}

		//获取当前请求参数
		var params = req.body;

		//新增appid参数
		params.appid = config.base.appid;

		//获取参数签名串
		var sign = common.getMD5ParamsStr(config.base.appsercet,params);

		//新增签名串参数
		params.sign  = sign;

		R.SEND_HTTP(
				req,
				{
					url    : config.authServerConfig.url,
					method : 'POST',
					data   : params
				},
				function (err, data) {

					if(err){
						 return RES.response(res,false,data);
					}

					//向header头部写入服务器token
					req.headers['x-serverToken'] = data;

					//写入该服务器的appid
					req.headers['x-appid'] = config.base.appid;

					//返回服务器token
					cb();


				});
	};


    /**
     * 用户数据验权操作
     */
    exports.verifyUserPermissions = function (req, res, cb) {

   
        //判断是否开启用户数据验权操作
		if(!config.base.isOnDataPmsValid) {
			return cb();
		}

		//判断请求接口是否需要数据验权
		var interfaceConfig = require('./../whitePmsInterface.js').whitePmsInterface;
		for(var i in interfaceConfig) {
			if(req.routeInfo.apiFullName == interfaceConfig[i]) {
				return cb();
			}
		}



		if(!req.headers["x-token"]) {
            
			return RES.response(res, false, {
				status: 1,
				message: '权限不足'
			});
		}

		R.SEND_HTTP(
			req, {
				url: CORE_APIConfig.coreAPI.searchToken,
				method: 'GET',
				params: {
					token_value: req.headers["x-token"],
					prefix: 'web'
				}
			},
			function(err, data) {
				if(err) {
					return RES.response(res, false, {
						status: -1,
						message: data
					});
				}

    
				//判断登录是否超时
				if(data.dead_time < new Date().getTime() / 1000) {
					return RES.response(res, false, {
						status: -1,
						message: '登录超时，请重新登录!'
					});
				}

				console.log('---------------- 进行验权 ------------------');
				var params = req.routeInfo.restfulParams || req.routeInfo.bodyParams;
				if(params.user_id && params.user_id != data.user_id || params.user_name && params.user_name != data.user_name ||
					params.USER_ID && params.USER_ID != data.user_id || params.USER_NAME && params.USER_NAME != data.user_name) {
					return RES.response(res, false, {
						status: 0,
						message: '非法请求!'
					});
				}

				cb();
			}
		);
    };

}).call(this);