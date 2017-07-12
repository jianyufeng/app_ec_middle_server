/****************************
 * 接口管理文件,可对接口进行配置(生效范围为接口自身)
 * Key -> method 		   : GET 或 POST
 * Key -> getMustParams    : get请求必传参数配置,值为验证的格式,可在正则配置文件进行配置
 * Key -> getNoMustParams  : get请求非必传参数配置,如不做配置,则不对任何非必传参数进行格式验证,配置后,如果格式不正确,接口请求将无法成功
 * Key -> postMustParams   : post请求必传参数配置,值为验证的格式,可在正则配置文件进行配置
 * Key -> postNoMustParams : post请求非必传参数配置,如不做配置,则不对任何非必传参数进行格式验证,配置后,如果格式不正确,接口请求将无法成功
 * Key -> isMemoryCache    : 该接口是否进行缓存,只对GET请求生效(与服务器设置冲突时,优先生效)
 * Key -> cacheExpiration  : 该接口的缓存生效时间(与服务器设置冲突时,优先生效)
 ****************************/

exports.API = {

    /*
     * 用户相关
     */

    //获取短信验证码
    "/_user/getSmsCode":{
        method : 'GET',
        getMustParams : {
            user_name : ''
        }
    },
	
	"/_user/findPassword" : {
        method : 'POST',
        postMustParams : {
            new_password      : '',
            repeat_password   : '',
            user_name         : '',
            verification_code : ''
        }
    },

    //验证用户是否登录
    "/_user/getUserInfoByToken" : {
        method : 'GET',
        getMustParams : {
            token : ''
        }
    },

    //用户登录
    "/_user/login" : {
        method : 'POST',
        postMustParams : {
            user_name : '',
            password  : '',
            verification_mode : ''
        }
    },

    //用户注册
    "/_user/register" : {
        method : 'POST',
        postMustParams : {
            user_name         : '',
            email             : '',
            password          : '',
            confirm_password  : '',
            SECOND_PASSWORD   : '',
            THREE_PASSWORD    : '',
            mobile            : '',
            verification_code : ''
        }
    },

    //显示用户注册页面
    "/_user/showRegister":{
        method:'GET',
        getMustParams:{}
    },


    //查询用户收获地址
    "/_user/searchUserAddress" : {
        method : 'GET',
        getMustParams : {
            user_id : 'NUMBER'
        }
    },

    //验证用户密码
    "/_user/verifyUserPassword" : {
        method : 'POST',
        postMustParams : {
            user_id  : 'NUMBER',
            password : '',
            type     : '',
        }
    },

    //验证用户帐号是否存在
    "/_user/verifyUserName" : {
        method : 'GET',
        getMustParams : {
            user_name  : ''
        }
    },

    //用户中心 会员首页
    "/_user/userHome" : {
        method : 'GET'
    },

    //获取用信息+团体信息
    "/_user/userInfo" : {
        method : 'GET',
        getMustParams : {
            userName : ''
        }
    },

    //用户身份证验证
    "/_user/verifyIDCard" : {
        method : 'GET',
        getMustParams : {
            id_card : ''
        }
    },

    /*
     * 商品页相关
     */

    //商品首页
    "/_goods/search" : {
        method : 'GET'
    },

    //支付界面
    "/_goods/payment" : {
        method : 'GET',
        getMustParams : {
            user_id : 'NUMBER'
        }
    },

    //商品搜索
    "/_goods/searchList": {
        method : 'GET',
        getMustParams : {
            search_key : ''
        }
    }, 

    //首页
    "/_goods/home" : {
        method : 'GET'
    },

    /*
     * 分类页相关
     */

    //分类首页
    "/_category/search" : {
        method : 'GET'
    },

    //商品详细
    "/_category/goodsDetail" : {
        method : 'GET',
        getMustParams : {
            'goods_id' : 'NUMBER'
        }
    },


    /*
     * 我的页相关
     */
    
    //我的首页
    "/_my/search" : {
        method : 'GET'
    },

    /*
     * 购物车页相关
     */
    
    //购物车首页
    "/_cart/search" : {
        method : 'GET'
    },

    //添加商品到购物车
    "/_cart/addGoods" : {
        method : 'POST',
        postMustParams : {
            user_name : "",
            user_id   : "NUMBER",
            goods_id  : "NUMBER",
            goods_name : "",
            goods_number : "NUMBER",
            goods_price : ""
        }
    },

    //获取当前用户的购物车商品数量
    "/_cart/searchCartCount" : {
        method : 'GET'
    },

    //资金相关
    "/_money/transferUserMoney" : {
        method : 'POST',
        postMustParams : {
            user_id           : 'NUMBER',
            user_name         : '',
            target_user_name  : '',
            amount            : '',
            verificationType  : 'NUMBER',
            verification_code : '',
            SECOND_PASSWORD   : ''
        }
    },

    "/_money/searchTransferAccounts" : {
        method : 'GET',
        getMustParams : {
            user_id : 'NUMBER',
            type    : 'NUMBER'
        }
    },

    //电子币充值列表
    "/_money/searchUserAccount" : {
        method : 'GET',
        getMustParams : {
            user_name : ''
        }
    },

    //辅销币列表
    "/_fxp/searchAccountLog" : {
        method : 'GET',
        getMustParams : {
            user_id : 'NUMBER'
        }
    },

    //辅销品换购代金券转账
    "/_fxp/transferFxpPoints" : {
        method : 'POST',
        postMustParams : {
            user_name         : '',
            user_id           : 'NUMBER',
            target_user       : '',
            point             : 'NUMBER',
            SECOND_PASSWORD   : '',
            verificationType  : 'NUMBER',
            verification_code : 'NUMBER'
        }
    },

    "/_bonus/bonusOnUserMoney" : {
        method : 'POST',
        postMustParams : {
            user_id            : '',
            bonus              : 'NUMBER',
            THREE_PASSWORD     : '',
            verification_type  : 'NUMBER',
            verification_code  : 'NUMBER'
        }
    },

    "/_bonus/showWithdrawal" : {
        method : 'GET',
        getMustParams : {
            user_id  : 'NUMBER'
        }
    },

    //喜乐之家相关 查询商品列表
    "/_happyHome/searchGoodsList" : {
        method : 'GET',
        getMustParams : {
            user_id   : 'NUMBER',
            user_name : ''
        }
    },

    "/_test/addMoney": {
        method : 'GET',
        getMustParams : {
            user_name  : '',
            user_money : 'NUMBER'
        }
    },

    /*
     * 银行相关
     */
    "/_bank/searchBanks":{
        method : 'GET',
        getMustParams : {
            BANK_TYPE : ''
        },
        getNoMustParams : {
            user_id : ''
        }
    },

    /*
     * 订单详情相关
     */
    "/_order/searchOrderDetail":{
        method : 'GET',
        getMustParams : {
            order_id : 'NUMBER'
        },
        getNoMustParams : {
            user_id : 'NUMBER'
        }
    }
};