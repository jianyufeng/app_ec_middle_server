/*
 * 接口地址 : /order/searchOrderDetail
 * 接口名称 : 查询订单详情
 * 开发人员 : zlw
 */
exports.searchOrderDetail = function(req,res){
    //返回结果
    var resData = {};

    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams;

    //任务流创建
    async.auto({
        //查询订单
        searchOrder: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchOrder,
                    method : 'POST',
                    params : {
                        order_id: restfulParams.order_id,
                        user_id: restfulParams.user_id
                    },
                    data: {
                        fields: {
                            order_id: '',
                            order_sn: '',
                            order_status: '',
                            pay_status: '',
                            pay_time: '',
                            consignee: '',
                            email: '',
                            address: '',
                            zipcode: '',
                            tel: '',
                            mobile: '',
                            best_time: '',
                            sign_building: '',
                            shipping_name: '',
                            pay_name: '',
                            goods_amount: '',
                            surplus: '',
                            shipping_fee: '',
                            invoice_no: ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response( res, false, data );
                    }else if( !data || !data.order_id ){
                        return RES.response(res, false, {
                            message: '订单信息获取失败'
                        });
                    }

                    resData.orderInfo = data;
                    callback();
                }
            );
        },

        //查询订单商品
        searchOrderGoods: ['searchOrder', function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchOrderGoods,
                    method : 'POST',
                    params : {
                        order_id: restfulParams.order_id,
                        goods_number: 'goods_number-gt-0'
                    },
                    data: {
                        fields: {
                            rec_id: '',
                            goods_name: '',
                            goods_price: '',
                            goods_number: '',
                            send_number: '',
                            goods_attr: '',
                            goods_id: '',
                            product_id: ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response( res, false, data );
                    }

                    resData.orderGoods = data;
                    RES.response(res, true, resData);
                }
            );
        }],

    }, function( err, results ) {
        //检测是否有错误发生
        err && RES.response(res, false, results);
    });

};
