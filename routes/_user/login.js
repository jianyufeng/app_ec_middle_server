/*
 * 接口地址 : /user/login
 * 接口名称 : 商城用户登录
 * 开发人员 : zlw
 */
exports.login = function(req,res){

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;
    //用户手机
    var mobile = '';

    //返回结果
    var resData = {};

    //mysql日期时间
    var date = common.mysqlTime();

    //流程处理
    var procession = {
        //验证用户信息
        login: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchUserDetail,
                    method : 'POST',
                    params : {
                        user_name : bodyParams.user_name
                    },
                    data : {
                        fields:{
                            user_id : '',
                            password : '',
                            DATALIFECYCLE : '',
                            mobile_phone : 'mobile',
                            ec_salt: ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }

                    //判断用户是否存在
                    if( !data || !data.user_id ){
                        return RES.response(res, false, {message:'用户名不存在'});
                    }

                    //判断当前用户账号是否被禁用
                    if( data.DATALIFECYCLE === 'F' ){
                        return RES.response(res, false, {message:'当前账号被禁用，请联系管理员'});
                    }

                    //判断用户密码是否正确
                    if( parseInt( data.ec_salt ) && data.password !== common.md5( common.md5(bodyParams.password)+data.ec_salt )
                        || !parseInt( data.ec_salt ) && data.password !== common.md5( bodyParams.password ) ){
                        return RES.response(res, false, {message:'用户密码错误'});
                    }

                    if( data.mobile ){
                        mobile = data.mobile;
                    }else{
                        return RES.response(res, false, {message:'未查询到该用户的手机信息'});
                    }
                    resData.user_id = data.user_id;
                    resData.user_name = bodyParams.user_name;
                    callback();
                }
            );
        },
    };

    //判断验证模式
    switch( bodyParams.verification_mode.toUpperCase() ){
        case 'CODE':
            if( !bodyParams.code ){
                return RES.response(res, false, {message:'验证码不能为空'});
            }

            //验证手机验证码
            procession.verification = ['login',function( callback ){
                R.SEND_HTTP(
                    req,
                    {
                        url    : CORE_APIConfig.coreAPI.verifySmsCode,
                        method : 'POST',
                        data : {
                            mobile : mobile,
                            verification_code : bodyParams.code,
                        }
                    },
                    function (err, data) {
                        //判断是否有错误信息
                        //if (err) {
                        //    return RES.response( res, false, data );
                        //}

                        callback();
                    }
                );
            }];

            break;
        case 'CIPHER':
            if( !bodyParams.code ){
                return RES.response(res, false, {message:'令牌不能为空'});
            }

            //验证令牌
            procession.verification = ['login',function( callback ){
                R.SEND_HTTP(
                    req,
                    {
                        url    : CORE_APIConfig.coreAPI.searchCiphertext,
                        method : 'GET',
                        params : {
                            user_name : bodyParams.user_name,
                            limit : 1
                        }
                    },
                    function (err, data) {
                        //判断是否有错误信息
                        if (err) {
                            return RES.response( res, false, data );
                        }

                        //令牌信息
                        if( 0 == data.count ){
                            return RES.response(res, false, {message:'当前用户暂无令牌'});
                        }

                        var ciphertext = data['data'][0]['ciphertext'];
                        if( ciphertext != bodyParams.code ){
                            return RES.response(res, false, {message:'登录令牌输入错误'});
                        }

                        //判断用户令牌是否过期
                        if( new Date().getTime() / 1000  > data['data'][0]['end_time'] ){
                            return RES.response(res, false, {message:'当前令牌已失效'});
                        }

                        callback();
                    }
                );
            }];

            break;
        case 'CARD':
            if( !bodyParams.ciphers ){
                return RES.response(res, false, {message:'密保卡值不能为空'});
            }

            //验证密保卡
            procession.verification = ['login',function( callback ){
                R.SEND_HTTP(
                    req,
                    {
                        url    : CORE_APIConfig.coreAPI.searchUserSecurity,
                        method : 'POST',
                        params:{
                            user_id: resData.user_id,
                            status: 1   //已绑定
                        },
                        fields:{
                            mb_code : '',
                        }
                    },
                    function (err, data) {
                        //判断是否有错误信息
                        if (err) {
                            return RES.response( res, false, data );
                        }

                        //密保卡信息
                        if( 0 == data.count ){
                            return RES.response(res, false, {message:'当前用户未绑定密保卡，请选择其他验证方式'});
                        }
                        var cardInfo = data['data'][0]['mb_code'];
                        // 用户输入密保值
                        var ciphers = bodyParams.ciphers;
                        //密保值是否正确
                        var result = true;
                        for( var i in ciphers ){
                            if( ciphers[i] != cardInfo[i] ){
                                result = false;
                            }
                        }
                        if( 0 && !result ){
                            return RES.response(res, false, {message:'密保值错误'});
                        }else{
                            callback();
                        }
                    }
                );
            }];
            break;
        default:
            return RES.response(res, false, {message:'登录模式错误'});
    }

    //验证通过，生成用户token
    procession.createToken = ['verification',function( callback ){
        R.SEND_HTTP(
            req,
            {
                url    : CORE_APIConfig.coreAPI.addUserToken,
                method : 'POST',
                data : {
                    user_name: bodyParams.user_name,
                    user_id: resData.user_id,
                    prefix: 'web'
                }
            },
            function (err, data) {
                //判断是否有错误信息
                if (err) {
                    return RES.response( res, false, data );
                }

                resData.token = data;
                callback();
            }
        );
    }];

    //更新用户登录时间
    procession.updateUserInfo = ['verification',function( callback ){
        R.SEND_HTTP(
            req,
            {
                url    : CORE_APIConfig.coreAPI.updateUserInfo,
                method : 'POST',
                data : {
                    user_name: bodyParams.user_name,
                    last_time: date,
                    last_login: common.nowTime()
                }
            },
            function (err, data) {
                callback();
            }
        );
    }];

    //返回结果
    procession.parseData = ['updateUserInfo', 'createToken', function(){
        RES.response(res, true, resData);
    }];

    //任务流创建
    async.auto(procession, function( err, results ) {
        //检测是否有错误发生
        err && RES.response(res, false, results);
    });

};

