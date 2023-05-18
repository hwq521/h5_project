//window.basePath='http://127.0.0.1' ;
//var h5_basePath='D:/workspace/hengbang_page/h5';
//window.basePath = 'https://miniprogramtest.upfreely.online';
//var h5_basePath = 'https://miniprogramtest.upfreely.online/u';
window.basePath = 'https://apptest.hb-online.cn';
var h5_basePath = 'https://apptest.hb-online.cn/u';
//window.basePath = 'https://app.hb-online.cn';
//var h5_basePath = 'https://app.hb-online.cn/u';
//window.basePath = 'https://miniprogram.upfreely.online';
//var h5_basePath = 'https://miniprogram.upfreely.online/u';
var miniprogram_version = '2.0.1'; //生产小程序版本
var wxConfigBusinessType = "05"; //U保管家公众号
//禁止右键
//document.oncontextmenu = new Function("event.returnValue=false;");
//document.onselectstart = new Function("event.returnValue=false;");

$(document).ready(function() {
	//初始化使用环境值
	initEnvValue();
});


function ajaxCommonData() {
	return {
		userUuid: getAgentUuid(),
		userType: "2", //1表示内勤账号  2表示代理人账号  3表示企业用户账号
		miniBusinessType: wxConfigBusinessType,
		loginThirdUuid: getThirdUuid(), //'c2f75fe038d54db58de886f1b7b7411b',//
		loginAgentUuid: getAgentUuid(),
		thirdUuid: getThirdUuid(),
		storeNo: getSessionStoreNo(),
		version: '2.0.3',
		"devPlatform": "devtools",
		"miniAppid": "wx44c387f091ff7989",
		miniprogramType: "weixin"
	}
}

function initEnvValue() {
	var envValue = ""; //使用环境
	try {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			//在微信里
			wx.miniProgram.getEnv((res) => {
				if (res.miniprogram) {
					envValue = "mini";
				} else {
					envValue = "weixin";
				}
				console.log("envValue1=" + envValue);
				$("body").append("<input type='hidden' id='envValue' value='" + envValue + "'/>")
			})
		} else {
			console.log("envValue2=" + envValue);
			envValue = "other";
			$("body").append("<input type='hidden' id='envValue' value='" + envValue + "'/>")
		}

	} catch (e) {
		console.log("initEnvValue异常" + e);
	}

}


//获取url参数的值，传的是参数名称(类型：String)，此方法在多个参数时比较好用
// 例如获取商品的uuid--var productUuid = getQueryString(productUuid);
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}

//清空缓存
function removeAllLocalStorage() {
	removeSessionStoreNo();
	removeWxopenid();
	removeWxUnionid();
	removeThirdUuid();
	removeWechatAttention();
	removeAgentUuid();
	removeAgentRoleType();
	removeLoginToken();
	removeLoginSessionId();
	removePayOrderUuid();
	removeSessionRecommendId();
}

//设置渠道编号
function setSessionStoreNo(storeNo) {
	if (storeNo == "") {
		alert("参数不能传空值！");
		return;
	}
	localStorage.setItem('storeNo', storeNo);
}
//获取渠道编号
function getSessionStoreNo() {
	return '1001';
	//return underfinedToEmpty(localStorage.getItem('storeNo'));
}
//清除渠道编号
function removeSessionStoreNo() {
	localStorage.removeItem('storeNo');
}

//设置微信端openid
function setWxopenid(openid) {
	if (underfinedToEmpty(openid) == "") {
		//alert("参数不能传空值！");
		return;
	}
	localStorage.setItem('upfreelyWxOpenid', openid);
}
//获取微信端openid
function getWxopenid() {
	return underfinedToEmpty(localStorage.getItem('upfreelyWxOpenid'));
}
//清除微信端openid
function removeWxopenid() {
	localStorage.removeItem('upfreelyWxOpenid');
}


//设置微信端unionid
function setWxUnionid(unionid) {
	if (underfinedToEmpty(unionid) == "") {
		//alert("参数不能传空值！");
		return;
	}
	localStorage.setItem('upfreelyWxUnionid', unionid);
}
//获取微信端unionid
function getWxUnionid() {
	return underfinedToEmpty(localStorage.getItem('upfreelyWxUnionid'));
}
//清除微信端unionid
function removeWxUnionid() {
	localStorage.removeItem('upfreelyWxUnionid');
}

