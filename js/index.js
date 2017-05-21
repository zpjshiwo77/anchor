$(document).ready(function(){
	
	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox=$('aside.loadBox');
	var articleBox=$('article');
	var windowScale=window.innerWidth/750;

	var authBox = $("section.auth");
	var choseBox = $("section.chose");
	var controlBox = $("div.control");
	var japanCBox = $("section.japanC");
	var japanRBox = $("section.japanR");
	var franceCBox = $("section.franceC");
	var franceRBox = $("section.franceR");

	var itemplet = "";
	var controlFlag = false;
	var first = true;
	var nowStep = 0;

	var myScroll = new IScroll('#scrollBox',{
		bounce:true,
		click:true,
		scrollX: true,
		scrollY: false
	});

	var iOffsetY = $(".Offset").height();
	var iOffsetX = $(".Offset").width();

	// var myScrollF = new IScroll('#f_r_scroll',{
	// 	bounce:true,
	// 	click:true,
	// 	scrollX: true,
	// 	scrollY: false,
	// 	preventDefault:false,
	// 	preventDefaultException:{className: /(^|\s)formfield(\s|$)/}
	// });

	// var myScrollJ = new IScroll('#j_r_scroll',{
	// 	bounce:true,
	// 	click:true,
	// 	scrollX: true,
	// 	scrollY: false,
	// 	preventDefault:false,
	// 	preventDefaultException:{className: /(^|\s)formfield(\s|$)/}
	// });

	var camera_j_c_m = new camera();
	var camera_j_c_l = new camera();
	var camera_j_c_c = new camera();
	var camera_j_r_m = new camera();
	var camera_j_r_l = new camera();
	var camera_j_r_c = new camera();
	var camera_f_c_m = new camera();
	var camera_f_c_l = new camera();
	var camera_f_c_c = new camera();
	var camera_f_r_m = new camera();
	var camera_f_r_l = new camera();
	var camera_f_r_c = new camera();
	
	//----------------------------------------页面初始化----------------------------------------
	icom.init(init);//初始化
	icom.screenScrollUnable();//如果是一屏高度项目且在ios下，阻止屏幕默认滑动行为
	
	function init(){
		requestAnimationFrame(function(){
			loadBox.show();
			iuser.init(userGetted);
//			load_handler();
		});
	}//edn func
	
	//----------------------------------------微信用户登录验证----------------------------------------	
	function userGetted(data){
		console.log('用户头像：'+data.headimage);
		console.log('用户昵称：'+data.nickname);
		load_handler();
	}//end func
	
	//----------------------------------------加载页面图片----------------------------------------
	function load_handler(){
		var loader = new PxLoader();

		loader.addImage('images/auth/bg.jpg');

		for (var i = 1; i <= 2; i++) {
			loader.addImage('images/france/bgCol'+i+'.jpg');
			loader.addImage('images/france/bgRow'+i+'.jpg');
			loader.addImage('images/france/color'+i+'.png');
			loader.addImage('images/france/upload'+i+'.png');
			loader.addImage('images/france/upbtn'+i+'.png');

			loader.addImage('images/japan/chopsticks'+i+'.png');
			loader.addImage('images/japan/chopsticks'+i+'r.png');
			loader.addImage('images/japan/color'+i+'.png');
			loader.addImage('images/japan/upload'+i+'.png');
		};

		for (var i = 0; i < 5; i++) {
			loader.addImage('images/public/step'+i+'.png');
		};

		loader.addImage('images/france/col.jpg');
		loader.addImage('images/france/row.jpg');

		loader.addImage('images/japan/bgCol.jpg');
		loader.addImage('images/japan/bgRow.jpg');
		loader.addImage('images/japan/col.jpg');
		loader.addImage('images/japan/row.jpg');
		loader.addImage('images/japan/upbtn.png');

		loader.addImage('images/public/code.jpg');
		loader.addImage('images/public/control.png');
		loader.addImage('images/public/head.png');
		loader.addImage('images/public/logoG.png');
		loader.addImage('images/public/logoW.png');
		loader.addImage('images/public/share.png');
		loader.addImage('images/public/stickersBox.png');
		loader.addImage('images/public/tips.png');

		loader.addImage('images/sticker/c.png');
		for (var i = 1; i <= 17; i++) {
			loader.addImage('images/sticker/'+i+'.png');
		};
		//实际加载进度
//		loader.addProgressListener(function(e) {
//			var per=Math.round(e.completedCount/e.totalCount*50);
//			loadPer.html(per+'%');
//		});
		
		loader.addCompletionListener(function() {
			init_handler();
//			load_timer(50);//模拟加载进度
			loader=null;
		});
		loader.start();	
	}//end func
	
	//模拟加载进度
	function load_timer(per){
		per=per||0;
		per+=imath.randomRange(1,3);
		per=per>100?100:per;
		loadPer.html(per+'%');
		if(per==100) setTimeout(init_handler,200);
		else setTimeout(load_timer,33,per);
	}//edn func
	
	//----------------------------------------页面逻辑代码----------------------------------------
	function init_handler(){
		console.log('init handler');
		icom.fadeOut(loadBox,500);
		monitor_handler();
		icom.fadeIn(articleBox);
		pageInit();
	}//end func

	//页面初始化
	function pageInit(){
		btnInit();
		// choseBoxShow();
		cameraInit();
	}//end func

	//相机初始化
	function cameraInit(){
		camera_j_c_m.init($(".japanC .shell"),$(".japanC .uploadBtn"),true,function(){$(".japanC .shell").addClass("up")});
		camera_j_c_l.init($(".japanC .l-shell"),$(".japanC .l-ulBtn"),false,function(){$(".japanC .l-shell").addClass("up")});
		camera_j_c_c.init($(".japanC .c-shell"),$(".japanC .c-ulBtn"),false,function(){$(".japanC .c-shell").addClass("up");if(nowStep == 1) {icom.fadeIn($("#next"));}});

		camera_j_r_m.init($(".japanR .shell"),$(".japanR .uploadBtn"),true,function(){$(".japanR .shell").addClass("up")});
		camera_j_r_l.init($(".japanR .l-shell"),$(".japanR .l-ulBtn"),false,function(){$(".japanR .l-shell").addClass("up")});
		camera_j_r_c.init($(".japanR .c-shell"),$(".japanR .c-ulBtn"),false,function(){$(".japanR .c-shell").addClass("up");if(nowStep == 1) {icom.fadeIn($("#next"));}});

		camera_f_c_m.init($(".franceC .shell"),$(".franceC .uploadBtn"),true,function(){$(".franceC .shell").addClass("up")});
		camera_f_c_l.init($(".franceC .l-shell"),$(".franceC .l-ulBtn"),false,function(){$(".franceC .l-shell").addClass("up")});
		camera_f_c_c.init($(".franceC .c-shell"),$(".franceC .c-ulBtn"),false,function(){$(".franceC .c-shell").addClass("up");if(nowStep == 1) {icom.fadeIn($("#next"));}});

		camera_f_r_m.init($(".franceR .shell"),$(".franceR .uploadBtn"),true,function(){$(".franceR .shell").addClass("up")});
		camera_f_r_l.init($(".franceR .l-shell"),$(".franceR .l-ulBtn"),false,function(){$(".franceR .l-shell").addClass("up")});
		camera_f_r_c.init($(".franceR .c-shell"),$(".franceR .c-ulBtn"),false,function(){$(".franceR .c-shell").addClass("up");if(nowStep == 1) {icom.fadeIn($("#next"));}});

		japanCBox.hide();
		japanRBox.hide();
		franceCBox.hide();
		franceRBox.hide();
	}//end func

	//按钮初始化
	function btnInit(){
		$("#vef").on("click",sendCode);
		$(".opt").on("click",choseTemplet);
		$("#next").on("click",function(){
			if(nowStep == 0) confirmTem();
			if(nowStep == 1) judgeVal();
			if(nowStep == 2){
				if($("#tone").hasClass('active')) $("#tone").click();
				icom.fadeIn($("#view"),500,function(){
					nowStep++;
					$("#sticker").click();
					$("#next").hide();
					if(nowStep == 3) showTipsDialog(nowStep);
				});
			}
		});
		$("#tone").on("click",toneShow);
		$("#sticker").on("click",stickerShow);
		$("#color img").on("click",switchColor);
		$("#templet").on("click",backToChose);
		$("#stickers img").on("click",addAdorn);
		$(".cont").on("click",".adorn .remove",delAdorn);
		$(".cont").on("touchmove",".adorn",moveAdorn);
		$("#view").on("click",previewPoster);
		$("#stickers .prev").on("click",function(){
			stickersMove(1)
		});
		$("#stickers .next").on("click",function(){
			stickersMove(-1);
		});
	}//end func

	//判断值
	function judgeVal(){
		var titleA = $("."+itemplet+" .titleA").val();
		var titleB = $("."+itemplet+" .titleB").val();
		var main = $("."+itemplet+" .shell").hasClass("up");
		var logo = $("."+itemplet+" .l-shell").hasClass("up");
		var code = $("."+itemplet+" .c-shell").hasClass("up");

		if(titleA == "") icom.alert("请输入主标题");
		else if(titleB == "") icom.alert("请输入副标题");
		else if(!logo) icom.alert("请上传logo");
		else if(!main) icom.alert("请上传一张内容图片");
		else if(!code) icom.alert("请上传一张二维码图片");
		else{
			setTimeout(function(){
				nowStep++;
				$("#tone").click();
				if(nowStep == 2) showTipsDialog(nowStep);
			},300); 
		}
	}//end func

	//贴纸盒子移动
	function stickersMove(d){
		var w = $("#scrollBox").width();
		myScroll.scrollBy(d * w / 2,0,600);
	}//end func

	//预览海报
	function previewPoster(){
		icom.fadeIn(loadBox);
		removeTips();
		icamera.makeImg($("."+itemplet+" .cont"),function(img){
			icom.fadeOut(loadBox);
			$("#preview .previewImg")[0].src = img;
			icom.popOn($("#preview"),{fade:500,onClose:showTips});
			sendInfo(img);
			resetShare(img);
		});
		setTimeout(function(){
			nowStep++;
			if(nowStep == 4) showTipsDialog(nowStep);
		},200);
	}//end func

	//重置分享
	function resetShare(img){
		var url=location.href.substr(0, location.href.lastIndexOf('/')+1) + "share.html?i=" + img;
		ishare.reset({link:url});
	}//end func

	//发送信息 AJAX
	function sendInfo(img){
	    loop.user.add({ remarks: img })
	}//end func

	//显示提示
	function showTips(){
		nowStep++;
		var titleA = $("."+itemplet+" .titleA");
		var titleB = $("."+itemplet+" .titleB");
		var adornC = $(".adorn .remove");
		var upload = $("."+itemplet+" .uploadBtn");

		titleA.css("border-color","#626262");
		titleB.css("border-color","#626262");
		adornC.show();
		upload.show();
	}//end func

	//移除掉一些提示
	function removeTips(){
		var titleA = $("."+itemplet+" .titleA");
		var titleB = $("."+itemplet+" .titleB");
		var adornC = $(".adorn .remove");
		var upload = $("."+itemplet+" .uploadBtn");

		titleA.css("border-color","rgba(0,0,0,0)");
		titleB.css("border-color","rgba(0,0,0,0)");
		adornC.hide();
		upload.hide();
	}//end func

	//移动装饰
	function moveAdorn(e){
		var x = e.offsetX - $(this).width()/2 - iOffsetX;
		var y = e.offsetY - $(this).height()/2 - iOffsetY;
		$(this).css({x:x,y:y});
		e.stopPropagation();
	}//end func

	//删除装饰
	function delAdorn(){
		$(this).parents(".adorn").remove();
	}//end func

	//添加装饰
	function addAdorn(){
		var img = $(this).attr("src");
		var cont = '<div class="adorn"> <img src="'+img+'"> <div class="remove"></div> </div>';
		$("."+itemplet+" .cont").append(cont);
	}//end func

	//返回选择模板
	function backToChose(){
		if(!$(this).hasClass("active") && controlFlag && nowStep > 3){
			nowStep = 0;
			controlFlag = false;
			$("#templet").addClass("active");
			$("#view").hide();
			$("#next").show();
			$("."+itemplet).hide();
			$("."+itemplet+" .uploadBtn").show();
			choseBoxShow();
		}
	}//end func

	//发送授权码 AJAX
	function sendCode(){
		var code = $("#authCode").val();
		if (code != "") {

		    loop.data.getlist('code', 1, { code: code, isuse: 0 }, function (list) {
		        if (list.length > 0) {
		            //loop.data.set('code', list[0].ID, { isuse: 1 });
		            authBox.hide();
		            choseBoxShow();
		        }
		        else {
		            icom.alert("授权码不正确或已被使用")
		        }
		    })
		} 
		else icom.alert("授权码不能为空!");
	}//end func

	//选择模板页面显示
	function choseBoxShow(){
		if(first){
			first = false;
			showTipsDialog(0);
		}	
		icom.fadeIn(choseBox);
		icom.fadeIn(controlBox);
	}//end func

	//显示提示
	function showTipsDialog(i){
		$("#tips img")[0].src = "images/public/step"+i+".png";
		var t = setTimeout(function(){
			icom.fadeOut($("#tips"));
		},4000);
		icom.popOn($("#tips"),{fade:500,onClose:function(){
			clearTimeout(t);
		}});
	}//end func

	//选择模板
	function choseTemplet(){
		itemplet = $(this).data("val");
		$(".opt").removeClass("active");
		$(this).addClass("active");
	}//end func

	//确认选择模板
	function confirmTem(){
		if(itemplet == ""){
			icom.alert("请选择您的模板");
		}
		else{
			$("#next").hide();
			if($("."+itemplet+" .c-shell").hasClass('up')) {
				nowStep = 4;
				$("#view").show();
			}
			choseBox.hide();
			controlFlag = true;
			$("#templet").removeClass("active");
			icom.fadeIn($("."+itemplet),500,function(){
				if(itemplet == "japanR" || itemplet == "japanC"){
					$("#color img").eq(0)[0].src = "images/japan/color1.png";
					$("#color img").eq(1)[0].src = "images/japan/color2.png";
				}
				else{
					$("#color img").eq(0)[0].src = "images/france/color1.png";
					$("#color img").eq(1)[0].src = "images/france/color2.png";
				}
				nowStep++;
				if(nowStep == 1) showTipsDialog(nowStep);
			});
		}
	}//end func

	//显示色调板
	function toneShow(){
		var that = $(this);
		if(!that.hasClass("active") && controlFlag && (nowStep == 2 || nowStep > 3)){
			that.addClass("active");
			icom.fadeIn($("#color"),200,function(){
				controlFlag = false;
			});
		}
		else if(that.hasClass("active") && (nowStep == 2 || nowStep > 3)){
			that.removeClass("active");
			icom.fadeOut($("#color"),200,function(){
				controlFlag = true;
			});
		}
	}//end func

	//显示贴纸板
	function stickerShow(){
		var that = $(this);
		if(!that.hasClass("active") && controlFlag && nowStep >= 3){
			that.addClass("active");
			icom.fadeIn($("#stickers"),200,function(){
				controlFlag = false;
				myScroll.refresh();
			});
		}
		else if(that.hasClass("active") && nowStep >= 3){
			that.removeClass("active");
			icom.fadeOut($("#stickers"),200,function(){
				controlFlag = true;
			});
		}
	}//end func

	//切换颜色
	function switchColor(){
		var c = $(this).data("val");
		if(itemplet == "franceR" || itemplet == "franceC"){
			$("."+itemplet+" .uploadBtn").removeClass("uploadBtn1 uploadBtn2").addClass("uploadBtn"+c);
		}
		$("."+itemplet+" .shellBox").removeClass("shellBox1 shellBox2").addClass("shellBox"+c);
		$("."+itemplet+" .cont").removeClass("bg1 bg2").addClass("bg"+c);
		$("."+itemplet+" .pattern").removeClass("pattern1 pattern2").addClass("pattern"+c);
	}//end func
	
	//----------------------------------------页面监测代码----------------------------------------
	function monitor_handler(){
//		imonitor.add({obj:$('a.btnTest'),action:'touchstart',index:'',category:'',label:'测试按钮'});
	}//end func
	
});//end ready
