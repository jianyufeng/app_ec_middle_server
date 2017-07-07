exports.searchUserAccount = function(req,res){
    //返回结果
    var resData = {};

    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams;

    //任务流创建
    async.auto({
        //查询第三方支付记录
        searchUserAccount: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchUserAccount,
                    method : 'POST',
                    params : restfulParams,
                    data : {
                        fields:{
                            add_time : '',
                            amount : '',
                            admin_note : '',
                            user_note : '',
                            is_paid : ''
,                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }

                    resData['account_info'] = data;
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
                        user_name : restfulParams.user_name
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
        parseData: ['searchUserAccount', 'searchUserDetail', function( callback ){
            //返回结果
            RES.response(res, true,  resData);
        }]

    }, function( err, results ) {
        //检测是否有错误发生
        err && RES.response(res, false, results);
    });

};