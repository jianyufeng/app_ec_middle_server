/*
 * 接口地址 : /mallGoods/searchList
 * 接口名称 : 普通商城 查询商品列表
 * 开发人员 : zlw
 */
exports.searchList = function(req,res){
    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams || {};

    //返回结果
    var resData = {};

    //参数
    var goodsParams = {
        is_delete: 0,//未删除
        is_on_sale: 1,//上架
        is_support: 0,
        is_support_sale: 0
    };

    //合并参数
    Object.assign( restfulParams, goodsParams );

    //查询商品信息
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
                    img_normal: '',
                    brand_name: '',
                    limit_num: '',
                    min_order_num: ''
                }
            }
        },
        function (err, data) {
            return RES.response( res, err ? false : true, data );
        }
    );
};