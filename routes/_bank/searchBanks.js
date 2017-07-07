/**
 * 接口地址：/bank/searchBanks
 * 接口名称: 查询银行账户
 * @author:zlw
 * @date:2017.6.16
 */
exports.searchBanks = function( req, res ){
    //获取参数
    var restfulParams = req.routeInfo.restfulParams;

    //返回值
    var resData = {};

    //创建任务流
    async.auto({
        //获取用户信息
        searchUserDetail: function( cb ){
            if( !restfulParams.user_id ){
                return cb();
            }

            R.SEND_HTTP(
                req,
                {
                    url:CORE_APIConfig.coreAPI.searchUserDetail,
                    method: 'POST',
                    params: {
                        user_id: restfulParams.user_id
                    },
                    data: {
                        fields: {
                            user_id: '',
                            user_money: '',
                            fxp_money: ''
                        }
                    }
                },
                function( err, data ){
                    if( err ){
                        return RES.response( res, false, data );
                    }

                    if( !data || !data.user_id ){
                        return RES.response( res, false, {
                            message: '用户不存在'
                        } );
                    }else{
                        resData.user_money = data.user_money || 0;
                        resData.fxp_money = data.fxp_money || 0;
                    }

                    cb();
                }
            );
        },

        //获取银行账户
        searchBanks: function( cb ){
            R.SEND_HTTP(
                req,
                {
                    url:CORE_APIConfig.coreAPI.searchBanks,
                    method: 'GET',
                    params: {
                        BANK_TYPE: restfulParams.BANK_TYPE
                    }
                },
                function( err, data ){
                    if( err ){
                        return RES.response( res, false, data );
                    }

                    resData.banks = data;
                    cb();
                }
            );
        },

        //获取省份
        searchProvinces : function( cb ){
            R.SEND_HTTP(
                req,
                {
                    url: CORE_APIConfig.coreAPI.searchProvinces,
                    method: 'GET',
                    params: {
                        skip: 0,
                        limit: 50
                    }
                },
                function( err, data ){
                    if( err ){
                        return RES.response( res, false, data );
                    }

                    resData.provinces = data;
                    cb();
                }
            );
        },

        parseData: ['searchUserDetail', 'searchBanks', 'searchProvinces', function(){
            return RES.response( res, true, resData );
        }]

    }, function( err, result ){
        err && RES.response( res, false, result );
    });
};
