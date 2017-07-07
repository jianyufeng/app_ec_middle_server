/**
 * 接口地址：/user/findPassword
 * 接口名称: 找回密码
 * @author:zlw
 * @date:2017.3.29
 */
exports.findPassword = function( req, res ){
    //获取参数
    var bodyParams = req.routeInfo.bodyParams;
    //用户手机
    var mobile = '';
    var salt = 0;

    if( bodyParams.new_password !== bodyParams.repeat_password ){
        return RES.response( res, false, '两次输入的密码不一致' );
    }

    //流程处理
    var procession = {
        //获取用户详情
        searchUserDetail:function( cb ){
            R.SEND_HTTP(
                req,
                {
                    url:CORE_APIConfig.coreAPI.searchUserDetail,
                    method: 'POST',
                    params: {
                        user_name: bodyParams.user_name
                    },
                    data: {
                        fields: {
                            mobile_phone: '',
                            ec_salt: ''
                        }
                    }
                },
                function( err, data ){
                    if( err ){
                        return RES.response( res, false, data );
                    }

                    if( !data.mobile_phone ){
                        return RES.response( res, false, '用户手机号获取失败' );
                    }else{
                        mobile = data.mobile_phone;
                        salt = data.ec_salt;
                    }
                    cb();
                }
            );
        }
    };

    switch( bodyParams.verification_type ){
        case 'sms':
            //验证短信验证码
            procession.verify = ['searchUserDetail', function( cb ){
                R.SEND_HTTP(
                    req,
                    {
                        url:CORE_APIConfig.coreAPI.verifySmsCode,
                        method: 'POST',
                        data: {
                            mobile: mobile,
                            verification_code: bodyParams.verification_code
                        }
                    },
                    function( err, data ){
                        //if( err ){
                        //    return RES.response( res, false, data );
                        //}

                        cb();
                    }
                );
            }];
            break;
        case 'ciphers':
            //密保卡验证（预留）
            break;
        default:
            return RES.response( res, false, '验证模式错误' );
    }

    //修改用户密码
    procession.updateUserInfo = ['verify', function( cb ){
        var newPassword = '';
        if( parseInt( salt ) ){
            newPassword = common.md5( common.md5(bodyParams.new_password)+salt );
        }else{
            newPassword = common.md5( bodyParams.new_password );
        }

        R.SEND_HTTP(
            req,
            {
                url:CORE_APIConfig.coreAPI.updateUserInfo,
                method: 'POST',
                data: {
                    user_name: bodyParams.user_name,
                    password: newPassword,
                    MODIFIED_ON: common.mysqlTime()
                }
            },
            function( err, data ){
                if( err ){
                    return RES.response( res, false, data );
                }

                cb(0);
            }
        );
    }];

    //创建任务流
    async.auto( procession, function( err, result ){
        if( err ){
            RES.response(res, false, results);
        }else{
            //发送账户信息修改通知
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.accountChangeNotice,
                    method : 'POST',
                    data : {
                        user_name: bodyParams.user_name,
                        mobile: mobile,
                        content: '新密码为'+ bodyParams.new_password +'，'
                    }
                },
                function (err, data) {
                }
            );

            RES.response(res, true, '转账成功');
        }
    });
};
