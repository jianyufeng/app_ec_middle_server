exports.search = function(req,res){

    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams || {};

    //返回结果
    var resData = [];

    /**
     * 任务流创建    
     */
    async.auto({
        //获取购物车信息
        searchCartList: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchCart,
                    method : 'GET',
                    params : restfulParams
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        callback(err, data);
                    }else{
                        resData = data;
                        callback();
                    }
                }
            );
        },

     
        //解析数据
        parseData: ['searchCartList', function( callback ){
            callback( 0, resData );
        }]

    }, function( err, results ) {
        //检测是否有错误发生
        err ? RES.response(res, false, results) : RES.response(res, true, resData);
    });

    
}