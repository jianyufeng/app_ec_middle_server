exports.goodsDetail = function(req,res){
    
    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams || {};

    //返回结果个
    var resData = {};

    /**
     * 任务流创建
     */
    async.auto({
        //获取商品信息
        searchGoodsInfo: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchGoodsList,
                    method : 'POST',
                    params : {
                        goods_id: restfulParams.goods_id
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

        //获取商品详情
        searchGoodsDetail: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchGoodsDetail,
                    method : 'POST',
                    params : {
                        goods_id: restfulParams.goods_id
                    },
                    data: {
                        fields: {
                            detail_title : '',
                            detail_img : '',
                            detail_text : ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }else{
                        resData.goodsDetail = data;
                        callback();
                    }
                }
            );
        },

        //获取商品图片
        'searchGoodsImgs': function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchGoodsImgs,
                    method : 'POST',
                    params : {
                        goods_id: restfulParams.goods_id,
                        img_show_type: 1 //图片显示区域 1-主页
                    },
                    data: {
                        fields: {
                            img_thumb : '',
                            img_normal : '',
                            img_text : ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }else{
                        resData.goodsImgs = data;
                        callback();
                    }
                }
            );
        },

        //获取商品属性
        searchGoodsAttr: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchGoodsAttrAttribute,
                    method : 'POST',
                    params : {
                        goods_id: restfulParams.goods_id
                    },
                    data: {
                        fields: {
                            goods_attr_id : '',
                            attr_name : '',
                            attr_value : '',
                            attr_price : '',
                            attr_type : ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }else{
                        resData.goodsAttr = data;
                        callback();
                    }
                }
            );
        },

        //获取运费配置
        searchConfig: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.getWebsiteConfig,
                    method : 'POST',
                    data : {
                        keys: ['EXEMPT_FREIGHT']
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }else{
                        resData.freight = data && data['EXEMPT_FREIGHT'] && data['EXEMPT_FREIGHT']['PARAM_VALUE'];
                        callback();
                    }
                }
            );
        },

        //解析数据
        parseData: ['searchGoodsInfo', 'searchGoodsDetail', 'searchGoodsImgs', 'searchGoodsAttr', 'searchConfig', function( callback ){
            callback( 0, resData );
        }]

    }, function( err, results ) {
        //检测是否有错误发生
        err ? RES.response(res, false, results) : RES.response(res, true, resData);
    });

};