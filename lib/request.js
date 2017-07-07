/****************************
 * 常用基本－网络请求公共方法
 ****************************/

/**
 * GET请求共通方法
 **/
exports.SEND_HTTP = function(req,options,cb){

	//最终请求参数
	var httpOptions = {};

	//查看是否有token信息,并获取
	var token = req.headers["x-token"] == undefined ? "" : req.headers["x-token"];

	//判断是否有RESTFUL参数
	var restfulParams = "";
	if(!(common.isNullObj(options.params))){
		  restfulParams = common.JsonTransformRestFulParams(options.params);
	}

	//设置请求地址
	httpOptions.url = options.url + restfulParams;
	
	console.log(httpOptions.url);
	//设置请求方式
	httpOptions.method = options.method != 'GET'  ? "POST" : 'GET';


	//设置BODY参数
	httpOptions.form = options.data == undefined ? {} : options.data;

	//设置返回值类型
	httpOptions.json = true;

	//设置头信息
	httpOptions.headers = {};

		//发起HTTP请求
	request(httpOptions,function(error,response,body){
			
			//判断是否请求有错误
			if(error){
				 return cb(true,MESSAGE.netWorkError.noNetWork);
			}

			//判断是否有业务错误
			if(!error && response.statusCode == 200){

				//返回业务错误信息
				if(!body.success){
					 return cb(true,body.error && body.error.message);
				}

				//返回最终结果
				cb(false,body.result);

			}

	});

};
