exports.getUserInfoByToken = function( req, res ){
    //获取参数
    var restfulParams = req.routeInfo.restfulParams;

    //返回值
    var resData = {};

    //创建任务流
    async.auto({
        //获取用户名
        searchToken:function( cb ){
            R.SEND_HTTP(
                req,
                {
                    url:CORE_APIConfig.coreAPI.searchToken,
                    method: 'POST',
                    params: {
                        token_value: restfulParams.token
                    },
                    data: {
                        fields: {
                            token_username: ''
                        }
                    }
                },
                function( err, data ){
                    if( err ){
                        return RES.response( res, false, data );
                    }

                    if( !data || !data[0].token_username ){
                        return RES.response( res, false, {
                            message: 'token信息获取失败'
                        } );
                    }else{
                        resData.user_name = data[0].token_username;
                    }

                    cb();
                }
            );
        },

        //获取用户id
        searchUserDetail: ['searchToken', function( cb ){
            R.SEND_HTTP(
                req,
                {
                    url:CORE_APIConfig.coreAPI.searchUserDetail,
                    method: 'POST',
                    params: {
                        user_name: resData.user_name
                    },
                    data: {
                        fields: {
                            user_id: '',
                            user_name: '',
                            IS_VIP: '',
                            IS_PI_FA: '',
                            REGISTER_GRADE: '',
                            ZHUAN_MAI_DIAN_GRADE: '',
                            user_money: '',
                            fxp_money: '',
                            fxp_points: '',
                            INTEGRAL: '',
                            IS_SUO_INTEGRAL: '',
                            MEMBER_MANAGE_GRADE: '',
                            MEMBER_GRADE: ''
                        }
                    }
                },
                function( err, data ){
                    if( err ){
                        return RES.response( res, false, data );
                    }

                    if( !data || !data.user_id ){
                        return RES.response( res, false, {
                            message: '用户信息获取失败'
                        } );
                    }else{
                        resData = data;

                        //返回成功信息
                        RES.response( res, true, resData );
                    }
                }
            );
        }],
    }, function( err, result ){
        err && RES.response( res, false, result );
    });
};
