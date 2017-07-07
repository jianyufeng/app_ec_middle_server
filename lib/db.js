var mysql = require("mysql");

var client = mysql.createConnection({
	host     	: "192.168.10.70",
	user     	: "ecommerce",
	password 	: "90763729",
	port		: "3309",
	database	: "newec"
});

console.log(client);


var Db = {

	sqlStr	 : "",
	fieldStr : "",

	select:function(tableName,cb){

		if(!this.fieldStr){
			this.fieldStr = "*";
		}

		var tmpSql = "select "+this.fieldStr+" from "+tableName+" "+this.sqlStr;

		//清空内容对象
		this.destroy();

		console.log(tmpSql);

		try {

			client.query(tmpSql,function(err,result){

				

				if(err){
					console.log(err);
					cb("ERROR");
				}else{
					cb(result);
				}
			});
		}catch (_error) {
			err = _error;
			cb("ERROR");
		}

	},


	count:function(tableName,cb){

		var tmpSql = "select count(*) as sum from "+tableName+" "+this.sqlStr;

		//清空内容对象
		this.destroy();

		console.log(tmpSql);

		try {

			client.query(tmpSql,function(err,result){

				if(err){
					cb("ERROR");
				}else{
					cb(result[0].sum);
				}
			});
		}catch (_error) {
			err = _error;
			cb("ERROR");
		}

	},

	add:function(addJson,tableName,cb){

		if(addJson <= 0){
			return this;
		}

		var tempfields = "(";
		var tempValues = "(";
		for(var key in addJson){

			tempfields += key + ",";
			tempValues += '"' + addJson[key] + '",';

		}

		tempfields = tempfields.substring(0,tempfields.length - 1) + ")";
		tempValues = tempValues.substring(0,tempValues.length - 1) + ")";


		var tmpSql = "insert into " + tableName + tempfields + " values " + tempValues;

		console.log(tmpSql);


		//清空内容对象
		this.destroy();

		try {
			client.query(tmpSql,function(err,result){
				if(err){
					cb("ERROR");
				}else{
					cb(result.insertId);
				}
			});
		}catch (_error) {
			err = _error;
			cb("ERROR");
		}

	},

	update:function(updateJson,tableName,cb){

		if(updateJson <= 0){
			return this;
		}

		var updateStr = "set ";
		for(var key in updateJson){

			updateStr += key + "='" + updateJson[key] + "',";

		}

		updateStr = updateStr.substring(0,updateStr.length - 1);
		var tmpSql = "update "+tableName+" " + updateStr + " " + this.sqlStr;

		console.log(tmpSql);

		//清空内容对象
		this.destroy();

		try {
			client.query(tmpSql,function(err,result){

				if(err){



					cb("ERROR");
				}else{
					cb(result.affectedRows);
				}
			});
		}catch (_error) {
			err = _error;
			cb("ERROR");
		}

	},

	attachWhere:function(str){

		if(str.length > 0){
			this.sqlStr += " and " + str + " ";
		}
		return this;
	},

	where:function(whereArr){

		if(common.isNullObj(whereArr)){
			return this;
		}

		var whereSql = "where ";
		for(var key in whereArr){
			whereSql += key+"='"+whereArr[key]+"' and ";
		}
		whereSql = whereSql.substring(0,whereSql.length - 4);
		this.sqlStr = whereSql;
		return this;
	},

	del:function(tableName,cb){
		var tmpSql = "delete from "+ tableName + " " + this.sqlStr;

		console.log(tmpSql);

		//清空内容对象
		this.destroy();

		try {
			client.query(tmpSql,function(err,result){
				if(err){
					cb("ERROR");
				}else{
					if(result.affectedRows > 0){
						cb(result.affectedRows);
					}else{
						cb("ERROR");
					}
				}
			});
		}catch (_error) {
			err = _error;
			cb("ERROR");
		}
	},

	query:function(sql,cb){
		if(sql == ""){
			cb("ERROR");
		}

		client.query(sql,function(err,result){
			if(err){
				cb("ERROR");
			}else{
				cb(result);
			}

		});

	},

	order:function(orderStr){
		this.sqlStr = this.sqlStr+"order by "+orderStr + " ";
		return this;
	},

	limit:function(skip,limit){
		this.sqlStr = this.sqlStr+"limit "+	skip + "," + limit;
		return this;
	},

	field:function(fieldSql){
		this.fieldStr = fieldSql;
		return this;
	},

	destroy : function(){
		this.sqlStr   = "";
		this.fieldStr = "";
	}
	

}

module.exports = Db;