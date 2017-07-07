var db  = require('../../lib/db');

exports.addMoney = function(req,res){

     //获取RESTFUL参数
    var restfulParams = req.routeInfo.restfulParams || {};


    db.where({"user_name":restfulParams.user_name}).update({"user_money":restfulParams.user_money},"newec.ec_users",function(e,data){
        if(e == 'ERROR'){
            return RES.response(res, false, "洗钱失败");
        }

        return RES.response(res, true, "洗钱成功");

    });


    

    
};