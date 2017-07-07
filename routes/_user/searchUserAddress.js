exports.searchUserAddress = function( req,res ){
    //获取参数
    var restfulParams = req.routeInfo.restfulParams;
    //返回数据
    var resData = {};

    //任务流创建
    async.auto({
        //获取用户详情
        searchUserDetail:function( cb ){
            R.SEND_HTTP(
                req,
                {
                    url: CORE_APIConfig.coreAPI.searchUserDetail,
                    method: 'POST',
                    params: restfulParams,
                    data: {
                        fields: {
                            'address_id': ''
                        }
                    }
                },
                function( err, data ){
                    if( err ){
                        return cb( err, data );
                    }

                    resData.defaultAddress = data.address_id;
                    cb();
                }
            );
        },

        //查询用户地址信息
        searchAddress : function( cb ){
            R.SEND_HTTP(
                req,
                {
                    url: CORE_APIConfig.coreAPI.searchUserAddress,
                    method: 'GET',
                    params: restfulParams
                },
                function( err, data ){
                    if( err ){
                        return cb( err, data );
                    }

                    resData.AddressList = data;
                    cb();
                }
            );
        },

        //解析数据
        paraseData : ['searchUserDetail', 'searchAddress', function( cb ){
            //返回数据
            RES.response( res, true, resData );
        }]
    },function( err,results ){
        err && RES.response( res,false,results );
    });
};