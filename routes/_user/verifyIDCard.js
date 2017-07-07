exports.verifyIDCard = function(req,res) {
    //获取body参数
    var restfulParams = req.routeInfo.restfulParams;

    //一个身份证最大允许申请账号数，默认15
    var limitNum = 15;

    //创建任务流
    async.auto({
        //获取商城配置项
        getWebsiteConfig: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.getWebsiteConfig,
                    method : 'POST',
                    data : {
                        keys : [
                            'MAX_ALLOW_APPLY_ACCOUNT'
                        ]
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response( res, false, data );
                    }

                    limitNum = data['MAX_ALLOW_APPLY_ACCOUNT']['PARAM_VALUE'] || limitNum;
                    callback();
                }
            );
        },

        //验证该身份证下已申请的账号数
        searchUserList:[ 'getWebsiteConfig', function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url : CORE_APIConfig.coreAPI.searchUserList,
                    method : 'POST',
                    params : {
                        ID_CARD: restfulParams.id_card,
                        activation_time: 1,
                        skip: 0,
                        limit: 16
                    },
                    data: {
                        fields: {
                            user_id: ''
                        }
                    }
                },
                function( err, data ){
                    if( err ){
                        return RES.response( res, false, data );
                    }

                    console.log(data);
                    if( !data ){
                        return RES.response( res, false, '数据获取失败' );
                    }else if( data.count > limitNum  ){
                        return RES.response( res, false );
                    }else{
                        return RES.response( res, true );
                    }
                }
            );
        } ],
    },function( err, result ){
        //出错
        err && RES.response( res, false, result );
    });

};
