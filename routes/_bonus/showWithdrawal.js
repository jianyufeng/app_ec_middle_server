/*
 * 接口地址 : /bonus/showWithdrawal
 * 接口名称 : 显示提现页面
 * 开发人员 : zlw
 */
exports.showWithdrawal = function(req,res){
    //返回结果
    var resData = {};

    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams;

    //任务流创建
    async.auto({
        //查询用户详情
        searchUserDetail: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchUserDetail,
                    method : 'POST',
                    params : {
                        user_id : restfulParams.user_id
                    },
                    data : {
                        fields:{
                            BONUS: '',
                            BANK_NAME : '',
                            BANK_ACCOUNT: '',
                            ACCOUNT_OWNER: '',
                            IS_SUO_BONUS: ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response( res, false, data );
                    }

                    resData['userInfo'] = data;
                    callback();
                }
            );
        },

        //获取商城配置项
        getWebsiteConfig: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.getWebsiteConfig,
                    method : 'POST',
                    data : {
                        keys : [
                            'MIN_TI_XIAN_BONUS',
                            'FUNDS_VERIFY_WAYS',
                            'SERVICE_CHARGE_PERCENT',
                            'SERVICE_CHARGE_MAX'
                        ]
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response( res, false, data );
                    }

                    resData['webConfig'] = data;
                    callback();
                }
            );
        },

        //解析数据
        parseData: ['searchUserDetail', 'getWebsiteConfig', function( callback ){
            callback(0);
        }]

    }, function( err, results ) {
        //检测是否有错误发生
        err ? RES.response(res, false, results) : RES.response(res, true, resData);
    });

};