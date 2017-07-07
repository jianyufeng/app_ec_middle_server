/****************************
 * redis操作类
 ****************************/

function Redis(){

  this.connectRedis = function(redisOptions){

    var redisPort    = redisOptions.port;
    var redisAddress = redisOptions.address;
    var dbName       = redisOptions.dbName;

    //配置连接所需参数
    var options = {
      host : redisAddress,
      port : redisPort,
      db   : dbName
    };

    //连接redis数据库
    var client  = redis.createClient(options);

    //监听redis连接成功通知
    client.on("connect", function(){
        console.log("redis连接成功...");
    });

    //监听redis连接失败通知
    client.on("error", function(err) {
      console.log("redis连接失败,失败原因: " + err);
    });

    return client;

  }



}

module.exports = Redis;

