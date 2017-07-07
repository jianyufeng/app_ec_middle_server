exports.userInfo = function(req,res){

    //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams;

    //最终结果
    var resData = {};

    //用户名
    var userName = restfulParams.userName;

    var team_id = 0;

    //构建任务流
    async.waterfall([

        //获取用户详细
        function(cb){

            R.SEND_HTTP(
            req,
            {
                url    : CORE_APIConfig.coreAPI.searchUserDetail,
                method : 'POST',
                params : {
                    user_name : userName
                }
            },
            function (err, data) {

                //判断是否有错误信息
                if (err) {
                    return RES.response(res, false, "用户信息查询失败");
                }

                //判断用户是否存在
                if(data.length <= 0){
                    return RES.response(res, false, "该用户不存在");
                }

                //判断用户是否激活
                console.log(data);
                if(data.REGISTER_GRADE <= 0){
                    return RES.response(res, false, "该用户未激活");
                }

                resData.userInfo = data;

                cb();
            })

        },

        //查询用户团体信息
        function(cb){
            
            R.SEND_HTTP(
                req,
                {
                    url:CORE_APIConfig.coreAPI.searchUserDetail,
                    method: 'POST',
                    params: {
                        user_name: userName
                    },
                    data: {
                        fields: {
                            user_id: '',
                            team_id: '',
                            ACCOUNT_OWNER: '',
                            ACTIVATION_TIME: ''
                        }
                    }
                },
                function( err, data ){
                    if( err ){
                        return RES.response( res, false, "用户信息查询失败" );
                    }

                    
                    resData.teamInfo = data;

                    team_id = data.team_id;

                    cb();
                }
            );

        },

        function(cb){
            R.SEND_HTTP(
                req,
                {
                    url:CORE_APIConfig.coreAPI.searchTeamInfo,
                    method: 'GET',
                    params: {
                        team_id: team_id
                    }
                },
                function( err, data ){
                    if( err ){
                        return RES.response( res, false, "用户信息查询失败" );
                    }

                   

                    if( !data || !parseInt( data.count ) ){
                        return RES.response( res, false, {
                            message: '用户团队信息获取失败'
                        } );
                    }else{
                        resData.teamInfo.team_name = data.data[0].team_name;
                        resData.teamInfo.scheme_name = data.data[0].parent_name;
                    }

                    RES.response( res, true, resData );
                }
            );
        }

    ], function (err, result) {
        return RES.response(res, true, resData);
    });

}