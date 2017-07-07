/****************************
 * 配置文件
 ****************************/

exports.configInfo = {

  /*** 核心服务器信息 ***/
  core_server : {
    port        : 80,                        			 //端口号
    name        : "ec",                     		   //服务器名称
    //url         : "http://ecommerce.38zs.net:66"   //核心服务器地址
   // url : "http://net.38zs.net:36668/"
    url:"http://192.168.10.90/web_core"
  },

  /*** 服务器配置 ***/
  server : {
    port        : 5000,                    //端口号
    name        : "app_ec_middle_server",  //服务器名称
    crossOrigin : true                     //是否接收跨域请求
  },

  /*** redis缓存数据库配置 ***/
  redisConfig : {
    port             : 6379,
    address          : "127.0.0.1",
    dbName           : 8
  },

  /*** 日志配置 ***/
  log4 : {
    appenders : [
      {
        type       : "dateFile",           //文件输出
        filename   : "logs/system.log",    //日志存放位置
        maxLogSize : 1024,                 //文件大小上限
        backups    : 3                     //日志备份
      }
    ]
  },

  /***** 前段请求验证码*******/
  x_fule_key:{
	key : "jinwandalaohu"	
  },

  /*** 服务器基本配置 ***/
  base : {
    isCrossOrigin     : true,         //是否开启跨域处理
    isClusterStart    : false,        //是否以集群方式启动
    isGetMemoryCache  : false,        //是否读取内存缓存
    isMemoryCache     : false,        //是否进行内存缓存
    cacheExpiration   : 600,          //缓存生效时间
    appid             : 'SBFL00001',  //服务器应用ID
    appsercet         : 'a1b2c3d4e5', //服务器密钥
    isOnAuth          : false,         //是否开启验权操作
    isOnDataPmsValid  : false
  }

};