//设置第三方uuid
function setThirdUuid(thirdUuid) {
	if (underfinedToEmpty(thirdUuid) == "") {
		//alert("参数不能传空值！");
		return;
	}
	localStorage.setItem('upfreelythirdUuid', thirdUuid);
}
//获取第三方uuid
function getThirdUuid() {
	var thirdUuid = underfinedToEmpty(localStorage.getItem('upfreelythirdUuid'));
	if (thirdUuid == "") {
		thirdUuid = underfinedToEmpty(getQueryString('appThirdUuid'));
		if (thirdUuid != "") {
			setThirdUuid(thirdUuid);
		}
	}
	return thirdUuid;
}
//清除第三方uuid
function removeThirdUuid() {
	localStorage.removeItem('upfreelythirdUuid');
}


//设置是否关注公众号
function setWechatAttention(state) {
	if (underfinedToEmpty(state) == "") {
		//alert("参数不能传空值！");
		return;
	}
	localStorage.setItem('attentionState', state);
}
//获取是否关注公众号
function getWechatAttention() {
	return underfinedToEmpty(localStorage.getItem('attentionState'));
}
//清除是否关注公众号
function removeWechatAttention() {
	localStorage.removeItem('attentionState');
}

//设置代理人uuid
function setAgentUuid(agentUuid) {
	if (underfinedToEmpty(agentUuid) == "") {
		alert("参数不能传空值！");
		return;
	}
	localStorage.setItem('agentUuid', agentUuid);
}
//获取代理人uuid
function getAgentUuid() {
	var agentUuid = underfinedToEmpty(getQueryString('appAgentUuid'));
	if (agentUuid == "") {
		agentUuid = underfinedToEmpty(localStorage.getItem('agentUuid'));
	}else{
		setAgentUuid(agentUuid);
	}
	return agentUuid;
}
//清除代理人uuid
function removeAgentUuid() {
	localStorage.removeItem('agentUuid');
}

//设置代理人角色类型
function setAgentRoleType(agentRoleType) {
	if (underfinedToEmpty(agentRoleType) == "") {
		alert("参数不能传空值！");
		return;
	}
	localStorage.setItem('agentRoleType', agentRoleType);
}
//获取代理人角色类型
function getAgentRoleType() {
	var agentRoleType = underfinedToEmpty(localStorage.getItem('agentRoleType'));
	if (agentRoleType == "") {
		agentRoleType = underfinedToEmpty(getQueryString('appAgentRoleType'));
		if (agentRoleType != "") {
			setAgentRoleType(agentRoleType);
		}
	}
	return agentRoleType;
}
//清除代理人角色类型	
function removeAgentRoleType() {
	localStorage.removeItem('agentRoleType');
}

//设置代理人登录token
function setLoginToken(token) {
	if (underfinedToEmpty(token) == "") {
		alert("参数不能传空值！");
		return;
	}
	localStorage.setItem('loginToken', token);
}
//获取代理人登录token
function getLoginToken() {
	return underfinedToEmpty(localStorage.getItem('loginToken'));
}
//清除代理人登录token
function removeLoginToken() {
	localStorage.removeItem('loginToken');
}


//设置代理人登录sessionId
function setLoginSessionId(sessionId) {
	if (underfinedToEmpty(sessionId) == "") {
		alert("参数不能传空值！");
		return;
	}
	localStorage.setItem('loginSessionId', sessionId);
}
//获取代理人登录sessionId
function getLoginSessionId() {
	return underfinedToEmpty(localStorage.getItem('loginSessionId'));
}
//清除代理人登录sessionId
function removeLoginSessionId() {
	localStorage.removeItem('loginSessionId');
}

//设置支付订单uuid
function setPayOrderUuid(orderUuid) {
	if (underfinedToEmpty(orderUuid) == "") {
		alert("参数不能传空值！");
		return;
	}
	localStorage.setItem('hrygPayOrderUuid', orderUuid);
}
//获取支付订单uuid
function getPayOrderUuid() {
	return underfinedToEmpty(localStorage.getItem('hrygPayOrderUuid'));
}
//清除支付订单uuid
function removePayOrderUuid() {
	localStorage.removeItem('hrygPayOrderUuid');
}





//设置session中的推荐人id
function setSessionRecommendId(recommendId) {
	if (recommendId == "") {
		alert("参数不能传空值！");
		return;
	}
	localStorage.setItem('recommend_id', recommendId);
}
//获取session中的推荐人id
function getSessionRecommendId() {
	return underfinedToEmpty(localStorage.getItem('recommend_id'));
}
//清除session中的推荐人id
function removeSessionRecommendId() {
	localStorage.removeItem('recommend_id');
}


