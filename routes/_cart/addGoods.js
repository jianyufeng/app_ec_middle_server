/*
 * 接口地址 : /mallGoods/addCart
 * 接口名称 : 普通商城 添加购物车&商品
 * 开发人员 : zlw
 */
exports.addGoods = function(req,res){
    //获取RESTFUL参数
    var bodyParams = req.routeInfo.bodyParams;

    var option = {};

    //普通商城
    bodyParams.shopping_type = 1;

    if( bodyParams.goods_attrs ){
        //设置货品参数
        var productParams = {
            goods_id: bodyParams.goods_id
        };
        productParams.goods_attr = bodyParams.goods_attrs;
    }

    //查询货品信息
    var searchProduct = function( callback ){
        R.SEND_HTTP(
            req,
            {
                url    : CORE_APIConfig.coreAPI.searchProduct,
                method : 'POST',
                params : productParams,
                data : {
                    fields:{
                        product_id : ''
                    }
                }
            },
            function (err, data) {
                //判断是否有错误信息
                if (err) {
                    return RES.response( res, false, data );
                }else{
                    if( !data || !data[0] || !data[0].product_id ){
                        return RES.response( res, false, '货品信息获取失败' );
                    }else{
                        bodyParams.product_id = data[0].product_id;
                        delete bodyParams.goods_attrs;
                        callback();
                    }
                }
            }
        );
    };

    //添加购物车
    var addCart = function( callback ){

        R.SEND_HTTP(
            req,
            {
                url    : CORE_APIConfig.coreAPI.addCart,
                method : 'POST',
                data: bodyParams
            },
            function (err, data) {
                //判断是否有错误信息
                if (err) {
                    return RES.response( res, false, data );
                }else{
                    callback(0);
                }
            }
        );
    };

    if( bodyParams.goods_attrs ){
        option.searchProduct = searchProduct;
        option.addCart = ['searchProduct', addCart];
    }else{
        option.addCart = addCart;
    }

    /**
     * 任务流创建
     */
    async.auto(option, function( err, results ) {
        //检测是否有错误发生
        err ? RES.response(res, false, results) : RES.response(res, true, '购物车添加成功');
    });

};