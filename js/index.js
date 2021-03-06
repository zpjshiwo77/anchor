$(document).ready(function(){
	
	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox=$('aside.loadBox');
	var articleBox=$('article');
	var windowScale = window.innerWidth / 750;
	var code;

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
	var nowAdorn = 0;
	var iAscale = 1;

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
			loader.addImage('images/france/bgCol'+i+'.png');
			loader.addImage('images/france/bgRow'+i+'.png');
			loader.addImage('images/france/color'+i+'.png');
			loader.addImage('images/france/upbtn'+i+'.png');

			loader.addImage('images/japan/bgCol'+i+'.png');
			loader.addImage('images/japan/bgRow'+i+'.png');
			loader.addImage('images/japan/color'+i+'.png');
			
		};

		for (var i = 0; i < 5; i++) {
			loader.addImage('images/public/step'+i+'.png');
		};

		loader.addImage('images/france/col.jpg');
		loader.addImage('images/france/row.jpg');
		loader.addImage('images/france/bgCol.jpg');
		loader.addImage('images/france/bgRow.jpg');

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
		loader.addImage('images/public/logoR.jpg');
		loader.addImage('images/public/logoB.jpg');
		loader.addImage('images/public/share.png');
		loader.addImage('images/public/stickersBox.png');
		loader.addImage('images/public/tips.png');

		loader.addImage('images/sticker/c.png');
		for (var i = 1; i <= 22; i++) {
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
		$(document).on('touchmove', noScroll);
		$("body").on('touchmove', noScroll);
		$("html").on('touchmove', noScroll);
		$("section").on('touchmove', noScroll);
		// $("section").on('touchmove',".adorn" noScroll);
		// choseBoxShow();
		resetSize();
		cameraInit();
		closeSelf_handler();
	}//end func

	//重置大小
	function resetSize(){
		$(".mask").each(function(){
			var that = $(this);
			var h = that.height();
			var w = that.width();
			that.height(h);
			that.width(w);
		});
		$(".code").each(resetSizePt);
		$(".logo").each(resetSizePt);
		$(".titleA").each(resetSizePtFs);
		$(".titleB").each(resetSizePtFs);
	}//end func

	//重置大小和定位和字号
	function resetSizePtFs(){
		var that = $(this);
		var h = that.height();
		var w = that.width();
		var t = that.css("top");
		var l = that.css("left");
		var fs = that.css("font-size");
		that.height(h);
		that.width(w);
		that.css({
			top: t,
			left: l,
			"font-size":fs
		});
		console.log(fs);
	}//end func

	//重置大小和定位
	function resetSizePt(){
		var that = $(this);
		var h = that.height();
		var w = that.width();
		var t = that.css("top");
		var l = that.css("left");
		that.height(h);
		that.width(w);
		that.css({
			top: t,
			left: l
		});
	}//end func

	//禁止滑动
	function noScroll(e) {
		e.preventDefault();
	} //end func

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
		$(".titleA").blur(showControl);
		$(".titleB").blur(showControl);
		$("body").on('pinchscale',AdornScale);
	}//end func
	
	//标签放大
	function AdornScale(e,scaleOffset){
		if($("#sticker").hasClass('active')){
			iAscale += scaleOffset * 5;
			iAscale = iAscale < 1 ? 1 : iAscale;
			iAscale = iAscale > 25 ? 25 : iAscale;
			$("#s"+nowAdorn).css({scale:iAscale});
			// $("."+itemplet+" .titleA").val(scaleOffset);
			// $("."+itemplet+" .titleB").val(scale);			
		}
	}//end func

	//显示控制面板
	function showControl(){
		var a = $("."+itemplet+" .titleA").val();
		var b = $("."+itemplet+" .titleB").val();
		if(a != "" && b!= "" && !$(".control").hasClass("show")) {
			icom.fadeIn($(".control"));
			$(".control").addClass("show");
		}
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
//		else if(!logo) icom.alert("请上传logo");
		else if(!main) icom.alert("请更换一张背景图片");
//		else if(!code) icom.alert("请上传一张二维码图片");
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

		if(itemplet == "japanR" || itemplet == "franceR"){
			$("#preview img.previewImg").css({width:7.5+'rem',height:'4.5rem',top:'50%',left:0,marginTop:-2.25+'rem'});
			$("#preview .tips").css("top","7.5rem");
		}
		else{
			$("#preview img.previewImg").css({width:6+'rem',height:'9.7rem',top:0.5+'rem',left:0.75+'rem',marginTop:0});
			$("#preview .tips").css("top","10rem");
			
		}

		var logo = $("."+itemplet+" .l-shell").hasClass("up");
		var code = $("."+itemplet+" .c-shell").hasClass("up");
		if(!logo) $("."+itemplet+" .logo").hide();
		if(!code) $("."+itemplet+" .code").hide();
		closeSelf.hide();
		icamera.makeImg($("."+itemplet+" .cont"),function(img){
			icom.fadeOut(loadBox);
			$('.franceC .logo').add($('.franceC .code')).show();
			if(!logo) $("."+itemplet+" .logo").show();
			if(!code) $("."+itemplet+" .code").show();
			closeSelf.show();
			$("#preview .previewImg")[0].src = img;
			icom.popOn($("#preview"),{fade:500,onClose:showTips});
			sendInfo(img);
			resetShare(img);
//			if(!$("#preview .share").hasClass('ishow')){
//				setTimeout(function(){
//					icom.fadeIn($("#preview .share"));
//					$("#preview .share").addClass('ishow');
//				},3000);
//			}
		});
		setTimeout(function(){
			nowStep++;
			if(nowStep == 4) showTipsDialog(nowStep);
		},200);
	}//end func

	//重置分享
	function resetShare(img){
		var title = $("."+itemplet+" .titleA").val();
		var word = $("."+itemplet+" .titleB").val();
		var url="http://anchorgifting.anchorchina.cn/" + "share.html?i=" + encodeURIComponent(img) +'&title='+encodeURIComponent(title)+'&word='+encodeURIComponent(word);
		console.log(url);
		ishare.reset({link:url,image:img,title:title,friend:word,timeline:title});
	}//end func

	//发送信息 AJAX
	function sendInfo(img){
	    loop.user.add({ remarks: img, t1: code })
	}//end func

	//显示提示
	function showTips(){
		nowStep++;
		var titleA = $("."+itemplet+" .titleA");
		var titleB = $("."+itemplet+" .titleB");
		var adornC = $(".adorn .remove");
		var upload = $("."+itemplet+" .uploadBtn");
		if(itemplet == "japanC" || itemplet == "japanR"){
			titleA.css("border-color","#626262");
			titleB.css("border-color","#626262");
		}
		else if((itemplet == "franceC" || itemplet == "franceR") && titleA.hasClass("c1")){
			titleA.css("border-color","#d63555");
			titleB.css("border-color","#d63555");
		}
		else if((itemplet == "franceC" || itemplet == "franceR") && titleA.hasClass("c2")){
			titleA.css("border-color","#1486c9");
			titleB.css("border-color","#1486c9");
		}
		
		adornC.show();
		upload.show();
//		upload.removeClass('uploadBtnSide')
//		$('.franceC .cont').add($('.franceR .cont')).add($('.japanC .cont')).add($('.japanR .cont')).removeClass('black');
		
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
		e.preventDefault();
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
		var sp = $(this).attr("data-val");
		var id = $(this).attr("data-id");
		nowAdorn++;
		iAscale = 1;
		if(sp == "sp"){
			var cont = '<div class="adorn adornSp" id="s'+nowAdorn+'"> <img src="images/sticker/sp.png"> <input type="tel" value="99" maxlength="4"> <div class="remove"></div> </div>'
		}
		else{
			var cont = '<div class="adorn" id="s'+nowAdorn+'"> <img src="'+img+'"> <div class="remove"></div> </div>';
		}
		
		$("."+itemplet+" .cont").append(cont);

		var that = $("#s"+nowAdorn);
		var h = that.height();
		var w = that.width();
		var t = that.css("top");
		var l = that.css("left");
		that.height(h);
		that.width(w);
		that.css({
			top:t,
			left:l,
			x: 0,
			y: 0
		});
	}//end func

	//返回选择模板
	function backToChose(){
		if(!$(this).hasClass("active") && nowStep > 3){
			nowStep = 0;
			controlFlag = false;
			$("#templet").addClass("active");
			$("#view").hide();
			$("#next").show();
			$("."+itemplet).hide();
			$("."+itemplet+" .uploadBtn").show();
			choseBoxShow();
			toneHide();
			stickerHide();
		}
	}//end func

	//发送授权码 AJAX
	function sendCode(){
		code = $("#authCode").val();
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
		},2000);
		icom.popOn($("#tips"),{fade:500,onClose:function(){
			clearTimeout(t);
		}});
	}//end func

	//选择模板
	function choseTemplet(){
		itemplet = $(this).data("val");
		$(".opt").removeClass("active");
		$(this).addClass("active");
		$('.franceC .cont').removeClass('black');
		$('.franceR .cont').removeClass('black');
		$('.japanC .cont').removeClass('black');
		$('.japanR .cont').removeClass('black');
	}//end func

	//确认选择模板
	function confirmTem(){
		if(itemplet == ""){
			icom.alert("请选择您的模板");
		}
		else{
//			$("#next").hide();
			if($("."+itemplet+" .c-shell").hasClass('up')) {
				nowStep = 4;
				$("#view").show();
				$(".control").show();
			}
			else{
//				$(".control").hide().removeClass("show");
			}//edn else
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
			closeSelf.show();
			closeSelf.parent().show();
		}
	}//end func

	//显示色调板
	function toneShow(){
		var that = $(this);
		if(!that.hasClass("active") && controlFlag && (nowStep == 2 || nowStep > 3)){
			that.addClass("active");
			controlFlag = false;
			icom.fadeIn($("#color"),200,function(){
				controlFlag = true;
			});
			stickerHide();
		}
		else if(that.hasClass("active") && controlFlag && (nowStep == 2 || nowStep > 3)){
			toneHide();
		}
	}//end func

	//隐藏色调板
	function toneHide(){
		controlFlag = false;
		$("#tone").removeClass("active");
		icom.fadeOut($("#color"),200,function(){
			controlFlag = true;
		});
	}//end func

	//显示贴纸板
	function stickerShow(){
		var that = $(this);
		if(!that.hasClass("active") && controlFlag && nowStep >= 3){
			that.addClass("active");
			controlFlag = false;
			icom.fadeIn($("#stickers"),200,function(){
				controlFlag = true;
				myScroll.refresh();
			});
			toneHide();
			$("."+itemplet+" .shellBox").addClass('noPointer');
		}
		else if(that.hasClass("active") && controlFlag && nowStep >= 3){
			stickerHide();
		}
	}//end func

	//隐藏贴纸板
	function stickerHide(){
		$("#sticker").removeClass("active");
		controlFlag = false;
		icom.fadeOut($("#stickers"),200,function(){
			controlFlag = true;
		});
		$("."+itemplet+" .shellBox").removeClass('noPointer');
	}//end func

	//切换颜色
	function switchColor(){
		var c = $(this).data("val");
		if(itemplet == "franceR" || itemplet == "franceC"){
			$("."+itemplet+" .uploadBtn").removeClass("uploadBtn1 uploadBtn2").addClass("uploadBtn"+c);
			$("."+itemplet+" .mask").removeClass("mask1 mask2").addClass("mask"+c);
			$("."+itemplet+" .titleA").removeClass("c1 c2").addClass("c"+c);
			$("."+itemplet+" .titleB").removeClass("c1 c2").addClass("c"+c);
		}
		else if(itemplet == "japanR" || itemplet == "japanC"){
			$("."+itemplet+" .mask").removeClass("mask1 mask2").addClass("mask"+c);
		}
	}//end func
	
	//确定弹窗
	var confirmBox=$('aside.confirm');
	function confirm_handler(text,callback){
		text=text||'确定删除？'
		confirmBox.show();
		confirmBox.find('.text').html(text);
		var confirm=confirmBox.find('a.confirm');
		var cancel=confirmBox.find('a.cancel');
		cancel.off().one('click',function(e){
			confirmBox.hide();
		});
		confirm.off().one('click',function(e){
			confirmBox.hide();
			if(callback) callback();
		});
	}//edn func
	
	//关闭按钮
	var closeSelf=$('.closeSelf');
	
	function closeSelf_handler(){
		closeSelf.off().on('click',closeSelf_click);
	}//edn func
	
	function closeSelf_click(e){
		var parent=$(this).parent();
		confirm_handler(null,function(){
			parent.hide();
		});
	}//edn func
	
	//----------------------------------------页面监测代码----------------------------------------
	function monitor_handler(){
//		imonitor.add({obj:$('a.btnTest'),action:'touchstart',index:'',category:'',label:'测试按钮'});
	}//end func
	
});//end ready
