/*
 * 接口地址 : /user/showRegister
 * 接口名称 : 显示用户注册页面
 * 开发人员 : zlw
 */
exports.showRegister = function (req, res) {

    //返回结果
    var resData = {};

    //获取商城配置
    R.SEND_HTTP(
        req,
        {
            url: CORE_APIConfig.coreAPI.getWebsiteConfig,
            method: 'POST',
            data: {
                keys: [
                    'IS_OPEN_SHARE'
                ]
            }
        },
        function (err, data) {
            //判断是否有错误信息
            if (err) {
                return RES.response(res, false, data);
            }

            resData = data['IS_OPEN_SHARE'];
            RES.response(res, true, resData);
        }
    );

};