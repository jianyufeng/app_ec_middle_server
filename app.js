/****************************
 * 名称：API接口服务器
 * 功能：商城移动端
 ****************************/

/**
 * 导入需要的第三方模块
 **/
var express    = require('express');
var http 	   = require('http');
var bodyParser = require('body-parser');


/**
 * 获取配置信息
 **/
global.config    = require('./config').configInfo;


/**
 * 创建公共全局变量
 **/
global.log4js	   		  = require('log4js');
global.async     		  = require('async');
global.APIConfig 		  = require('./api/api');
global.CORE_APIConfig     = require('./api/core_api');
global.RES  	   		  = require('./lib/response');
global.R  	    		  = require('./lib/request');
global.MESSAGE   		  = require('./message/message');
global.common    		  = require('./lib/commonFunc');
global.V   				  = require('./lib/verification');
global.auth      		  = require("./lib/auth");
global.regexpRule     	  = require("./lib/regexpConfig").regexpRule;
global.redis   			  = require("redis");
global.request    		  = require('request');

/**
 * 配置日志信息
 **/
log4js.configure({
	appenders : config.log4.appenders
});


/**
 * 创建redis操作对象
 **/
var Redis = require("./lib/redisClass");
var redis = new Redis();

//连接redis数据库
global.redisClient = redis.connectRedis(config.redisConfig);


/**
 * 创建缓存操作对象
 **/
var Cache	= require('./lib/cacheClass');
global.cache = new Cache();


/**
 * 创建局部工具变量
 **/
var urlFilter = require("./lib/urlFilter");
var urlParse  = require("./lib/urlParse");

/**
 * 生成http服务对象
 **/
var app = express();


/**
 * 加载中间件部分
 **/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


/**
 * URL检测
 **/
app.all("*",function(req,res,next){
	  urlFilter['Url'](req,res,next);
});


/**
 * ec_web_api接口路由部分
 * urlParse.APIisExist  				  : 查看该接口是否存在
 * urlParse.APIisMethod  				  : 查看该接口请求方式是否正确
 * urlParse.APIgetParams 				  : 解析接口参数信息
 * urlParse.APIParamsVerification : 参数格式验证
 * cache.getMemoryCache						: 获取内存缓存信息
 **/
// app.all(["/:firstMenuLevel/:secondMenuLevel/*","/:firstMenuLevel/:secondMenuLevel"],
// 	urlFilter.FuleKey,
// 	urlParse.APIisExist,
// 	urlParse.APIisMethod,
// 	urlParse.APIgetParams,
// 	urlParse.APIParamsVerification,
// 	cache.getMemoryCache,
// 	function(req,res) {

// 		if(config.base.isOnAuth){

// 			//验权操作
// 			auth.authAction(req,res,function(){

// 				//获取请求路由
// 				var route = require("./routes" + req.routeInfo.apiFullName);

// 				//执行接口处理方法
// 				route[req.routeInfo.secondMenuLevelName](req,res);

// 			});

// 		}else{

// 			//获取请求路由
// 			var route = require("./routes" + req.routeInfo.apiFullName);

// 			//执行接口处理方法
// 			route[req.routeInfo.secondMenuLevelName](req,res);

// 		}

// });

/**
 * ec_web_api接口路由部分
 * urlFilter.FuleKey                   : 服务器秘钥验证
 * urlParse.APIisExist  				   : 查看该接口是否存在
 * urlParse.APIisMethod  			   : 查看该接口请求方式是否正确
 * urlParse.APIgetParams 			   : 解析接口参数信息
 * urlParse.API_forwarded              : 接口转发处理
 * urlParse.APIParamsVerification      : 参数格式验证
 * cache.getMemoryCache				   : 获取内存缓存信息
 **/
app.all(["/:firstMenuLevel/:secondMenuLevel/*","/:firstMenuLevel/:secondMenuLevel"],
	urlFilter.FuleKey,
	urlParse.APIisExist,
    urlParse.APIisMethod,
	urlParse.APIgetParams,
	auth.verifyUserPermissions,
    urlParse.API_forwarded,
	urlParse.APIParamsVerification,
	cache.getMemoryCache,
	function(req,res) {

        //判断是否开启用户数据验权操作
        // if( config.base.isOnDataPmsValid ){
        //     procession[procession.length] = function( cb ){

        //         auth.verifyUserPermissions( req, res, cb );
        //     };
        // }

        // //流程控制
        // if( procession.length ){
        //     async.waterfall(procession, function( err, result ){
        //         //获取请求路由
        //         var route = require("./routes" + req.routeInfo.apiFullName);

        //         //执行接口处理方法
        //         route[req.routeInfo.secondMenuLevelName](req,res);
        //     });
        // }else{
            //获取请求路由
            var route = require("./routes" + req.routeInfo.apiFullName);

            //执行接口处理方法
            route[req.routeInfo.secondMenuLevelName](req,res);
       // }
});


/**
 * 启动服务器
 **/
if(config.base.isClusterStart){  //判断是否以集群方式启动

	//导入群集处理模块
	var cluster 	 = require('cluster');
	var os 				 = require('os');

	//获取 CPU 的数量
	var cpuCount = os.cpus().length;

	//声明工作进程池
	var workers = {};


	if(cluster.isMaster) {

		//当一个工作进程结束时，重启工作进程
		cluster.on('death', function (worker) {
			delete workers[worker.pid];
			worker = cluster.fork();
			workers[worker.pid] = worker;
		});

		// 声明工作进程
		var worker;

		// 开启与 CPU 数量相同的工作进程
		for (var i = 0; i < cpuCount; i++) {
			worker = cluster.fork();
			workers[worker.pid] = worker;
		}

	}else{

		//启动服务器
		http.createServer(app).listen(config.server.port, function(){
			console.log('服务器正常启动...端口号:' + config.server.port);
		});

	}

	// 当主进程被终止时，关闭所有工作进程
	process.on('SIGTERM', function () {
		for (var pid in workers) {
			if (!workers.hasOwnProperty(pid)) {
				continue;
			}
			process.kill(pid);
		}
		process.exit(0);
	});

}else{

	//启动服务器
	http.createServer(app).listen(config.server.port, function(){
		console.log('服务器正常启动...端口号:' + config.server.port);
	});

}