//设置session中是否有刘海
function setSessionLiuHai(liuhai) {
	if (liuhai == "") {
		return;
	}
	localStorage.setItem('liuhai_state', liuhai);
}
//获取session中是否有刘海
function getSessionLiuHai() {
	return underfinedToEmpty(localStorage.getItem('liuhai_state'));
}
//清除session中的否有刘海
function removeSessionLiuHai() {
	localStorage.removeItem('liuhai_state');
}
//设置session中设备机型
function setSessionModelName(modelName) {
	if (modelName == "") {
		return;
	}
	localStorage.setItem('mobile_modelName', modelName);
}
//获取session中设备机型
function getSessionModelName() {
	return underfinedToEmpty(localStorage.getItem('mobile_modelName'));
}
//清除session中设备机型
function removeSessionModelName() {
	localStorage.removeItem('mobile_modelName');
}

//设置早报中的固定短语
function setSessionTitlePhrase(userId, modelName) {
	if (modelName == "") {
		return;
	}
	localStorage.setItem(userId + '_newpaper_title_phrase', modelName);
}
//获取早报中的固定短语
function getSessionTitlePhrase(userId) {
	return underfinedToEmpty(localStorage.getItem(userId + '_newpaper_title_phrase'));
}


//设置授权路径
function setLocalStorageAuthUrl(authUrl) {
	localStorage.setItem('authUrl', authUrl);
}
//获取授权路径
function getLocalStorageAuthUrl() {
	return underfinedToEmpty(localStorage.getItem('authUrl'));
}
//清除授权路径
function removeLocalStorageAuthUrl() {
	localStorage.removeItem('authUrl');
}



//获取终端类型
function getAndroidOrIos() {
	var u = navigator.userAgent,
		app = navigator.appVersion;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	var terminal = "";
	if (isAndroid) {
		terminal = "android";
	}
	if (isIOS) {
		terminal = "ios";
	}
	return terminal;
}
//如果获取不到对象，返回空字符串
function underfinedToEmpty(exp) {
	if (typeof(exp) != "undefined" && exp != "undefined" && exp != "null" && exp != null) {
		return exp;
	}
	return "";
}

//判断是否是微信客户端
function is_wechat_client() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		return true;
	} else {
		return false;
	}
}

function is_app_client() {
	return !is_wechat_client();
}

function weixinAgentAuthorize(pageType, agentUuid) {
	if (is_wechat_client()) {
		var url = window.basePath + "/api/wx/quicklogin/getWXPublicUrl";
		//alert(url);
		$.get(url, {
				"agentUuid": agentUuid,
				"pageType": pageType,
				"storeNo": getSessionStoreNo(),
				ranNum: Math.random()
			},
			function(data) {
				//alert(data);
				location.href = data;
			});
	}
}



function getLoginTerminalType() {
	if (is_wechat_client()) {
		return "05"; //微信端 
	} else {
		return "04"; //H5端 
	}
}


//////////////////////////////////////////////////////弹框提示///////////////////
//弹框提示
function showAlertInfo(msg) {
	showToast({
		text: msg,
		bottom: '40%',
		zindex: 999,
		speed: 500,
		time: 1500
	});
}
//弹框提示
function showAlertMsg(msg) {
	showAlert({
		text: msg,
		btnText: '确定',
		top: '34%',
		zindex: 999,
		color: '#fff'
	});
}
//弹框提示
function showAlertMsgReturn(msg, func) {
	showAlert({
		text: msg,
		btnText: '确定',
		top: '34%',
		zindex: 999,
		color: '#fff',
		success: function() {
			func();
		}
	});
}
//弹框询问
function confirmShow(msg, func) {
	showConfirm({
		text: msg,
		rightText: '确定',
		rightBgColor: '#2ab5ca', //不建议设置为白色背景
		rightColor: '#fff',
		leftText: '取消',
		success: function() {
			func();
		},
		cancel: function() {
			//取消的回调函数
		}
	});
}


//单击返回按钮不能后退
function initCanNotHistoryBack(title) {
	//防止页面后退
	history.pushState(null, null, document.URL);
	window.addEventListener('popstate', function() {
		history.pushState(null, null, document.URL);
		$("title").html(title);
	});
}

