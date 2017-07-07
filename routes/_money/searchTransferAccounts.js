exports.searchTransferAccounts = function(req,res){
    //返回结果
    var resData = {};

    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams;
    //参数
    var params = {};

    //判断查询类型
    switch( parseInt( restfulParams.type ) ){
        case 1:
            //查看转出记录
            params['user_id'] = restfulParams['user_id'];
            break;
        case 2:
            //查看转入记录
            params['target_user_id'] = restfulParams['user_id'];
            break;
        case 3:
            //查看全部记录
            params['is_all'] = 1;
            params['user_id'] = restfulParams['user_id'];
            break;
        default:
            RES.response(res, true,  '类型参数错误');
    }

    restfulParams.addtime && ( params.addtime = restfulParams.addtime );
    params.skip = restfulParams.skip || 0;
    params.limit = restfulParams.limit || 10;

    R.SEND_HTTP(
        req,
        {
            url    : CORE_APIConfig.coreAPI.searchTransferAccounts,
            method : 'POST',
            params : params,
            data : {
                fields:{
                    user_name : '',
                    target_user : '',
                    amount : '',
                    addtime : '',
                    remark : ''
                }
            }
        },
        function (err, data) {
            RES.response(res, err ? false : true,  data);
        }
    );

};