// /*
//  * 接口地址 : /user/login
//  * 接口名称 : 商城用户登录
//  * 开发人员 : zlw
//  */
// exports.login = function(req,res){

//     //获取body参数
//     var bodyParams = req.routeInfo.bodyParams;
//     //用户手机
//     var mobile = '';

//     //返回结果
//     var resData = {};

//     //mysql日期时间
//     var date = common.mysqlTime();

//     //流程处理
//     var procession = {
//         //验证用户信息
//         login: function( callback ){
//             R.SEND_HTTP(
//                 req,
//                 {
//                     url    : CORE_APIConfig.coreAPI.searchUserDetail,
//                     method : 'POST',
//                     params : {
//                         user_name : bodyParams.user_name
//                     },
//                     data : {
//                         fields:{
//                             user_id : '',
//                             password : '',
//                             DATALIFECYCLE : '',
//                             mobile_phone : 'mobile',
//                             ec_salt: ''
//                         }
//                     }
//                 },
//                 function (err, data) {
//                     //判断是否有错误信息
//                     if (err) {
//                         return callback(err, data);
//                     }

//                     //判断用户是否存在
//                     if( !data || !data.user_id ){
//                         return RES.response(res, false, {message:'用户名不存在'});
//                     }

//                     //判断当前用户账号是否被禁用
//                     if( data.DATALIFECYCLE === 'F' ){
//                         return RES.response(res, false, {message:'当前账号被禁用，请联系管理员'});
//                     }

//                     //判断用户密码是否正确
//                     if( parseInt(data.ec_salt) && data.password !== common.md5( common.md5(bodyParams.password)+ data.ec_salt)
//                         || !parseInt(data.ec_salt) && data.password !== common.md5( bodyParams.password ) ){
//                         return RES.response(res, false, {message:'用户密码错误'});
//                     }

//                     if( data.mobile ){
//                         mobile = data.mobile;
//                     }else{
//                         return RES.response(res, false, {message:'未查询到该用户的手机信息'});
//                     }
//                     resData.user_id = data.user_id;
//                     resData.user_name = bodyParams.user_name;
//                     callback();
//                 }
//             );
//         },
//     };

//     //判断验证模式
//     switch( bodyParams.verification_mode.toUpperCase() ){
//         case 'CODE':
//             if( !bodyParams.code ){
//                 RES.response(res, false, {message:'验证码不能为空'});
//             }

