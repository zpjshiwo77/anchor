//2017.5.26
var icom = importCom();

function importCom() {
	var com = {};

	com.init = function(callback) {
		if(os.android) {
			var input = $('input,textarea,[contenteditable="true"]');
			if(input.length > 0) input.on('focus', input_focus).on('blur', input_blur);
		} //edn if
		function input_focus(e) {
			ibase.keyboard = true;
		} //edn if
		function input_blur(e) {
			ibase.keyboard = false;
		} //edn if
		if(ibase.dir == 'portrait') {
			lock_dected();
			function lock_dected() {
				if(ibase.lock) requestAnimationFrame(lock_dected);
				else if(callback) callback();
			} //edn func
		} //edn if
		else {
			var article = $('article');
			var container = article.children('.container');
			var interface = article.children('.interface');
			html_resize(ibase.getOrient(true));
			$(window).on('orientationchange', window_orientation);
			if(callback) callback();
		} //end else

		function window_orientation(e) {
			setTimeout(function() {
				html_resize(ibase.getOrient());
			}, 200);
		} //edn func

		function html_resize(dir) {
			if(!ibase.keyboard) {
				if(dir == 'portrait') {
					console.log('screen portrait');
					var size = imath.autoSize([ibase.landscapeHeight, ibase.landscapeWidth], [window.innerWidth, window.innerHeight], ibase.landscapeScale);
					var scale = size[0] / ibase.landscapeHeight;
					console.log('window size:' + window.innerHeight + '/' + window.innerWidth);
					console.log('auto scale:' + scale);
					article.css({
						width: ibase.landscapeWidth,
						height: ibase.landscapeHeight,
						rotate: 90
					});
					interface.css({
						scale: scale,
						x: 0,
						y: -ibase.landscapeHeight,
						width: window.innerHeight / scale,
						height: window.innerWidth / scale
					});
					if(ibase.landscapeScale == 'cover' || ibase.landscapeScale == 'contain' || ibase.landscapeScale == 'width' || ibase.landscapeScale == 'height') {
						container.css({
							scale: scale,
							x: (window.innerHeight / scale - ibase.landscapeWidth) * 0.5,
							y: -ibase.landscapeHeight + (window.innerWidth / scale - ibase.landscapeHeight) * 0.5 + (os.iphone6Plus ? 4 : 0)
						});
					} //edn if
					else {
						var scales = [window.innerWidth / ibase.landscapeHeight, window.innerHeight / ibase.landscapeWidth];
						console.log('auto scales:' + scales);
						container.css({
							scaleX: scales[0],
							scaleY: scales[1],
							x: 0,
							y: -ibase.landscapeHeight
						});
					} //end else
				} //end if
				else {
					console.log('screen landscape');
					var size = imath.autoSize([ibase.landscapeWidth, ibase.landscapeHeight], [window.innerWidth, window.innerHeight], ibase.landscapeScale);
					var scale = size[0] / ibase.landscapeWidth;
					console.log('window size:' + window.innerWidth + '/' + window.innerHeight);
					console.log('auto scale:' + scale);
					article.css({
						width: ibase.landscapeWidth,
						height: ibase.landscapeHeight,
						rotate: 0
					});
					interface.css({
						scale: scale,
						x: 0,
						y: 0,
						width: window.innerWidth / scale,
						height: window.innerHeight / scale
					});
					if(ibase.landscapeScale == 'cover' || ibase.landscapeScale == 'contain' || ibase.landscapeScale == 'width' || ibase.landscapeScale == 'height') {
						container.css({
							scale: scale,
							x: (window.innerWidth / scale - ibase.landscapeWidth) * 0.5,
							y: (window.innerHeight / scale - ibase.landscapeHeight) * 0.5
						});
					} //edn if
					else {
						var scales = [window.innerWidth / ibase.landscapeWidth, window.innerHeight / ibase.landscapeHeight];
						console.log('auto scales:' + scales);
						container.css({
							scaleX: scales[0],
							scaleY: scales[1],
							x: 0,
							y: 0
						});
					} //end else
				} //end else
			} //edn if
		} //edn func

	} //edn func

	com.screenScrollEnable = function() {
		$(document).off('touchmove', noScroll);
	} //end func

	com.screenScrollUnable = function() {
		$(document).on('touchmove', noScroll);
	} //end func

	function noScroll(e) {
		e.preventDefault();
	} //end func

	//取代jquery的fadeIn
	com.fadeIn = function(obj, dur, callback) {
		if(obj) {
			dur = dur || 500;
			obj.show().css({
				opacity: 0
			}).transition({
				opacity: 1
			}, dur, function() {
				if(callback) callback($(this));
			});
		} //end if
	} //end func

	//取代jquery的fadeOut
	com.fadeOut = function(obj, dur, callback) {
		if(obj) {
			dur = dur || 500;
			obj.transition({
				opacity: 0
			}, dur, function() {
				$(this).hide().css({
					opacity: 1
				});
				if(callback) callback($(this));
			});
		} //end if
	} //end func

	com.popOn = function(obj, options) {
		if(obj && obj.length > 0) {
			var defaults = {
				closeEvent: 'touchend',
				closeType: 'button',
				closeBtn: obj.find('a.close'),
				remove: false
			};
			var opts = $.extend(defaults, options);
			if(opts.text) obj.find('.text').html(opts.text);
			if(opts.fade) com.fadeIn(obj, opts.fade);
			else obj.show();
			if(opts.closeBtn.length > 0 && opts.closeType == 'button') opts.closeBtn.one(opts.closeEvent, obj_close);
			else obj.one(opts.closeEvent, obj_close);
			obj.on('close', obj_close);
		} //end if
		function obj_close(e) {
			if(opts.closeBtn.length > 0 && opts.closeType == 'button') opts.closeBtn.off(opts.closeEvent, obj_close);
			else obj.off(opts.closeEvent, obj_close);
			if(opts.fade) com.fadeOut(obj, opts.fade, function() {
				if(opts.remove) obj.remove();
			});
			else if(opts.remove) obj.remove();
			else obj.hide();
			obj.off('close', obj_close);
			if(opts.onClose) opts.onClose(obj);
		} //end func
	} //end func

	com.popOff = function(obj) {
		if(obj && obj.length > 0) obj.trigger('close');
	} //end func

	//取代系统alert
	com.alert = function(text, callback) {
		if(text && text != '') {
			var box = $('<aside class="alertBox"><div><p class="text"></p><p class="btn"><a href="javascript:;" class="close">确定</a></p></div></aside>').appendTo(ibase.dir == 'landscape' ? 'article>.interface' : 'body');
			com.popOn(box, {
				text: text,
				onClose: callback,
				remove: true,
				closeEvent: 'click'
			});
		} //end if
	} //end func

	//获得http url参数
	com.getQueryString = function(name) {
		if(name && name != '') {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return decodeURIComponent(r[2]);
			return null;
		} //end if
		else return null;
	} //end func

	//载入图片函数
	com.imageLoad = function(src, callback) {
		if(src && src != '') {
			var loader = new PxLoader();
			if($.type(src) === "string" && src != '') loader.addImage(src);
			else if($.type(src) === "array" && src.length > 0) {
				for(var i = 0; i < src.length; i++) {
					loader.addImage(src[i]);
				} //end for
			} //end else
			loader.addCompletionListener(function() {
				console.log('images load complete');
				loader = null;
				if(callback) callback(src);
			});
			loader.start();
		} //end if
	} //end func	

	//打印object数据
	com.objectPrint = function(data) {
		if(data) {
			console.log("-----------------------------------------------------------------------------");
			var info = "";
			for(var i in data) info += i + ":" + data[i] + "  "
			console.log(info);
			console.log("-----------------------------------------------------------------------------");
		} //end if
	} //end func

	//常用正则
	com.checkStr = function(str, type) {
		if(str && str != '') {
			type = type || 0;
			switch(type) {
				case 0:
					var reg = new RegExp(/^1[3-9]\d{9}$/); //手机号码验证
					break;
				case 1:
					var reg = new RegExp(/^[1-9]\d{5}$/); //邮政编码验证
					break;
				case 2:
					var reg = new RegExp(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/); //匹配EMAIL
					break;
				case 3:
					var reg = new RegExp(/^\d+$/); //是否为0-9的数字
					break;
				case 4:
					var reg = new RegExp(/^[a-zA-Z\u0391-\uFFE5]*[\w\u0391-\uFFE5]*$/); //不能以数字或符号开头
					break;
				case 5:
					var reg = new RegExp(/^\w+$/); //匹配由数字、26个英文字母或者下划线组成的字符串
					break;
				case 6:
					var reg = new RegExp(/^[\u0391-\uFFE5]+$/); //匹配中文
					break;
				case 7:
					var reg = new RegExp(/^[a-zA-Z\u0391-\uFFE5]+$/); //不能包含数字和符号
					break;
			} //end switch
			if(reg.exec($.trim(str))) return true;
			else return false;
		} //end if
		else return false;
	} //end func

	//使用post方法进行php中间件通讯
	com.post = function(url, data, callback) {
		if(url && url != '') post_handler(url, data, callback, 'post');
	} //end func

	//使用get方法进行php中间件通讯
	com.get = function(url, data, callback) {
		if(url && url != '') post_handler(url, data, callback, 'get');
	} //end func

	function post_handler(url, data, callback, action) {
		if(data && $.isPlainObject(data)) data = JSON.stringify(data);
		$.post("./http/httpPost.php", {
			api_url: url,
			post_data: data,
			action: action
		}, function(resp) {
			if(callback) callback(resp);
		}, "json");
	} //edn func

	//安卓键盘压缩页面高度处理
	com.keyboard = function(input, shell, callback) {
		input = input || $('input,textarea,[contenteditable="true"]');
		shell = shell || input.parents('section');
		if(input.length > 0) {
			if(os.ios) {
				input.on('focus', function(e) {
					$(document).one('touchend', ios_keyboard);
				});
			} //end if
			else if(shell.length > 0) {
				var windowHt = $(window).height();
				var ht = shell.height();
				$(window).on('resize', android_keyboard);
			} //edn if
		} //end if

		function ios_keyboard(e) {
			if(e.target != input[0]) input.blur();
		} //edn func

		function android_keyboard(e) {
			if(ibase.dir == 'portrait' && (window.orientation == 0 || window.orientation == 180)) {
				if($(window).height() < windowHt) slide_in();
				else slide_out();
			} //end portrait
			else if(ibase.dir == 'landscape' && (window.orientation == 90 || window.orientation == -90)) {
				if($(window).height() < windowHt) slide_in();
				else slide_out();
			} //edn landscape
		} //edn func

		function slide_in() {
			shell.css({
				height: ht
			});
			if(callback) callback(true);
		} //edn func

		function slide_out() {
			if(callback) callback(false);
		} //edn func

	} //end func

	//物体抖动
	com.shake = function(box, options) {
		if(box && box.length > 0) {
			var defaults = {
				rx: 5,
				ry: 5,
				delay: 33,
				now: 0,
				max: 5,
				restore: true
			};
			var opts = $.extend(defaults, options);
			var x = imath.randomRange(-opts.rx, opts.rx);
			var y = imath.randomRange(-opts.ry, opts.ry);
			box.css({
				x: x,
				y: y
			});
			opts.now++;
			if(opts.now > opts.max) {
				if(opts.restore) box.css({
					x: 0,
					y: 0
				});
				if(opts.onComplete) opts.onComplete();
			} //end if
			else setTimeout(com.shake, opts.delay, box, opts);
		} //end if
	} //end func

	//获取textarea里的回车和空格
	com.textareaGet = function(textarea, row) {
		row = row || 0;
		var str1 = textarea.val();
		if(str1 == '') return '';
		else {
			var str2 = str1.replaceAll("\n", "<br/>");
			return row_cut(str2, row);
		} //end else
	} //edn func

	//输入textarea里的回车和空格
	com.textareaSet = function(textarea, str) {
		if(str == '') textarea.val('');
		else textarea.val(str.replaceAll("<br/>", "\n"));
	} //edn func

	//限制textarea输入文字的行数
	com.textareaLock = function(textarea) {
		if(textarea && textarea.length > 0) {
			var timer;
			var row = parseInt(textarea.attr('rows')) || 0;
			var col = parseInt(textarea.attr('cols')) || 0;
			var max = parseInt(textarea.attr('maxlength')) || 0;
			max = max == 0 ? row * col : max;
			if(row > 0 && col > 0 && max > 0) textarea.one('focus', textarea_focus);
		} //end if

		function textarea_focus(e) {
			timer = com.setInterval(textarea_lock, 15);
			$(this).one('blur', textarea_blur);
		} //edn func

		function textarea_blur(e) {
			com.clearInterval(timer);
			$(this).one('focus', textarea_focus);
			var first = com.textareaGet(textarea, row);
			if(first.indexOf('<br/>') != -1) {
				var str2 = first.split('<br/>');
				var str3 = '';
				for(var i = 0; i < str2.length; i++) {
					str3 += col_break(str2[i], col);
					if(i < str2.length - 1) str3 += '<br/>';
				} //end for
				str3 = row_cut(str3, row);
				var final = str3.replaceAll("<br/>", "\n");
				textarea.val(final);
			} //end if
		} //edn func

		function textarea_lock() {
			var first = com.textareaGet(textarea, row);
			if(first.indexOf('<br/>') == -1) textarea.attr({
				maxlength: max
			});
			else textarea.attr({
				maxlength: max + (first.split('<br/>').length - 1) * 2
			});
		} //edn func
	} //edn func

	function row_cut(str, row) {
		row = row || 0;
		var str2 = str.split('<br/>');
		if(row <= 0 || str2.length <= row) return str;
		else {
			var str3 = '';
			for(var i = 0; i < row; i++) {
				str3 += str2[i];
				if(i < row - 1) str3 += '<br/>';
			} //edn for
			return str3;
		} //end else
	} //end func

	function col_break(str, col) {
		var line = Math.ceil(str.length / col);
		if(line == 1) return str;
		else {
			var str1 = '';
			for(var i = 0; i < line; i++) {
				if(i == 0) str1 += str.substr(0, col) + '<br/>';
				else if(i < line - 1) str1 += str.substr(i * col, col) + '<br/>';
				else str1 += str.substr(i * col);
			} //edn for
			return str1;
		} //end else
	} //end func

	function col_cut(str, col) {
		if(str.length > col) return str.substr(0, col);
		else return str;
	} //end func

	//限制textarea输入文字的行数
	com.textareaUnlock = function(textarea) {
		textarea.off();
	} //edn func

	com.url = function(url, para) {
		var now = -1;
		for(var key in para) {
			now++;
			if(now == 0) url += '?';
			else url += '&';
			url += key + '=' + para[key]
		} //end for
		return url;
	}; //end func

	com.setTimeout = function(callback, frame, type) {
		type = type || 0;
		if(frame > 0 && callback) return setTimer(callback, frame, type, false);
	} //edn func

	com.clearTimeout = function(timer) {
		if(timer && timer.timer) clearTimer(timer);
	} //edn func

	com.setInterval = function(callback, frame, type) {
		type = type || 0;
		if(frame > 0 && callback) return setTimer(callback, frame, type, true);
	} //edn func

	com.clearInterval = function(timer) {
		if(timer && timer.timer) clearTimer(timer);
	} //edn func

	function clearTimer(timer) {
		cancelAnimationFrame(timer.timer);
		timer.now = 0;
		timer.start = new Date().getTime();
		timer.timer = null;
	} //edn func

	function setTimer(callback, frame, type, interval) {
		var timer = {
			now: 0,
			start: new Date().getTime(),
			timer: null
		};
		timer_handler();
		return timer;

		function timer_handler() {
			if(type) timer.now++;
			else timer.now = new Date().getTime() - timer.start;
			var timeup = type ? timer.now == frame : timer.now >= frame;
			if(timeup) {
				timer.now = 0;
				timer.start = new Date().getTime();
				callback();
			} //end if
			if(interval || (!interval && !timeup)) timer.timer = requestAnimationFrame(timer_handler);
		} //end func

	} //edn func

	com.canvas_send = function(canvas, callback, secretkey, type, compress) {
		if(canvas) {
			secretkey = secretkey || 'test';
			type = type || 'jpg';
			compress = compress || 0.8;
			if(type == 'png') var base64 = canvas.toDataURL('image/png');
			else var base64 = canvas.toDataURL('image/jpeg', compress);
			this.base64_send(base64, callback, secretkey);
		} //edn if
	} //end func

	com.base64_send = function(base64, callback, secretkey) {
		if(base64) {
			secretkey = secretkey || 'test';
			$.post('http://tool.be-xx.com/cdn/base64', {
				data: base64,
				key: secretkey
			}, function(resp) {
				if(resp.errcode==0){
					if(callback) callback(resp.result);
				}//edn if
				else{
					console.log('errmsg:'+resp.errmsg);
				}//edn else
			},'json');
		} //edn if
	} //end func
	
	com.base64_get = function(link, callback, secretkey) {
		if(link) {
			secretkey = secretkey || 'test';
			$.post('http://tool.be-xx.com/image/base64', {
				link: link,
				key: secretkey
			}, function(resp) {
				if(callback) callback(resp);
			},'text');
		} //edn if
	} //end func
	
	com.qrcode = function(txt,options) {
		var defaults = {size:200,color:'#000000',bg:'#ffffff',border:0,error:0,logo:false};
		var data = $.extend(defaults, options);
		if(txt && txt!=''){
			var src='http://tool.be-xx.com/image/qrcode?txt='+txt+'&size='+data.size+'&color='+data.color+'&bg='+data.bg+'&border='+data.border+'&error='+data.error+'&logo='+data.logo;
			return src;
		}//edn if
		else return null;
	} //end func
	
	com.barcode = function(txt,options) {
		var defaults = {width:400,height:200,color:'#000000',bg:'#ffffff',pure:true};
		var data = $.extend(defaults, options);
		if(txt && txt!=''){
			var src='http://tool.be-xx.com/image/barcode?txt='+txt+'&width='+data.width+'&height='+data.height+'&color='+data.color+'&bg='+data.bg+'&pure='+data.pure;
			return src;
		}//edn if
		else return null;
	} //end func
	
	return com;

} //end import

String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}