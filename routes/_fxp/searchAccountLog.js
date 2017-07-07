exports.searchAccountLog = function(req,res){
    //返回结果
    var resData = {};

    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams;
    //获取user_money不为0的记录
    restfulParams.user_money = 'user_money-neq-0';

    //任务流创建
    async.auto({
        //查询用户现金记录
        searchAccountLog: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchAccountLog,
                    method : 'POST',
                    params : restfulParams,
                    data : {
                        fields:{
                            change_time : '',
                            user_money : '',
                            change_desc : ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }

                    resData['log_info'] = data;
                    callback();
                }
            );
        },

        //查询用户详情
        searchUserDetail: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchUserDetail,
                    method : 'POST',
                    params : {
                        user_id : restfulParams.user_id
                    },
                    data : {
                        fields:{
                            user_money : ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }

                    resData['user_money'] = data['user_money'] || 0;
                    callback();
                }
            );
        },

        //解析数据
        parseData: ['searchAccountLog', 'searchUserDetail', function( callback ){
            //返回结果
            RES.response(res, true,  resData);
        }]

    }, function( err, results ) {
        //检测是否有错误发生
        err && RES.response(res, false, results);
    });

};