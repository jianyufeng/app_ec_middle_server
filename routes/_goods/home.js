/**
 * 接口地址：
 * 接口名称: 商城首页
 * @author:
 * @date:
 */
exports.home = function( req, res ){
    //返回值
    var resData = {};

	//获取商品信息
	R.SEND_HTTP(
		req,
		{
			// searchGoodsList: config.core_server.url + "/goods/searchGoodsList",
			
			url    : CORE_APIConfig.coreAPI.searchGoodsList,
			method : 'POST',
			params : {
				is_delete: 0,//未删除
				is_on_sale: 1,//上架
				is_support: 0,//非辅销品
				is_support_sale: 0 //非辅销品积分换购商品
			},
			data : {
				fields:{
					goods_id : '',
					goods_name: '',
					goods_number: '',
					shop_price: '',
					img_normal: '',
					brand_name: '',
					is_hot: '',
					category_id: '',
					limit_num: '',
					min_order_num: ''
				}
			}
		},
		function (err, data) {
			//判断是否有错误信息
			if (err) {
				return RES.response( res, false, data );
			}else if( !data || !parseInt( data.count ) ){
				return RES.response( res, true, data );
			}

			//热销商品
			resData.hotGoods = {
				count: 0,
				data : []
			};
			//新品
			resData.newGoods = {
				count: 0,
				data : []
			};
			
			for( var i in data.data ){
				var goodsInfo = data.data[i];
				//筛选热销商品
				if( parseInt( goodsInfo.is_hot ) ){
					resData.hotGoods.data.push( goodsInfo );
				}

				//筛选新品
				if( parseInt( goodsInfo.is_new ) ){
					resData.newGoods.data.push( goodsInfo );
				}
			}
			resData.hotGoods.count = resData.hotGoods.data.length;
			resData.newGoods.count = resData.newGoods.data.length;

			return RES.response( res, true, resData );
		}
	);

};