//监听页面离开，关闭页面
function initCloseWindowByListenerPopstate() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		//在微信里
		wx.miniProgram.getEnv((res) => {
			if (res.miniprogram) {
				//在小程序环境里
				var state = {
					title: '',
					url: "#"
				};
				window.history.pushState(state, state.title, state.url);
				//监听页面离开
				window.addEventListener("popstate", function(e) {
					wx.miniProgram.navigateBack({
						delta: 1
					});
				}, false);
			} else {
				//不在小程序里，但在微信端环境
				var state = {
					title: '',
					url: "#"
				};
				window.history.pushState(state, state.title, state.url);
				//监听页面离开
				window.addEventListener("popstate", function(e) {
					//关闭页面
					WeixinJSBridge.call('closeWindow');
				}, false);
			}
		})
	}
}


/**
 * 保存最近的聊天记录
 * [saveMyLastMessage description]
 * @return {[type]} [description]
 */
function saveMyLastMessage(msgBodyStr, loginUserId, receiverUserId) {
	var msgSize = 300; //保存近300条的聊天记录
	console.log("需要保存的消息: " + msgBodyStr + "\n");

	var msgJSONStr = localStorage.getItem(loginUserId + "_" + receiverUserId + "_lastMsg_v1") || '';

	var msgAttr = new Array();

	if (msgJSONStr != '') {
		console.log("之前保存的最新消息: " + msgJSONStr);
		msgAttr = JSON.parse(msgJSONStr);
	}
	//msgBodyStr = "<div class=\"historyTime\">"+getTimeStampYMDHMS()+"</div>" + msgBodyStr;
	msgAttr.push(msgBodyStr);

	var newMsgAttr = [];
	if (msgAttr.length > msgSize) {
		let arrayLength = Math.ceil(msgAttr.length / 2);
		newMsgAttr = msgAttr.slice(arrayLength);
	} else {
		newMsgAttr = msgAttr;
	}

	localStorage.setItem(loginUserId + "_" + receiverUserId + "_lastMsg_v1", JSON.stringify(newMsgAttr));
}
/**
 * 获取聊天记录
 * @param  {[type]} userId [description]
 * @return {[type]}        [description]
 */
function showMyLastMessage(loginUserId, receiverUserId) {
	var msgJSONStr = localStorage.getItem(loginUserId + "_" + receiverUserId + "_lastMsg_v1") || '';
	if (msgJSONStr != "") {
		return JSON.parse(msgJSONStr);
	}
	return null;
}

/**
 * 更改聊天记录里面的消息读取状态
 * @param  {[type]} msgId [description]
 * @return {[type]}       [description]
 */
function changeReadState(loginUserId, receiverUserId, msgId) {
	var msgAttr = showMyLastMessage(loginUserId, receiverUserId);
	if (msgAttr != null) {
		var newMsgAttr = [];
		for (var i = 0; i < msgAttr.length; i++) {
			var msgStr = msgAttr[i];
			if (msgStr.indexOf(msgId) > 0) {
				msgStr = msgStr.replace("未读", "已读");
			}
			newMsgAttr.push(msgStr);
		}
		localStorage.setItem(loginUserId + "_" + receiverUserId + "_lastMsg_v1", JSON.stringify(newMsgAttr));
	}

}

/**
 * 获取当前时间戳 YYYY.MM.dd HH:mm:ss
 *
 * @returns {*}
 */
function getTimeStampYMDHMS() {
	var now = new Date();
	var timestamp = now.getFullYear() + '.' + ((now.getMonth() + 1) >= 10 ? (now.getMonth() + 1) + "." : "0" + (now.getMonth() +
		1) + ".") + (now.getDate() >= 10 ? now.getDate() : "0" + now.getDate()) + " " + (now.getHours() >= 10 ? now.getHours() :
		"0" + now.getHours()) + ":" + (now.getMinutes() >= 10 ? now.getMinutes() : "0" + now.getMinutes()) + ":" + (now.getSeconds() >=
		10 ? now.getSeconds() : "0" + now.getSeconds());
	return timestamp;
}