//             //验证手机验证码
//             procession.verification = ['login',function( callback ){
//                 R.SEND_HTTP(
//                     req,
//                     {
//                         url    : CORE_APIConfig.coreAPI.verifySmsCode,
//                         method : 'POST',
//                         data : {
//                             mobile : mobile,
//                             verification_code : bodyParams.code,
//                         }
//                     },
//                     function (err, data) {
//                         //判断是否有错误信息
//                         //if (err) {
//                         //    return callback(err, data);
//                         //}

//                         callback();
//                     }
//                 );
//             }];

//             break;
//         case 'CIPHER':
//             if( !bodyParams.code ){
//                 RES.response(res, false, {message:'令牌不能为空'});
//             }

//             //验证令牌
//             procession.verification = ['login',function( callback ){
//                 R.SEND_HTTP(
//                     req,
//                     {
//                         url    : CORE_APIConfig.coreAPI.searchCiphertext,
//                         method : 'GET',
//                         params : {
//                             user_name : bodyParams.user_name,
//                             limit : 1
//                         }
//                     },
//                     function (err, data) {
//                         //判断是否有错误信息
//                         if (err) {
//                             return callback(err, data);
//                         }

//                         //令牌信息
//                         if( 0 == data.count ){
//                             return RES.response(res, false, {message:'当前用户暂无令牌'});
//                         }

//                         var ciphertext = data['data'][0]['ciphertext'];
//                         if( ciphertext != bodyParams.code ){
//                             return RES.response(res, false, {message:'登录令牌输入错误'});
//                         }

//                         //判断用户令牌是否过期
//                         if( new Date().getTime() / 1000  > data['data'][0]['end_time'] ){
//                             return RES.response(res, false, {message:'当前令牌已失效'});
//                         }

//                         callback();
//                     }
//                 );
//             }];

//             break;
//         case 'CARD':
//             if( !bodyParams.ciphers ){
//                 RES.response(res, false, {message:'密保卡值不能为空'});
//             }

//             //验证密保卡
//             procession.verification = ['login',function( callback ){
//                 R.SEND_HTTP(
//                     req,
//                     {
//                         url    : CORE_APIConfig.coreAPI.searchUserSecurity,
//                         method : 'POST',
//                         params:{
//                             user_id: resData.user_id,
//                             status: 1   //已绑定
//                         },
//                         fields:{
//                             mb_code : '',
//                         }
//                     },
//                     function (err, data) {
//                         //判断是否有错误信息
//                         if (err) {
//                             return callback(err, data);
//                         }

//                         //密保卡信息
//                         if( 0 == data.count ){
//                             return RES.response(res, false, {message:'当前用户未绑定密保卡，请选择其他验证方式'});
//                         }
//                         var cardInfo = data['data'][0]['mb_code'];
//                         // 用户输入密保值
//                         var ciphers = bodyParams.ciphers;
//                         //密保值是否正确
//                         var result = true;
//                         for( var i in ciphers ){
//                             if( ciphers[i] != cardInfo[i] ){
//                                 result = false;
//                             }
//                         }
//                         if( 0 && !result ){
//                             return RES.response(res, false, {message:'密保值错误'});
//                         }else{
//                             callback();
//                         }
//                     }
//                 );
//             }];
//             break;
//         default:
//             RES.response(res, false, {message:'登录模式错误'});
//     }

//     //验证通过，生成用户token
//     procession.createToken = ['verification',function( callback ){
//         R.SEND_HTTP(
//             req,
//             {
//                 url    : CORE_APIConfig.coreAPI.addUserToken,
//                 method : 'POST',
//                 data : {
//                     user_name: bodyParams.user_name
//                 }
//             },
//             function (err, data) {
//                 //判断是否有错误信息
//                 if (err) {
//                     return callback(err, data);
//                 }

//                 resData.token = data.token;
//                 callback();
//             }
//         );
//     }];

//     //更新用户登录时间
//     procession.updateUserInfo = ['verification',function( callback ){
//         R.SEND_HTTP(
//             req,
//             {
//                 url    : CORE_APIConfig.coreAPI.updateUserInfo,
//                 method : 'POST',
//                 data : {
//                     user_name: bodyParams.user_name,
//                     last_time: date,
//                     last_login: common.nowTime()
//                 }
//             },
//             function (err, data) {
//                 callback();
//             }
//         );
//     }];

//     //返回结果
//     procession.parseData = ['updateUserInfo', 'createToken', function(){
//         RES.response(res, true, resData);
//     }];

//     //任务流创建
//     async.auto(procession, function( err, results ) {
//         //检测是否有错误发生
//         err && RES.response(res, false, results);
//     });

// };