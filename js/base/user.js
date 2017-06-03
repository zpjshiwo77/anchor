/// <reference path="framwork.js" />
//2015.9.20
var loop = new Loop({ keyname: 'anchor_template' });
var iuser=importUser();

function importUser(){
	
	var user={};
	user.info={};
	
	user.init = function (callback) {
        loop.islogin(function (data) {
            if (!data) {

                if (icom.getQueryString('openid') == null) {
                    $.get('ajax/appkey.ashx', {}, function (data) {
                        location.href = 'http://fswechatmgmt.chinacloudsites.cn/api/WeChatAuth/UserInfoAuth?redirect=' + 'http://anchorgifting.anchorchina.cn/' + '&wfpUser=' + data.wfpUser + '&appKey=' + data.appKey + '&unixtime=' + data.unixtime + '';
                    }, 'json');
                }
                else {
                    loop.login_all(icom.getQueryString('openid'), icom.getQueryString('nickname'), icom.getQueryString('headimg'), function () {
                        loop.getuser(function (data) {
                            initCallback(data, callback);
                        });
                    });
                }
            }
            else {

                loop.getuser(function (data) {
                    initCallback(data, callback);
                });
            }
	    })
	}//end func	
	
	function initCallback(data,callback){
		console.log('获得微信用户数据');
		setTimeout(function(){
			icom.objectPrint(data);
		},50);
		user.info=data;
		if(callback) callback(data);
	}//end func
	
	return user;
	
}//end func


