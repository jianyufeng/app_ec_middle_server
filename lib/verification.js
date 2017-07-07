/****************************
 * 验证
 ****************************/

(function () {

  //根据正则规则进行验证
  exports.paramsV = function(key,value,rule){

      //获取正则规则
      var pattern = regexpRule[rule];

      if(pattern == undefined){
         return false;
      }

      //验证
      if(!pattern.test(value)) {

        var message = key + "参数的格式不正确";
        return message;

      }else{
        return false;
      }

  }


}).call(this);