exports.transferFxpPoints = function(req,res){
    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //验证转入用户不能为转出用户
    if( bodyParams.user_name == bodyParams.target_user ){
        RES.response(res, false, '转入用户不能为自己');
    }

    //返回结果
    var resData = {};

    //用户手机号
    var mobile = '';

    var option = {
        //获取用户信息
        searchUserDetail: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchUserDetail,
                    method : 'POST',
                    params : {
                        user_id: bodyParams.user_id
                    },
                    data : {
                        fields:{
                            mobile_phone : '',
                            SECOND_PASSWORD: '',
                            fxp_points: '',
                            user_name: ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response(res, false, data);
                    }
					
                    if( !data.user_name ){
                        return RES.response(res, false, '用户信息获取失败');
                    }else if( data.SECOND_PASSWORD !== common.md5( bodyParams.SECOND_PASSWORD ) ){
                        return RES.response(res, false, '二级密码输入错误');
                    }else if( parseInt( data.fxp_points ) < parseInt( bodyParams.point ) ){
                        return RES.response(res, false, '辅销品换购代金券不足11');
                    }

                    mobile = data.mobile_phone;
                    callback();	
                }
            );
        },
        //获取用户信息
        searchOutUserDetail: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchUserDetail,
                    method : 'POST',
                    params : {
                        user_name: bodyParams.target_user
                    },
                    data : {
                        fields:{
                            user_id : ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response(res, false, data);
                    }

                    if( !data.user_id ){
                        return RES.response(res, false, '收款用户不存在');
                    }

                    callback();
                }
            );
        }
    };

    //判断验证方式
    if( 1 == bodyParams.verificationType ){
        //短信验证
        option.verifyCode = ['searchUserDetail', 'searchOutUserDetail', function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.verifySmsCode,
                    method : 'POST',
                    data : {
                        mobile: mobile,
                        verification_code: bodyParams.verification_code
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response(res, false, data);
                    }

                    callback();
                }
            );
        }];
    }else if( 2 == bodyParams.verificationType ){
        //图片验证码验证
    }else if( 3 == bodyParams.verificationType ){
        //推送验证
    }

    //代金券转账
    option.transferFxpPoints = ['verifyCode', function( callback ){
        R.SEND_HTTP(
            req,
            {
                url    : CORE_APIConfig.coreAPI.transferFxpPoints,
                method : 'POST',
                data : {
                    user_id: bodyParams.user_id,
                    user_name: bodyParams.user_name,
                    target_user: bodyParams.target_user,
                    point: bodyParams.point,
                    remark: bodyParams.remark || ''
                }
            },
            function (err, data) {
                //判断是否有错误信息
                if (err) {
                    return RES.response(res, false, data);
                }

                callback(0);
            }
        );
    }];

    /**
     * 任务流创建
     * 默认短信验证，其他验证方式预留
     */
    async.auto( option, function( err, results ) {
        if( err ){
            RES.response(res, false, results);
        }else{
            //发送资金变动短信提醒
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.changeFundNotice,
                    method : 'GET',
                    data : {
                        mobile:mobile,
                        money: bodyParams.point,
                        type: 2, //资金变动类型 1-消费 2-转账 3-充值
                        fund_type: 3 //资产类型 1-电子币 2-辅销品币 3-辅销品换购代金券
                    }
                }
            );
            RES.response(res, true, '转账成功');
        }
    });

};