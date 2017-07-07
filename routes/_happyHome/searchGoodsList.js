/*
 * 接口地址 : /happyHome/searchGoodsList
 * 接口名称 : 喜乐之家相关 查询商品列表
 * 开发人员 : zlw
 */
exports.searchGoodsList = function(req,res){
    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams;

    //返回结果
    var resData = {
        config: {}
    };

    /**
     * 任务流创建
     */
    async.auto({
        //获取商品信息
        searchGoodsList: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchGoodsList,
                    method : 'POST',
                    params : {
                        is_delete: 0,
                        is_on_sale: 1,//上架
                        is_support: 0,
                        is_support_sale: 0
                    },
                    data : {
                        fields:{
                            goods_id : '',
                            goods_name: '',
                            goods_number: '',
                            shop_price: '',
                            market_price: '',
                            goods_sn: '',
                            img_normal: '',
                            brand_name: '',
                            limit_num: '',
                            min_order_num: '',
                            goods_type: ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        callback(err, data);
                    }else{
                        resData.goodsInfo = data;
                        callback();
                    }
                }
            );
        },

        //获取收货人信息
        searchUserAddress: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchUserAddress,
                    method : 'GET',
                    params : {
                        user_id: restfulParams.user_id,
                        sort_order: 'address_id-desc'
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }else{
                        resData.address = data;
                        callback();
                    }
                }
            );
        },

        //获取用户信息
        searchUserDetail: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchUserDetail,
                    method : 'POST',
                    params : {
                        user_id: restfulParams.user_id
                    },
                    data: {
                        fields: {
                            address_id: '',
                            user_money: ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }else{
                        resData.userInfo = data;
                        callback();
                    }
                }
            );
        },

        //查询喜乐之家购买记录
        getHappyHomeUsers: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.getHappyHomeUsers,
                    method : 'GET',
                    params : {
                        user_name: restfulParams.user_name
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }else if( !data || !data.user_name ){
                        RES.response(res, false, {
                            message: '喜乐之家购买记录获取失败'
                        });
                    }else{
                        resData.logInfo = data;
                        callback();
                    }
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
                            'HAPPY_HOME_MIN_EXPENSE'
                        ]
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }else if( !data ){
                        RES.response(res, false, {
                            message: '商城配置项获取失败'
                        });
                    }

                    resData.config.min_expense_limit = data['HAPPY_HOME_MIN_EXPENSE']['PARAM_VALUE'];
                    callback();
                }
            );
        },

        //解析数据
        parseData: ['searchGoodsList', 'searchUserAddress', 'searchUserDetail', 'getHappyHomeUsers',
            'getWebsiteConfig', function( callback ){
            //重新组织收货人信息，默认地址置顶，其他以主键倒叙排序
            if( resData.address && resData.address.length ){
                var res = [];
                for( var i in resData.address ){
                    var address = resData.address[i];
                    if( address.address_id == resData.userInfo.address_id ){
                        address.is_default = 1;
                        res[0] = address;
                        resData.address.splice( i, 1 );
                        break;
                    }
                }
                resData.address = res.concat( resData.address );
            }

            callback( 0, resData );
        }]

    }, function( err, results ) {
        //检测是否有错误发生
        err ? RES.response(res, false, results) : RES.response(res, true, resData);
    });

};