//加载微信ui
function initWeiXinUI() {
	//Dialog弹框
	var html_1 =
		'<div id="dialogs"><div class="js_dialog" id="iosDialog1" style="opacity: 0; display: none;"><div class="weui-mask"></div><div class="weui-dialog"><div class="weui-dialog__hd"><strong class="weui-dialog__title">弹窗标题</strong></div><div class="weui-dialog__bd">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div><div class="weui-dialog__ft"><a href="javascript:" class="weui-dialog__btn weui-dialog__btn_default">辅助操作</a><a href="javascript:" class="weui-dialog__btn weui-dialog__btn_primary">主操作</a></div></div></div><div class="js_dialog" id="iosDialog2" style="opacity: 0; display: none;"><div class="weui-mask"></div><div class="weui-dialog"><div class="weui-dialog__bd">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div><div class="weui-dialog__ft"><a href="javascript:" class="weui-dialog__btn weui-dialog__btn_default">辅助操作</a><a href="javascript:" class="weui-dialog__btn weui-dialog__btn_primary">主操作</a></div></div></div><div class="js_dialog" id="androidDialog1" style="opacity: 0; display: none;"><div class="weui-mask"></div><div class="weui-dialog weui-skin_android"><div class="weui-dialog__hd"><strong class="weui-dialog__title">弹窗标题</strong></div><div class="weui-dialog__bd">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div><div class="weui-dialog__ft"><a href="javascript:" class="weui-dialog__btn weui-dialog__btn_default">辅助操作</a><a href="javascript:" class="weui-dialog__btn weui-dialog__btn_primary">主操作</a></div></div></div><div class="js_dialog" id="androidDialog2" style="opacity: 0; display: none;"><div class="weui-mask"></div><div class="weui-dialog weui-skin_android"><div class="weui-dialog__bd">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div><div class="weui-dialog__ft"><a href="javascript:" class="weui-dialog__btn weui-dialog__btn_default">辅助操作</a><a href="javascript:" class="weui-dialog__btn weui-dialog__btn_primary">主操作</a></div></div></div></div>';
	$("body").append(html_1);
	//top-tips 顶部显示条，失败提示
	var html_2 = '<div class="weui-toptips weui-toptips_warn" id="topTips" style="display: none; opacity: 1;">错误提示</div>';
	$("body").append(html_2);
	//toast 成功提示，加载中提示
	var html_3 =
		'<div id="toast" style="display: none;"><div class="weui-mask_transparent"></div><div class="weui-toast"><i class="weui-icon-success-no-circle weui-icon_toast"></i><p class="weui-toast__content">已完成</p></div></div><div id="loadingToast" style="display: none;"><div class="weui-mask_transparent"></div><div class="weui-toast"><i class="weui-loading weui-icon_toast"></i><p class="weui-toast__content">数据加载中</p></div></div>';
	$("body").append(html_3);
}

function showWeuiDialog(title, textMsg, leftButtonMsg, rightButtonMsg) {
	$(".js_dialog").hide();
	var num = "2"; //默认没有标题
	if (underfinedToEmpty(title) != "") {
		num = "1";
	}
	var terminal = getAndroidOrIos();
	var $obj = null;
	if (terminal == "ios") {
		$obj = $("#iosDialog" + num);
	} else {
		$obj = $("#androidDialog" + num);
	}

	if (underfinedToEmpty(title) != "") {
		$obj.find(".weui-dialog__title").html(title);
	}
	if (underfinedToEmpty(textMsg) != "") {
		$obj.find(".weui-dialog__bd").html(textMsg);
	}
	if (underfinedToEmpty(leftButtonMsg) == "") {
		$obj.find(".weui-dialog__btn_default").hide();
	} else {
		$obj.find(".weui-dialog__btn_default").show();
		$obj.find(".weui-dialog__btn_default").html(leftButtonMsg);
	}
	if (underfinedToEmpty(rightButtonMsg) == "") {
		$obj.find(".weui-dialog__btn_primary").hide();
	} else {
		$obj.find(".weui-dialog__btn_primary").show();
		$obj.find(".weui-dialog__btn_primary").html(rightButtonMsg);
	}
	/*if(clickLeft!=null){
		$obj.find(".weui-dialog__btn_default").attr("onclick","clickLeft();");
	}
	if(clickRight!=null){
		$obj.find(".weui-dialog__btn_primary").attr("onclick","clickRight();");
	}*/
	$obj.css("opacity", "1");
	$obj.fadeIn(200);
}

function showWeuiSuccess(msg, successfunc) {
	if (underfinedToEmpty(msg) == "") {
		msg = "操作成功";
	}
	$(".weui-toast__content").html(msg);
	var $toast = $('#toast');
	if ($toast.css('display') != 'none') return;
	$toast.fadeIn(100);
	setTimeout(function() {
		$toast.fadeOut(100);
		if (showWeuiSuccess != null) {
			successfunc();
		}
	}, 1500);
}


