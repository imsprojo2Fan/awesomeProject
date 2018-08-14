
var acc,pass,objChk;
$(function(){
	
	//页面初始化
	//$("#checkbox").attr("checked", false);
	$('#account').val(getCookieValue("acc"));
	$('#password').val(getCookieValue("pass"));
	//$("#checkbox").attr("checked", "checked");
	
	if(getCookieValue("check")==1){
		//console.log(getCookieValue("check"));
		$("#checkbox").attr("checked", "checked");
	}
	
	$("#submit").on('click',function(){
		 acc = $("#account").val().trim();
		 pass = $("#password").val().trim();
		if(!acc){
			swal("请输入账号!",' ',"warning");
			return false;
		}
		if(!pass){
			swal("密码不能为空!",' ',"warning");
			return false;
		}
		
		objChk = document.getElementById("checkbox");  
		if(objChk.checked){  
			//添加cookie  
			addCookie("acc",acc,7,"/");  
			addCookie("pass",pass,7,"/");  
			addCookie("check",1,7,"/");
			//swal("记住了你的密码登录。",' ',"success");
			ajaxValidate();
			
		}else{
			deleteCookie("acc",'/');
			deleteCookie("pass",'/');
			deleteCookie("check",'/');
			//swal("不记密码登录。",' ',"error");
			ajaxValidate();
		}  
	});
});

function ajaxValidate(){
	$.ajax({
		url : "/validate",
		type : "POST",
		data : $("#login_form").serialize(),
		dataType : "json",
		cache : false,
		beforeSend:function(){
			$('#loading').fadeIn(200);
		},
		success : function(r) {
			if (r.code == 1) {
				window.location.href = "/main";
                //swal("登录成功!",' ',"success");
			} else {
				swal(r.msg,' ',"error");
			}
		},
		complete:function () {
            $('#loading').fadeOut(200);
        }
	});
}

function addCookie(name,value,days,path){/**添加设置cookie**/  
	var name = escape(name);  
	var value = escape(value);  
	var expires = new Date();  
	expires.setTime(expires.getTime() + days * 3600000 * 24);  
	//path=/，表示cookie能在整个网站下使用，path=/temp，表示cookie只能在temp目录下使用  
	path = path == "" ? "" : ";path=" + path;  
	//GMT(Greenwich Mean Time)是格林尼治平时，现在的标准时间，协调世界时是UTC  
	//参数days只能是数字型  
	var _expires = (typeof days) == "string" ? "" : ";expires=" + expires.toUTCString();  
	document.cookie = name + "=" + value + _expires + path;  
}  
function getCookieValue(name){  /**获取cookie的值，根据cookie的键获取值**/  
	//用处理字符串的方式查找到key对应value  
	var name = escape(name);  
	//读cookie属性，这将返回文档的所有cookie  
	var allcookies = document.cookie;         
	//查找名为name的cookie的开始位置  
	name += "=";  
	var pos = allcookies.indexOf(name);      
	//如果找到了具有该名字的cookie，那么提取并使用它的值  
	if (pos != -1){                                      //如果pos值为-1则说明搜索"version="失败  
		var start = pos + name.length;                  //cookie值开始的位置  
		var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
		if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie  
		var value = allcookies.substring(start,end); //提取cookie的值  
		return (value);                           //对它解码        
	}else{  //搜索失败，返回空字符串  
		return "";  
	}  
}  
function deleteCookie(name,path){   /**根据cookie的键，删除cookie，其实就是设置其失效**/  
	var name = escape(name);  
	var expires = new Date(0);  
	path = path == "" ? "" : ";path=" + path;  
	document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path;  
}  
  
/**实现功能，保存用户的登录信息到cookie中。当登录页面被打开时，就查询cookie**/  
/*window.onload = function(){  
	var userNameValue = getCookieValue("userName");  
	document.getElementById("txtUserName").value = userNameValue;  
	var userPassValue = getCookieValue("userPass");  
	document.getElementById("txtUserPass").value = userPassValue;  
}*/  
  
function userLogin(){   /**用户登录，其中需要判断是否选择记住密码**/  
	//简单验证一下  
	var userName = document.getElementById("account").value;  
	if(userName == ''){  
		alert("请输入用户名。");  
		return;  
	}  
	var userPass = document.getElementById("txtUserPass").value;  
	if(userPass == ''){  
		alert("请输入密码。");  
		return;  
	}  
	var objChk = document.getElementById("chkRememberPass");  
	if(objChk.checked){  
		//添加cookie  
		addCookie("userName",userName,7,"/");  
		addCookie("userPass",userPass,7,"/");  
		alert("记住了你的密码登录。");  
		window.location.href = "http://www.baidu.com";  
	}else{  
		alert("不记密码登录。");  
		window.location.href = "http://www.baidu.com";  
	}  
}  