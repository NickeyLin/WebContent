/**
 * @author 林 建
 */


//login.html------------------------------------------
$(document).on("pagebeforeshow", "#pagelogin", function(){
	setHeight();
});
$(document).on("pageshow", "#pagelogin", function(){
	$.post("redirect", {
		toPage : "login.html",
	}, function(xhr, result) {
		if (null == xhr) {
			tipCodeElement.innerHTML = "请求发送失败，请检查你的网络是否正常。";
		}
	});
});
function setHeight() {
	var lengh;
	lengh = document.body.scrollHeight / 6;
	$("div[data-role='content']").css("padding-top", '55px');
};
function login_submit() {
	$.post("login", {
		username : $("#pagelogin #username").val(),
		password : $("#pagelogin #password").val(),
	}).always(function(data) {
		if (null == data) {
			alert("请求发送失败，请检查你的网络是否正常。");
		}
		var iframe = document.getElementById("result");
		var doc = iframe.document;
		if (iframe.contentDocument)
			doc = iframe.contentDocument;
		// For NS6
		else if (iframe.contentWindow)
			doc = iframe.contentWindow.document;
		// For IE5.5 and IE6

		doc.open();
		doc.writeln(data);
		doc.close();
	});
}



//register.html------------------------------------------
$(document).on("pagebeforeshow", "#pageregister", function(){
	setHeight();
});

$(document).on("pageshow", "#pageregister", function(){

	$("#pageregister #username").bind("keyup",function(e){
		var value = e.target.value;
		var phoneReg1 = /^1$/;
		var phoneReg2 = /^1[3|4|5|8]\d{0,9}$/;
		var verifyCode = document.getElementById("verifyCode");

		if (phoneReg1.test(value) || phoneReg2.test(value) || value.length == 0) {
			verifyCode.style.display = "block";
		} else {
			verifyCode.style.display = "none";
			document.getElementById("codeTip").innerHTML = "";
		}
	});
	$("#pageregister #passwordc").bind("keyup", function(e){
		var value = e.target.value;
		var pwd = document.getElementById("password").value;
		var tipElement = document.getElementById("tip");

		if (value == pwd) {
			tipElement.style.display = "none";
		} else {
			tipElement.style.display = "block";
			tipElement.innerHTML = "两次密码输入不一样。";
		}
	});

	$.post("redirect", {
		toPage : "register.html",
	}, function(xhr, result) {
		if (null == xhr) {
			tipCodeElement.innerHTML = "请求发送失败，请检查你的网络是否正常。";
		}
	});
});

var phoneReg = /^1\d{10}$/;
var isUsernameValid = false;
var isPwdValid = false;
var isNeedCode = false;
var timer = 60;

function timerCutdown(){
	timer--;
	if(timer >= 0){
		document.getElementById("codeTip").innerHTML = "验证码发送成功，若" + timer + "秒后还没发送到您手机，您可以再次获取。";
		t = setTimeout('timerCutdown()', 1000);
		$("#pageregister #getVerifyCode").attr("disabled", 'true');
	}else{
		$("#pageregister #getVerifyCode").removeAttr("disabled");
	}
}
function getCode() {

	var phonenum = $("#pageregister #username").val();
	var tipCodeElement = document.getElementById("codeTip");
	if (phoneReg.test(phonenum)) {
		//手机号注册
		$.post("getcode", {
			getcode : "registercode",
			phonenum : phonenum
		}, function(xhr, result) {
			if (null == xhr) {
				tipCodeElement.innerHTML = "请求发送失败，请检查你的网络是否正常。";
			} else if (result == "success") {
				tipCodeElement.innerHTML = "验证码发送成功，若1分钟后还没发送到您手机，您可以再次获取。";
				t = setTimeout('timerCutdown()', 1000);
			}
			tipCodeElement.style.display = "block";
		});
	} else {
		tipCodeElement.innerHTML = "你没有输入正确的手机号码，若打算使用非手机号注册，则不需要获取验证码。";
		tipCodeElement.style.display = "block";
	}
}

function didEndInputUsername(e) {
	var num = $("#pageregister #username").val();
	var verifyCode = document.getElementById("verifyCode");
	if (phoneReg.test(num)) {
		verifyCode.style.display = "block";
		isNeedCode = true;
	} else {
		if (num.length == 0) {
			$("#pageregister #password").val("");
			$("#pageregister #passwordc").val("");
		}
		verifyCode.style.display = "none";
		isNeedCode = false;
	}
	isUsernameValid = num.length >= 4;
}

function didEndInput(e) {
	var num1 = $("#pageregister #password").val();
	var num2 = $("#pageregister #passwordc").val();
	var tipElement = document.getElementById("tip");
	if (num1.length <= 0) {
		tipElement.style.display = "block";
		tipElement.innerHTML = "密码不能为空";
		isPwdValid = false;
	} else if (num1.length < 6) {
		tipElement.style.display = "block";
		tipElement.innerHTML = "你输入的密码太短，请输入一个至少6位的密码。";
		isPwdValid = false;
	} else if (num1 != num2) {
		tipElement.style.display = "block";
		tipElement.innerHTML = "你两次输入的密码不一样，请重新输入。";
		isPwdValid = false;
	} else {
		tipElement.style.display = "none";
		isPwdValid = true;
	}
}

function complete_submit() {
	//验证表单
	var isValid = false;
	var tipElement = document.getElementById("tip");
	var code = document.getElementById("code").value;
	didEndInputUsername(document.getElementById("username"));
	didEndInput(null);
	if (!isUsernameValid) {
		tipElement.innerHTML = "请输入长度至少4位的用户名";
		tipElement.style.display = "block";
	} else if (isNeedCode && code.length == 0) {
		tipElement.innerHTML = "验证码不能为空";
		tipElement.style.display = "block";
	} else if (!isPwdValid) {
		console.log("密码不正确");
	} else {
		tipElement.style.display = "none";
		isValid = true;
	}
	if (!isValid) {
		return;
	};
	$.post("register", {
		username : $("#pageregister #username").val(),
		code : $("#code").val(),
		password : $("#pageregister #password").val(),
		passwordc : $("#pageregister #passwordc").val()
	}).always(function(data) {
		if (null == data) {
			alert("请求发送失败，请检查你的网络是否正常。");
		}
		var iframe = document.getElementById("result");
		var doc = iframe.document;
		if (iframe.contentDocument)
			doc = iframe.contentDocument;
		// For NS6
		else if (iframe.contentWindow)
			doc = iframe.contentWindow.document;
		// For IE5.5 and IE6

		doc.open();
		if(data.responseText){
			doc.writeln(data.responseText);
		}else{
			doc.writeln(data);
		}
		doc.close();
	});
}