exports.userHome = function(req,res){
    //返回结果
    var resData = {};
    //用户名
    var userName = '';
    var option = {};

    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams;

    //查询用户详情
    var searchUserDetail = function( callback ){
        R.SEND_HTTP(
            req,
            {
                url    : CORE_APIConfig.coreAPI.searchUserDetail,
                method : 'POST',
                params : {
                    user_name : userName
                },
                data: {
                    fields: {
                        user_id: '',
                        user_name: '',
                        last_login: '',
                        sex : '',
                        headerUrl : '',
                        IS_VIP: '',
                        IS_PI_FA: '',
                        REGISTER_GRADE: '',
                        ZHUAN_MAI_DIAN_GRADE: '',
                        mobile_phone: '',
                        email: '',
                        user_money: '',
                        fxp_money: '',
                        fxp_points: '',
                        INTEGRAL: '',
                        IS_SUO_INTEGRAL: ''
                    }
                }
            },
            function (err, data) {
                //判断是否有错误信息
                if (err) {
                    return RES.response(res, false, {
                        status: 1,
                        msg: data
                    });
                }

                resData.userInfo = data;
                callback();
            }
        );
    };

    //查询订单列表
    var searchOrderList = function( callback ){
        R.SEND_HTTP(
            req,
            {
                url    : CORE_APIConfig.coreAPI.searchOrderList,
                method : 'POST',
                params : {
                    user_name : userName,
                    skip: 0,
                    limit: 5
                },
                data: {
                    fields: {
                        order_id: '',
                        order_sn: '',
                        order_type: '',
                        pay_time: '',
                        goods_amount: '',
                        surplus: '',
                        order_status: '',
                        pay_status: '',
                        ok_status: '',
                        back_id: ''
                    }
                }
            },
            function (err, data) {
                //判断是否有错误信息
                if (err) {
                    return RES.response(res, false, {
                        status: 1,
                        msg: data
                    });
                }

                resData.orderList = data;
                callback();
            }
        );
    };

    //查询折扣配置
    var searchBuyDiscount = function( callback ){
        R.SEND_HTTP(
            req,
            {
                url    : CORE_APIConfig.coreAPI.searchBuyDiscount,
                method : 'POST',
                params : {
                    status : 1
                },
                data: {
                    fields: {
                        level_key: '',
                        pay_money: '',
                        discount_money: '',
                        incomplete_pv: '',
                        complete_pv: ''
                    }
                }
            },
            function (err, data) {
                //判断是否有错误信息
                if (err) {
                    return RES.response(res, false, {
                        status: 1,
                        msg: data
                    });
                }

                resData.config = {};
                for( var i in data ){
                    var item = data[i];
                    if( item.level_key === 'IS_PI_FA' ){
                        resData.config[item.level_key] = item.pay_money-item.discount_money;
                    }else{
                        resData.config[item.level_key] = Math.floor( (item.pay_money-item.discount_money)*item.complete_pv/item.incomplete_pv );
                    }
                }
                callback();
            }
        );
    };

    //获取用户旅游积分
    var searchTravelUserPoints = function( callback ){
        R.SEND_HTTP(
            req,
            {
                url    : CORE_APIConfig.coreAPI.searchTravelUserPoints,
                method : 'POST',
                params : {
                    user_id : resData.userInfo.user_id
                },
                data : {
                    fields:{
                        points : ''
                    }
                }
            },
            function (err, data) {
                //判断是否有错误信息
                if (err) {
                    return RES.response(res, false, {
                        status: 1,
                        msg: data
                    });
                }

                resData['travel_points'] = data['points'] || 0;
                callback();
            }
        );
    };

    //查询最新公告
    var searchArticle = function( callback ){
        R.SEND_HTTP(
            req,
            {
                url    : CORE_APIConfig.coreAPI.searchArticle,
                method : 'GET',
                params : {
                    is_notification : 1, //公告
                    is_publish: 1,//发布
                    is_delete: 0,//未删除
                    skip: 0,
                    limit: 3
                }
            },
            function (err, data) {
                //判断是否有错误信息
                if (err) {
                    return RES.response(res, false, {
                        status: 1,
                        msg: data
                    });
                }

                resData['article'] = data;
                callback();
            }
        );
    };

    if( restfulParams.token ){
        //通过token获取用户信息
        option.searchToken = function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchToken,
                    method : 'GET',
                    params : {
                        token_value : restfulParams.token
                    },
                    data:{
                        fields:{
                            token_username: '',
                            token_dead_time: ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return RES.response(res, false, {
                            status: 1,
                            msg: data
                        });
                    }

                    if( !data || !data.length ){
                        return RES.response(res, false, {
                            status: 3,
                            msg: 'token不存在'
                        });
                    }

                    if( Math.round(new Date().getTime()/1000) > data[0]['token_dead_time'] ){
                        return RES.response(res, false, {
                            status: 2,
                            msg: 'token已过期，请重新登录'
                        });
                    }

                    userName = data[0]['token_username'];
                    callback(0);
                }
            );
        };

        option.searchUserDetail = ['searchToken',searchUserDetail];
        //option.searchOrderList = ['searchToken',searchOrderList];
        option.searchBuyDiscount = ['searchToken',searchBuyDiscount];
       // option.searchArticle = ['searchToken',searchArticle];
    }else{
        userName = restfulParams.user_name;
        option.searchUserDetail = searchUserDetail;
        //option.searchOrderList = searchOrderList;
        option.searchBuyDiscount = searchBuyDiscount;
       // option.searchArticle = searchArticle;
    }
    option.searchTravelUserPoints = ['searchUserDetail','searchBuyDiscount', searchTravelUserPoints];

    //任务流创建
    async.auto(option, function( err, results ) {
        err ? RES.response(res, false, results) : RES.response(res, true, resData);
    });

};