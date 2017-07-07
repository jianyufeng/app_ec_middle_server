/****************************
 * 常用基本－公共函数库
 ****************************/

(function () {

	/**
	 * MD5加密函数
	 **/
	exports.md5 = function (data) {
		var Buffer = require("buffer").Buffer;
		var buf = new Buffer(data);
		var str = buf.toString("binary");
		var crypto = require("crypto");
		return crypto.createHash("md5").update(str).digest("hex");
	};


	/**
	 * 将字符串分割成数组
	 **/
	exports.strTransformArr = function (str) {
		var tmpArr = new Array();
		var tmpStr = str.split(",")[0].split("|");
		for (i in tmpStr) {

			tmpArr.push(tmpStr[i]);
		}
		return tmpArr;
	};


	/**
	 * 将字符串中的内容,匹配数组中的每个内容,如果存在就替换成指定字符
	 **/
	exports.filterStr = function (str, arr, character) {

		var str = str;
		for (var i = 0; i < arr.length; i++) {
			str = str.replace(arr[i], character);
		}
		return str;
	};


	/**
	 * 获取当前的时间
	 * 参数1:如果为true就获取毫秒，为false获取秒
	 **/
	exports.nowTime = function (timeResult) {

		var timeRs;
		if (timeResult) {
			timeRs = new Date().getTime();
		} else {
			timeRs = parseInt(new Date().getTime() / 1000);
		}
		return timeRs;
	};

	/**
	 * 获取6位随机验证码
	 * @returns {string} 验证码
	 */
	exports.getVerificationCode = function () {
		var num = "";
		for (var i = 0; i < 6; i++) {
			num = num + Math.floor(Math.random() * 10);
		}
		return num;
	};

	/**
	 * 解析restful参数
	 */
	exports.parseRestFulParams = function(paramsURL){

		var restFulArr = paramsURL.split("/");

		//判断是否为键值对的格式
		if(restFulArr.length % 2 != 0){
		   return false;
		}

		//将参数记录为JSON形势
		var jsonParams = {};
		if(restFulArr.length > 0){
			for(var i = 0;i<restFulArr.length;i++){

				//判断key是否为数字
				if(!isNaN(restFulArr[i])){
					 return false;
				}

				//保存参数信息
				jsonParams[restFulArr[i]] = restFulArr[i+1];
				i++;
			}
		}

		return jsonParams;

	};

	/**
	 * 将JSON参数组装成RESTFUL格式
	 */
	exports.JsonTransformRestFulParams = function(json){

		var restfulStr = "";
		for(k in json){
			restfulStr += k + "/" + json[k] + "/";
		}

		return "/"+restfulStr;

	};


	/**
	 * 判断一个对象是否为空
	 */
	exports.isNullObj = function(obj){
		for(var i in obj){
			if(obj.hasOwnProperty(i)){
				return false;
			}
		}
		return true;
	};


	/**
	 * 获取JSON数据中所有KEY组成的数组
	 */
	exports.getJsonKeyArray = function(obj){

		var tempArr = [];

		if(obj == undefined){
			return tempArr;
		}

		for(var k in obj){
				tempArr.push(k);
		}
		return tempArr;

	};

	/**
	 * 获取两个数组的差集
	 */
	exports.minus = function(arr1,arr2){
		var arr3 = [];
		for (var i = 0; i < arr1.length; i++) {
			var flag = true;
			for (var j = 0; j < arr2.length; j++) {
				if (arr2[j] == arr1[i]) {
					flag = false;
				}
			}
			if (flag) {
				arr3.push(arr1[i]);
			}
		}
		return arr3;
	};

    /**
     * 获取mysql日期时间，形如：2017-02-24 11:26:44
     */
    exports.mysqlTime = function(){
        var objDate = new Date();
        var month = objDate.getMonth();
        var date = objDate.getDate();
        var hours = objDate.getHours();
        var minutes = objDate.getMinutes();
        var seconds = objDate.getSeconds();

        var time = objDate.getFullYear() + '-'
            + ( month++ < 10 ? '0' + month : month ) + '-'
            + ( date < 10 ? '0' + date : date ) + ' '
            + ( hours < 10 ? '0' + hours : hours ) + ':'
            + ( minutes < 10 ? '0' + minutes : minutes ) + ':'
            + ( seconds < 10 ?  '0' + seconds : seconds );

        return time;
    };



}).call(this);