function showWeuiErrorTopTip(msg) {
	if (underfinedToEmpty(msg) == "") {
		msg = "操作失败";
	}
	$("#topTips").html(msg);
	var $topTips = $('#topTips');
	if ($topTips.css('display') != 'none') return;
	$topTips.fadeIn(100);
	setTimeout(function() {
		$topTips.fadeOut(100);
	}, 1500);
}


/**
 * 获取当前月份
 * @return {[type]} [description]
 */
function getNowMonth() {
	let date = new Date;
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	if (month == 0) {
		year = year - 1;
		month = 12;
	}
	if (parseInt(month) < 10) {
		month = "0" + month;
	}
	return year + "-" + month;
}
//根据url路径传过来的渠道编号，检查缓存
function checkLocalStorageAndReturnStoreNo() {
	return '1001';
	// var storeNo = underfinedToEmpty(getQueryString("storeNo"));
	// console.log("getQueryString===storeNo=" + storeNo);
	// if (storeNo != "") {
	// 	console.log("getSessionStoreNo===storeNo=" + getSessionStoreNo());
	// 	console.log("getThridUuid===thirduuid=" + getThirdUuid());
	// 	if (storeNo != getSessionStoreNo()) {
	// 		//清空缓存
	// 		console.log("清空缓存");
	// 		removeAllLocalStorage();
	// 		setSessionStoreNo(storeNo);
	// 		console.log("清空缓存后getThridUuid===thirduuid=" + getThirdUuid());
	// 	}
	// } else {
	// 	storeNo = getSessionStoreNo();
	// }
	// return storeNo;
}

/**
 * 获取指定月份的上一个月
 * @param  {[type]} monthDate 格式必须是yyyy-MM
 * @return {[type]}           [description]
 */
function getLastMonth(monthDate) {
	let date = monthDate.split("-");
	let year = date[0];
	let month = parseInt(date[1]) - 1;
	if (month == 0) {
		year = year - 1;
		month = 12;
	}
	if (parseInt(month) < 10) {
		month = "0" + month;
	}
	return year + "-" + month;
}



function goToUniPage(methodName, storeNo, title, h5Url) {
	if (underfinedToEmpty(methodName) == "" || underfinedToEmpty(h5Url) == "") {
		return;
	}
	h5Url = h5Url.replace(/\?/g, "$$$param_wenhao$$$");
	h5Url = h5Url.replace(/\=/g, "$$$param_dengyu$$$");
	h5Url = h5Url.replace(/\&/g, "$$$param_join$$$");
	var miniPath = '/pages/index/h5/pageH5?pageid=7&storeNo=' + storeNo + '&title=' + title + '&h5_url=' + h5Url;
	if (methodName == "navigateTo") {
		uni.navigateTo({
			url: miniPath
		});
	} else if (methodName == "redirectTo") {
		uni.redirectTo({
			url: miniPath
		});
	} else if (methodName == "reLaunch") {
		uni.reLaunch({
			url: miniPath
		});
	} else if (methodName == "switchTab") {
		uni.switchTab({
			url: miniPath
		});
	} else if (methodName == "navigateBack") {
		uni.navigateBack({
			delta: 1
		});
	} else if (methodName == "navigateBack2") {
		uni.navigateBack({
			delta: 2
		});
	}
}

// 初始化页面的input type为number ios不可以输入汉字和其他字符以及maxLength不兼容的问题
function inputNumber() {
	var allInput = document.getElementsByTagName('input'),
		filterInput = []
	for (var i = 0; i < allInput.length; i++) {
		if (allInput[i].type === 'number') {
			allInput[i].addEventListener('input', function(e) {
				var maxLength = e.target.maxLength
				this.value = this.value.replace(/[^0-9.]+/, '');
				if (maxLength && this.value.length > maxLength) this.value = this.value.slice(0, maxLength)
				console.log(this.value, e)
			})
			filterInput.push(filterInput)
		}
	}
	if (filterInput.length) console.log(`当前页面的${filterInput.length}个input number，已完成兼容`)
}
// 页面加载完成
window.addEventListener('load', function(e) {
	inputNumber()
})



function isUniApp() {
	if (is_wechat_client()) {
		return false;
	} else {
		var terminal = getAndroidOrIos();
		if (terminal == "android") {
			return true;
		} else {
			return false;
		}
	}
}