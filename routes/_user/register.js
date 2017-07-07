/*
 * 接口地址 : /user/register
 * 接口名称 : 用户注册
 * 开发人员 : zlw
 */
exports.register = function(req,res){

	//获取BODY参数
	var bodyParams = req.routeInfo.bodyParams;

    //判断两次密码是否一致
    if( bodyParams.password !== bodyParams.confirm_password ){
        return RES.response( res, false, '两次密码输入不一致' );
    }

    //验证用户名不能以xlzj开头
    if( bodyParams.user_name.toLowerCase().indexOf( 'xlzj' ) === 0 ){
        return RES.response( res, false, '用户名不能以"xlzj"开头' );
    }
    //验证用户名在6~16位之间
    if( bodyParams.user_name.length < 6 || bodyParams.user_name.length > 16 ){
        return RES.response( res, false, '建议用户名长度在6~16字符之间' );
    }

    //验证密码不能小于6位
    if( bodyParams.password.length < 6 || bodyParams.SECOND_PASSWORD.length < 6 || bodyParams.THREE_PASSWORD.length < 6 ){
        return RES.response( res, false, '密码长度均不能少于6个字符' );
    }

    //返回结果
    var resData = {};

    //任务流创建
    async.auto({
        //验证短信验证码
        verification: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.verifySmsCode,
                    method : 'POST',
                    data : {
                        mobile : bodyParams.mobile,
                        verification_code : bodyParams.verification_code
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    //if (err) {
                    //    //return RES.response( res, false, data );
                    //}
                    callback();
                }
            );
        },

        //注册用户
        userRegister: ['verification', function(callback){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.addUser,
                    method : 'POST',
                    data : {
                        user_name: bodyParams.user_name,
                        email: bodyParams.email,
                        sex: bodyParams.sex,
                        password: bodyParams.password,
                        SECOND_PASSWORD: common.md5( bodyParams.SECOND_PASSWORD ),
                        THREE_PASSWORD: common.md5( bodyParams.THREE_PASSWORD ),
                        mobile_phone: bodyParams.mobile,
                        last_login: parseInt( new Date().getTime()/1000 )
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response( res, false, data );
                    }
                    resData.user_id = data.newId;
                    callback();
                }
            );
        }],

        //发送注册成功短信
        sendMessage: ['userRegister', function(callback){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.userRegister,
                    method : 'POST',
                    data : {
                        user_name: bodyParams.user_name,
                        mobile: bodyParams.mobile,
                        password: bodyParams.password,
                        SECOND_PASSWORD: bodyParams.SECOND_PASSWORD,
                        THREE_PASSWORD: bodyParams.THREE_PASSWORD,
                        official_website: 'https://www.38.hn',
                    }
                },
                function (err, data) {
                }
            );
        }],

        //创建用户token
        createToken: ['userRegister', function(callback){
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
                    resData.user_name = bodyParams.user_name;
                    RES.response(res, true, resData );
                }
            );
        }]

    }, function( err, results ) {
        //检测是否有错误发生
        err && RES.response(res, false, results);
    });



};