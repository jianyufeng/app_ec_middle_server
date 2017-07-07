exports.getSmsCode = function( req, res ){

    //获取参数
    var restfulParams = req.routeInfo.restfulParams;
    //用户手机
    var mobile = '';

    //创建任务流
    async.auto({
        //获取用户详情
        searchUserDetail:function( cb ){
            R.SEND_HTTP(
                req,
                {
                    url:CORE_APIConfig.coreAPI.searchUserDetail,
                    method: 'POST',
                    params: {
                        user_name: restfulParams.user_name
                    },
                    data: {
                        fields: {
                            mobile_phone: ''
                        }
                    }
                },
                function( err, data ){
                    if( err ){
                        return cb( err, data );
                    }

                    if( !data.mobile_phone ){
                        RES.response( res, false, '该用户未绑定手机号，或手机号获取失败' );
                    }else{
                        mobile = data.mobile_phone;
                    }
                    cb();
                }
            );
        },

        //发送短信验证码
        sendSmsCode: ['searchUserDetail', function( cb ){
            R.SEND_HTTP(
                req,
                {
                    url:CORE_APIConfig.coreAPI.getVerification,
                    method: 'GET',
                    params: {
                        mobile: mobile
                    }
                },
                function( err, data ){
                    if( err ){
                        return cb( err, data );
                    }

                    //返回成功信息
                    RES.response( res, true, '短信已发送' );
                }
            );
        }],
    }, function( err, result ){
        err && RES.response( res, false, result );
    });
};
