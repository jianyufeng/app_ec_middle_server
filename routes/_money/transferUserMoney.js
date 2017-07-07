/*
 * 接口地址 : /money/transferUserMoney
 * 接口名称 : 用户电子币转账
 * 开发人员 : zlw
 */
exports.transferUserMoney = function(req,res){
    //获取RESTFUL参数
    var bodyParams = req.routeInfo.bodyParams;

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
                            user_money: ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }

                    if( data.SECOND_PASSWORD !== common.md5( bodyParams.SECOND_PASSWORD ) ){
                        RES.response(res, false, '二级密码输入错误');
                    }else if( data.user_money < bodyParams.amount ){
                        RES.response(res, true, '当前账户余额不足');
                    }

                    mobile = data.mobile_phone;
                    callback();
                }
            );
        }
    };

    //判断验证方式
    if( 1 == bodyParams.verificationType ){
        //短信验证
        option.verifyCode = ['searchUserDetail', function( callback ){
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
                        return callback(err, data);
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

    //电子币转账
    option.transferMoney = ['verifyCode', function( callback ){
        R.SEND_HTTP(
            req,
            {
                url    : CORE_APIConfig.coreAPI.transferUserMoney,
                method : 'POST',
                data : {
                    user_id: bodyParams.user_id,
                    user_name: bodyParams.user_name,
                    target_user_name: bodyParams.target_user_name,
                    amount: bodyParams.amount,
                    remark: bodyParams.remark || ''
                }
            },
            function (err, data) {
                //判断是否有错误信息
                if (err) {
                    return callback(err, data);
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
                        money: bodyParams.amount,
                        type: 2, //资金变动类型 1-消费 2-转账 3-充值
                        fund_type: 1 //资产类型 1-电子币 2-辅销品币 3-辅销品换购代金券
                    }
                }
            );
            RES.response(res, true, '转账成功');
        }
    });

};