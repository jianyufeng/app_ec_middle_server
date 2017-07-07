exports.verifyUserName = function(req,res){

	//获取BODY参数
	var restfulParams = req.routeInfo.restfulParams;

    //验证用户名不能以xlzj开头
    if( restfulParams.user_name.toLowerCase().indexOf( 'xlzj' ) === 0 ){
        RES.response( res, false, '用户名不能以"xlzj"开头' );
    }
    //验证用户名在6~16位之间
    if( restfulParams.user_name.length < 6 || restfulParams.user_name.length > 16 ){
        RES.response( res, false, '建议用户名长度在6~16字符之间' );
    }

    //验证用户名
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
                    user_id : '',
                }
            }
        },
        function (err, data) {
            //判断是否有错误信息
            if (err) {
                RES.response( res, false, data );
            }

            if( data && data['user_id'] ){
                RES.response( res, false, {
                    message: '该用户名已经被注册'
                } );
            }else{
                RES.response( res, true );
            }

        }
    );

};