//2016.11.25
var iaudio=importAudio();

function importAudio(){
	var audio={};
	
	audio.on=function(list,options){
		var _this=this;
		if(list.length>0){
			this.soundList={};
			this.soundMax=0;
			this.soundLoaded=0;
			this.webAudio=0;
			if(options){
				this.onProgress=options.onProgress;
				this.onComplete=options.onComplete;
				this.webAudio=options.webAudio||0;	
			}//end if
			console.log(this.webAudio?'web audio mode':'local audio mode');
			for(var i=0; i<list.length; i++){
				var defaults = {src:'',volume:1,loop:0,autoPlay:0,continuePlay:0,currentTime:0};
				var opts = $.extend(defaults,list[i]);
				if(opts.src!=''){
					var str1=opts.src.split('/');
					var name=str1[str1.length-1].split('.')[0];
					var option={
						src:opts.src,
						volume:opts.volume,
						loop:opts.loop,
						autoPlay:opts.autoPlay,
						continuePlay:opts.continuePlay,
						currentTime:opts.currentTime,
						onListLoaded:this.onListLoaded,
						onLoaded:opts.onLoaded,
						onEnded:opts.onEnded,
						onPlay:opts.onPlay,
						onPause:opts.onPause,
						onTimeupdate:opts.onTimeupdate
					};
					if(this.webAudio) this.soundList[name]=new webAudio(option);
					else this.soundList[name]=new localAudio(option);
				}//edn if
			}//end for
			this.soundMax=Object.keys(this.soundList).length;
			console.log('sound length:'+this.soundMax);
			return this.soundList;
		}//edn if
		
	}//end func
	
	audio.onListLoaded=function(){
		var _this=audio;
		_this.soundLoaded++;
		if(_this.onProgress) _this.onProgress(_this.soundLoaded/_this.soundMax);
		if(_this.soundLoaded==_this.soundMax){
			console.log(_this.soundLoaded+' sounds load complete');
			if(_this.onComplete) _this.onComplete();
		}//end if
	}//end func
	
	function localAudio(opts){
		var _this=this;
	    this.src=opts.src;
	    this.volume=opts.volume;
	    this.loop=opts.loop;
	    this.autoPlay=opts.autoPlay;
	    this.continuePlay=opts.continuePlay;
	    this.currentTime =opts.currentTime;
	    this.startTime = 0;
	    this.onListLoaded=opts.onListLoaded;
	    this.onLoaded=opts.onLoaded;
	    this.onEnded=opts.onEnded;
	    this.onPlay=opts.onPlay;
	    this.onPause=opts.onPause;
	    this.onTimeupdate=opts.onTimeupdate;
	    this.loaded=0;
	    this.played=0;
	    this.ended=0;
		this.audio=new Audio();
		this.audio.src=this.src;
		this.audio.volume=this.volume;
		this.audio.loop=this.loop;//如果loop设置成true就无法正确获得ended事件
		this.audio.load();
		this.audio.addEventListener('loadeddata',init,false);
		this.audio.addEventListener('ended',onEnded,false);
		if(this.onListLoaded) this.audio.addEventListener('loadeddata',this.onListLoaded,false);
		if(this.onLoaded) this.audio.addEventListener('loadeddata',this.onLoaded,false);
		if(this.onPlay) this.audio.addEventListener('play',this.onPlay,false);
		if(this.onPause) this.audio.addEventListener('pause',this.onPause,false);
		if(this.onTimeupdate) this.audio.addEventListener('timeupdate',this.onTimeupdate,false);
		
		function init(event){
			_this.loaded=1;
			if(_this.autoPlay) _this.play(); 
		}//end func
		
		function onEnded(event){
			_this.ended=1;
			_this.played=0;
			if(_this.onEnded) _this.onEnded();
		}//end func
		
	}//end func
	
	localAudio.prototype.play=function(){
		if(!this.played && this.loaded){
			console.log(get_src(this.src)+' play');
			this.played=1;
			this.ended=0;
			this.audio.volume=this.volume;
			this.audio.currentTime=this.continuePlay?this.currentTime:0;
			this.audio.play();
		}//edn if
	}//end func
	
	localAudio.prototype.pause=function(){
	    if(this.played && this.loaded){
	    	console.log(get_src(this.src)+' pause');
	    	this.played=0;
	    	this.currentTime = this.audio.currentTime;
	    	this.audio.pause();
		}//edn if
	}//end func
	
	function webAudio(opts){
		this.context=new window.webkitAudioContext(); /* 创建一个 AudioContext */
	    this.buffer=null;
	    this.source=null;
	    this.src=opts.src;
	    this.volume=opts.volume;
	    this.loop=opts.loop;
	    this.autoPlay=opts.autoPlay;
	    this.continuePlay=opts.continuePlay;
	    this.currentTime =opts.currentTime;
	    this.startTime = 0;
	    this.onListLoaded=opts.onListLoaded;
	    this.onLoaded=opts.onLoaded;
	    this.onEnded=opts.onEnded;
	    this.onPlay=opts.onPlay;
	    this.onPause=opts.onPause;
	    this.onTimeupdate=opts.onTimeupdate;
	    this.loaded=0;
	    this.played=0;
	    this.ended=0;
	    this.load();
	}//end func
	
	webAudio.prototype.load=function(){
		var _this=this;
	    var xhr = new XMLHttpRequest(); /*一个新的 XHR 对象 */
	    xhr.open('GET', this.src, true); /* 通过 GET 请连接到 .mp3 */
	    xhr.responseType = 'arraybuffer'; /* 设置响应类型为字节流 arraybuffer */
	    xhr.onload = function(e) {
			console.log(get_src(_this.src)+' loaded');
			_this.loaded=1;
			if(_this.onListLoaded) _this.onListLoaded();
			if(_this.onLoaded) _this.onLoaded(_this);
	        init(this.response);
	    };
	    xhr.send();
	    
	    function init(arrayBuffer){
			_this.context.decodeAudioData(arrayBuffer, function(buffer) {
				_this.buffer = buffer;  /* 将 buffer 传入解码 AudioBuffer. */
				if(_this.autoPlay) _this.play();
		    }, function(e) {
		        console.log('Error decoding file', e);
		    });
	    }//edn func
	    
	}//edn prototype
	
	webAudio.prototype.play=function(){
		var _this=this;
		if(!this.played && this.loaded){
			console.log(get_src(this.src)+' play');
			this.played=1;
			this.ended=0;
			this.source = this.context.createBufferSource(); 
		    this.source.buffer = this.buffer;
		    this.source.loop = this.loop;
		    this.source.connect(this.context.destination); /*连接 AudioBufferSourceNode 到 AudioContext */
		    this.source.start(0,this.continuePlay?this.currentTime % this.buffer.duration:0); 
		    this.startTime = this.context.currentTime;
		    this.source.onended=function(){
		    	if(_this.played){
		    		console.log(get_src(_this.src)+' ended');
		    		_this.played=0;
		    		_this.ended=1;
		    		if(_this.onEnded) _this.onEnded(_this);
		    		if(_this.onTimeupdate) clearInterval(_this.timeupdate);
		    	}//edn if
		    };
		    if(this.onPlay) this.onPlay(this);
		    if(this.onTimeupdate){
		    	clearInterval(this.timeupdate);
		    	this.timeupdate=setInterval(this.onTimeupdate,100,this);
		    }//edn of
		}//edn if
	}//end prototype
	
	webAudio.prototype.pause=function(){
	    if(this.played && this.loaded && this.source){
	    	console.log(get_src(this.src)+' pause');
	    	this.played=0;
			this.source.stop(0);
	    	this.currentTime += this.context.currentTime - this.startTime;
	    	if(this.onPause) this.onPause(_this);
	    	if(this.onTimeupdate) clearInterval(this.timeupdate);
		}//edn if
	}//end prototype
	
	audio.bgm=function(options){
		var defaults = {src:'',btn:$('a.bgmBtn'),playClassName:'bgmPlay',stopClassName:'bgmStop',webAudio:true};
		var opts = $.extend(defaults,options);
		console.log(opts.webAudio?'bgm is at web audio mode':'bgm is at local audio mode');
		if(opts.webAudio) var bgm=new webAudioBgm(opts);
		else var bgm=new localAudioBgm(opts);
		return bgm;
	}//end func
	
	function localAudioBgm(opts){
		var _this=this;
		this.src=opts.src;
	    this.onLoaded=opts.onLoaded;
	    this.loaded=0;
	    this.played=0;
	    this.bgmPlay=sessionStorage.bgmPlay;
		this.bgmPlay=this.bgmPlay||1;
		this.bgmPlay=parseInt(this.bgmPlay);
		console.log('bgmPlay:'+this.bgmPlay);
		this.bgmTime=sessionStorage.bgmTime;
		this.bgmTime=this.bgmTime||0;
		this.bgmTime=Number(this.bgmTime);
		console.log('bgmTime:'+this.bgmTime);
		this.currentTime = this.bgmTime;
		this.btn=opts.btn;
		this.playClassName=opts.playClassName;
		this.stopClassName=opts.stopClassName;
		this.audio=new Audio();
		this.audio.src=this.src;
		this.audio.loop=true;
		this.audio.load();
		this.audio.addEventListener('loadeddata',init,false);
		if(this.onLoaded) this.audio.addEventListener('loadeddata',this.onLoaded,false);
		
		function init(event){
			_this.loaded=1;
			if(_this.bgmPlay) _this.play();
			else _this.pause();
		}//end func
		
	}//end func
	
	localAudioBgm.prototype.play=function(e){
		var _this=e?e.data.target:this;
		if(!_this.played && _this.loaded){
			_this.played=1;
			_this.audio.currentTime=_this.currentTime;
			_this.audio.play();
			_this.bgmPlay=1;
			if(_this.btn.length>0) _this.btn.removeClass(_this.stopClassName).addClass(_this.playClassName).one('click',{target:_this},_this.pause);
		}//edn if
	}//end func
	
	localAudioBgm.prototype.pause=function(e){
		var _this=e?e.data.target:this;
	    if(_this.played && _this.loaded){
	    	_this.played=0;
	    	_this.currentTime = _this.audio.currentTime;
	    	_this.audio.pause();
	    	_this.bgmPlay=0;
		}//edn if
		if(_this.btn.length>0) _this.btn.removeClass(_this.playClassName).addClass(_this.stopClassName).one('click',{target:_this},_this.play);
	}//end func
	
	function webAudioBgm(opts){
		this.context=new window.webkitAudioContext();
	    this.buffer=null;
	    this.source=null;
	    this.src=opts.src;
	    this.startTime = 0;
	    this.onLoaded=opts.onLoaded;
	    this.bgmPlay=sessionStorage.bgmPlay;
		this.bgmPlay=this.bgmPlay||1;
		this.bgmPlay=parseInt(this.bgmPlay);
		console.log('bgmPlay:'+this.bgmPlay);
		this.bgmTime=sessionStorage.bgmTime;
		this.bgmTime=this.bgmTime||0;
		this.bgmTime=Number(this.bgmTime);
		console.log('bgmTime:'+this.bgmTime);
		this.currentTime = this.bgmTime;
		this.btn=opts.btn;
		this.playClassName=opts.playClassName;
		this.stopClassName=opts.stopClassName;
	    this.load();
	}//end func
	
	webAudioBgm.prototype.load=function(){
		var _this=this;
	    var xhr = new XMLHttpRequest(); //通过XHR下载音频文件
	    xhr.open('GET', _this.src, true);
	    xhr.responseType = 'arraybuffer';
	    xhr.onload = function(e) { //下载完成
	    	if(_this.onLoaded) _this.onLoaded();
	        init(this.response);
	    };
	    xhr.send();
	    
	    function init(arrayBuffer){
			_this.context.decodeAudioData(arrayBuffer, function(buffer) {
				_this.buffer = buffer;
				if(_this.bgmPlay) _this.play();
				else _this.pause();
		    }, function(e) {
		        console.log('Error decoding file', e);
		    });
	    }//edn func
	}//edn prototype
	
	webAudioBgm.prototype.play=function(e){
		var _this=e?e.data.target:this;
		_this.bgmPlay=1;
		_this.source = _this.context.createBufferSource();
	    _this.source.buffer = _this.buffer;
	    _this.source.loop = true;
	    _this.source.connect(_this.context.destination);
	    _this.source.start(0,_this.currentTime % _this.buffer.duration);
	    _this.startTime = _this.context.currentTime;
		if(_this.btn.length>0) _this.btn.removeClass(_this.stopClassName).addClass(_this.playClassName).one('click',{target:_this},_this.pause);
	}//end prototype
	
	webAudioBgm.prototype.pause=function(e){
		var _this=e?e.data.target:this;
	    if(_this.source){
			_this.bgmPlay=0;
			_this.source.stop(0);
	    	_this.currentTime += _this.context.currentTime - _this.startTime;
	    	_this.bgmTime=_this.currentTime;
		}//edn if
		if(_this.btn.length>0) _this.btn.removeClass(_this.playClassName).addClass(_this.stopClassName).one('click',{target:_this},_this.play);
	}//end prototype
	
	
	function get_src(str){
		var ary=str.split('/');
		return ary[ary.length-1];
	}//end func
	
	return audio;
}//end import

