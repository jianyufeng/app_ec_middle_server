exports.verifyUserPassword = function(req,res){

	//获取BODY参数
	var bodyParams = req.routeInfo.bodyParams;

    //获取用户密码
    R.SEND_HTTP(
        req,
        {
            url    : CORE_APIConfig.coreAPI.searchUserDetail,
            method : 'POST',
            params : {
                user_id : bodyParams.user_id
            },
            data : {
                fields:{
                    password : '',
                    SECOND_PASSWORD: '',
                    THREE_PASSWORD: ''
                }
            }
        },
        function (err, data) {
            //判断是否有错误信息
            if (err) {
                RES.response( res, false, data );
            }

            if( !data || !data[bodyParams['type']] ){
                RES.response( res, false, '用户信息获取失败' );
            }else{
                if( data[bodyParams.type] !== common.md5( bodyParams.password ) ){
                    RES.response( res, false, '' );
                }else{
                    RES.response( res, true , '' );
                }
            }
        }
    );

};