exports.coreAPI = {

	test_api : config.core_server.url +  "/region/cities",

	goodsList 	: config.core_server.url + "/goods/search",
	goodsDetail : config.core_server.url + "/goods/searchGoodsDetail",
	goodsImage  : config.core_server.url + "/goods/searchGoodsImage",

    //查询用户token信息
    searchToken: config.core_server.url + '/user/getTokenInfo',

    /****************************** 网站配置相关 *******************************/
    //商城配置
    getWebsiteConfig : config.core_server.url + "/ecManage/getBizParameters",
    //支付方式
    searchPayment: config.core_server.url + "/shopping/searchPayment",
    //折扣配置
    searchBuyDiscount: config.core_server.url + '/ecManage/searchBuyDiscount',

    /*************************** 省市区相关 *****************************/
    //查询省份
    searchProvinces: config.core_server.url + "/region/provinces",
    //查询市
    searchCities: config.core_server.url + "/region/cities",
    //查询区
    searchCounties: config.core_server.url + "/region/counties",

    /*********************** 用户相关 ****************************/
    //注册用户
    addUser: config.core_server.url + "/user/add",
    //添加用户token
    addUserToken: config.core_server.url + "/user/addUserToken",
    //查询用户详情
    searchUserDetail: config.core_server.url + "/user/searchUserDetail",
    //查询用户密保卡
    searchUserSecurity: config.core_server.url + "/user/searchSecurity",
    //查询用户令牌
    searchCiphertext: config.core_server.url + "/user/searchCiphertext",
    //更新用户信息
    updateUserInfo: config.core_server.url + '/user/update',
    //查询空升记录
    searchKsLog: config.core_server.url + '/user/searchkslog',
    //更新用户信息
    updateUserInfo: config.core_server.url + '/user/update',
    //查询体系信息
    searchTeamInfo: config.core_server.url + '/user/searchTeams',
    searchUserList : config.core_server.url + '/user/search',

    /************************** 用户收货地址相关 ******************************/
    //查询用户收货地址
    searchUserAddress: config.core_server.url + '/user/searchAddress',

    /********************** 短信相关 *****************************/
    //获取短信验证码
    getVerification: config.core_server.url + "/sms/getVerification",
    //验证短信验证码
    verifySmsCode: config.core_server.url + "/sms/verifySmsCode",
    //发送用户注册成功短信
    userRegister: config.core_server.url + "/sms/user_register",
    //账户资金变动短信通知
    changeFundNotice: config.core_server.url + "/sms/changeFundNotice",

    /************************** 电子币相关 ********************************/
    //查询第三方支付记录
    searchUserAccount: config.core_server.url + "/userAccount/search",
    //查询用户现金记录
    searchAccountLog: config.core_server.url + "/shopping/searchAccountLog",
    //查询用户转账记录
    searchTransferAccounts: config.core_server.url + "/transfer/search",
    //用户电子币转账
    transferUserMoney: config.core_server.url + "/transfer/add",

    /****************************** 辅销品相关 ************************************/
    //查询换购辅销品代金券记录
    searchIntergralLog: config.core_server.url + "/fxp/searchIntergralLog",
    //查询辅销品币流水
    searchFxpAccountLog: config.core_server.url + "/fxp/searchAccountLog",
    //辅销品换购代金券转账
    transferFxpPoints: config.core_server.url + '/fxp/transferFxpPoints',

    /******************************* 旅游积分相关 ******************************************/
    //查询用户旅游积分流水
    searchTravelAccountLogs: config.core_server.url + "/travel/searchTravelAccountLogs",
    //查询用户旅游积分
    searchTravelUserPoints: config.core_server.url + "/travel/searchTravelUserPoints",

    /********************************* 商品相关 ******************************************/
    //查询商城商品
    searchGoodsList: config.core_server.url + "/goods/searchGoodsList",
    //查询商品分类
    searchGoodsCategory: config.core_server.url + "/goodsCategory/search",
    //查询商品详情
    searchGoodsDetail: config.core_server.url + "/goods/searchGoodsDetail",
    //查询商品图片
    searchGoodsImgs: config.core_server.url + "/goods/searchGoodsImage",
    //查询商品属性及公共属性
    searchGoodsAttrAttribute: config.core_server.url + "/goods/searchGoodsAttrAttribute",

    /*********************************** 购物车相关 *********************************************/
    //添加购物车及商品
    addCart: config.core_server.url + "/cart/add",
    //查询购物车商品
    searchCart: config.core_server.url + "/cart/searchCart",

    /************************************* 货品相关 ********************************************/
    //查询货品信息
    searchProduct: config.core_server.url + "/goods/searchProduct",

    /************************************** 配送相关 **********************************************/
    //查询配送方式
    searchShipping: config.core_server.url + "/shipping/searchShipping",

    /************************************** 喜乐之家相关 *********************************************/
    //查询喜乐之家购买记录
    searchHappyHomeLogs: config.core_server.url + "/happyHome/searchLogs",
    //获取喜乐之家账号信息
    getHappyHomeUsers: config.core_server.url + "/happyHome/getHappyHomeUsers",

    /*************************************** 奖金相关 ************************************************/
    //奖金币提现
    withdrawal: config.core_server.url + "/bonus/withdrawal",

    /*************************************** 订单相关 ***********************************************/
    //查询订单列表
    searchOrderList: config.core_server.url + "/order/searchList",
    //查询订单详情
    searchOrder: config.core_server.url + "/order/searchOrder",
    //查询订单商品
    searchOrderGoods: config.core_server.url + "/order/searchOrderGoods",
    //查询退货单详情
    searchBackOrderInfo: config.core_server.url + "/back/searchOrderInfo",
    //查询退货单商品
    searchBackOrderGoods: config.core_server.url + "/back/searchGoods",
    //查询发货单
    searchDeliveryOrderInfo: config.core_server.url + "/delivery/searchOrderInfo",

    /*************************************** 专卖店相关 **********************************************/
    //查询专卖店
    searchExclusiveShop: config.core_server.url + '/exclusiveShop/searchExclusiveShop',

    /*************************************** 文章相关 ***********************************************/
    //查询文章
    searchArticle: config.core_server.url + '/article/search'

};