var ibgm=importBgm();

function importBgm(){
	var bgm={};
	var defaults = {webAudio:0,src:''};
	var opts={};
	
	bgm.init=function(options){
		opts = $.extend(defaults,options);
		if(opts.src!=''){
			ibase.creatNode('a',null,'bgmBtn',null);
			bgm.audio=iaudio.bgm({src:opts.src,onLoaded:opts.onLoaded,webAudio:opts.webAudio});
			this.btn=$('a.bgmBtn');
		}//edn if
	}//edn func
	
	bgm.href=function(url){
		if(url && url!=''){
			sessionStorage.bgmPlay=ibgm.audio.bgmPlay;
			var bgmTime=opts.webAudio?ibgm.audio.currentTime+ibgm.audio.context.currentTime-ibgm.audio.startTime:ibgm.audio.audio.currentTime;
			sessionStorage.bgmTime=ibgm.audio.bgmPlay?bgmTime:ibgm.audio.currentTime;
			location.href=url;
		}//edn func
	}//edn func
	
	bgm.pause=function(){
		bgm.audio.pause();
	}//edn func
	
	bgm.play=function(){
		bgm.audio.play();
	}//edn func
	
	bgm.hide=function(pause){
		pause=pause||0;
		if(pause) this.pause();
		this.btn.hide();
	}//edn func
	
	bgm.show=function(resume){
		resume=resume||0;
		if(resume) this.play();
		this.btn.show();
	}//edn func
	
	return bgm;
	
}//edn func