exports.search = function(req,res){
    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams || {};

    //返回结果
    var resData = {};

    //参数
    var goodsParams = {
        is_delete: 0,
        is_on_sale: 1,//上架
        is_support: 0,
        is_support_sale: 0
    };

    //筛选项
    if( restfulParams.shop_price ){
        //根据商品价格排序
        restfulParams.sort_order = 'shop_price-' + restfulParams.shop_price;
        delete restfulParams.shop_price;
    }

    //合并参数
    Object.assign( restfulParams, goodsParams );

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
                    params : restfulParams,
                    data : {
                        fields:{
                            goods_id : '',
                            goods_name: '',
                            goods_number: '',
                            shop_price: '',
                            img_normal: ''
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

        //获取商品分类
        searchGoodsCategory: function( callback ){
            R.SEND_HTTP(
                req,
                {
                    url    : CORE_APIConfig.coreAPI.searchGoodsCategory,
                    method : 'POST',
                    params : {
                        show_in_nav: 1,
                        is_show: 1,
                        parent_id: 0,
                        sort_order: 'sort_order-desc',
                        mall_type: 1
                    },
                    data: {
                        fields: {
                            category_id : '',
                            category_name : '',
                            category_img : ''
                        }
                    }
                },
                function (err, data) {
                    //判断是否有错误信息
                    if (err) {
                        return callback(err, data);
                    }else{
                        resData.categoryInfo = data;
                        callback();
                    }
                }
            );
        },

        //解析数据
        parseData: ['searchGoodsList', 'searchGoodsCategory', function( callback ){
            callback( 0, resData );
        }]

    }, function( err, results ) {
        //检测是否有错误发生
        err ? RES.response(res, false, results) : RES.response(res, true, resData);
    });

};