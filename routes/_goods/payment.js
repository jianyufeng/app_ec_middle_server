exports.payment = function(req,res){
    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams;

    //返回数据
    var resData = {};

    /**
     * 任务流创建
     */
    async.auto({
        //获取购物车商品
        searchCart: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchCart,
                    method : 'GET',
                    params : {
                        user_id: restfulParams.user_id,
                        shopping_type: 1
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        callback(err, data);
                    }else{
                        if( !data ){
                            callback( 1, '购物车商品获取失败' );
                        }

                        //if( data && data.order_info ){
                        //    var purchaseType = data.order_info.ORDER_TYPE;
                        //    for( var i in data['cart_goods'] ){
                        //        if( purchaseType == 'CE' ){
                        //            //普通购买
                        //            data['cart_goods'][i]['actual_price'] = data['cart_goods'][i]['price_discount'];
                        //            data['cart_goods'][i]['actual_pv'] = data['cart_goods'][i]['wei_man_zu_pf'];
                        //        }else{
                        //            //批发
                        //            data['cart_goods'][i]['actual_price'] = data['cart_goods'][i]['wholesale_price'];
                        //            data['cart_goods'][i]['actual_pv'] = data['cart_goods'][i]['manzu_pf_PV'];
                        //        }
                        //    }
                        //}

                        resData.cartInfo = data;
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
                            user_money: '',
                            address_id: '',
                            ZHUAN_MAI_DIAN_GRADE: '',
                            REGISTER_GRADE: ''
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

        //获取商城配置项
        getWebsiteConfig: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.getWebsiteConfig,
                    method : 'POST',
                    data : {
                        keys : [
                            'EXEMPT_FREIGHT',
                            'IS_SHOW_ZHUAN_MAI_DIAN'
                        ]
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }

                    resData.webConfig = data;
                    callback();
                }
            );
        },

        //获取支付方式
        searchPayment: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchPayment,
                    method : 'POST',
                    params: {
                        enabled: 1,
                        sort_order: 'pay_order-asc'
                    },
                    data: {
                        fields: {
                            pay_id: '',
                            pay_code: '',
                            pay_name: '',
                            pay_fee: '',
                            pay_desc: '',
                            is_online: '',
                            pay_limit: ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }

                    resData.payment = data;
                    callback();
                }
            );
        },

        //获取配送方式
        searchShipping: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchShipping,
                    method : 'POST',
                    params: {
                        enabled: 1
                    },
                    data:{
                        fields:{
                            shipping_id : '',
                            shipping_code : '',
                            shipping_name : '',
                            shipping_desc : '',
                            insure : '',
                            print_bg : ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }

                    resData.shipping = data;
                    callback();
                }
            );
        },

        //解析数据
        parseData: ['searchCart', 'searchUserAddress', 'searchUserDetail', 'getWebsiteConfig', 'searchPayment', 'searchShipping', function( callback ){
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