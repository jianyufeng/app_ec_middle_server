/*
 * 接口地址 : /_bonus/bonusOnUserMoney
 * 接口名称 : 奖金币转电子币
 * 开发人员 : YX 
 * user_id: 'NUMBER', 用户ID
 * bonus: 'MONEY', 转账金额
 * THREE_PASSWORD: '', 三级密码
 * verification_type: 'NUMBER', 验证类型
 * verification_code: 'NUMBER' 验证码
 */
exports.bonusOnUserMoney = function(req,res)
{
	  //返回结果
    var resData = {};
        //用户手机号
    var mobile = '';
    var user_name='';

    //获取RESTFUL参数
    var restfulParams = req.routeInfo.bodyParams;

  //任务流创建
    async.auto({
    	searchUserDetail: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchUserDetail,
                    method : 'POST',
                    params : {
                        user_id: restfulParams.user_id
                    },
                    data : {
                        fields:{
                            mobile_phone : '',
                            THREE_PASSWORD: '',
                            IS_SUO_GRADE: '',
                            user_name:''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response( res, false, data );
                    }

                    if( data.THREE_PASSWORD !== common.md5( restfulParams.THREE_PASSWORD ) ){
                        return RES.response( res, false, '三级密码输入错误' );
                    }

                    if( 1 == data.IS_SUO_GRADE ){
                        return RES.response( res, false, '当前用户奖金币被锁定，不能提现' );
                    }

                    mobile = data.mobile_phone;
                    user_name=data.user_name;
                    callback();
                }
            );
        },

        cordverify:['searchUserDetail',function(callback){

        	 R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.verifySmsCode,
                    method : 'POST',
                    data : {
                        mobile: mobile,
                        verification_code: restfulParams.verification_code
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response( res, false, data );
                    }
                    callback();
                }
            );
		}],

		parseData:['cordverify',function(callback){
			R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.bonusOnUserMoney,
                    method : 'POST',
                    data : {
                        user_id:restfulParams.user_id ,
                        bonus: restfulParams.bonus,
                        user_name:user_name
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response( res, false, data );
                    }
                    return RES.response(res, true, '转账成功');
                }
            );
		}]

    },function(err,results){
    	if(err){
            RES.response(res, false, results);
        }
    });

}