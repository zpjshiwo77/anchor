//2016.6.23
var ishake=importShake();

function importShake(){
	var defaults = {hold:100,max:20,delay:50,stopDelay:500,type:0},opts;
	var $lev=0,$now=0,$last,$lastX,$lastY,$lastZ,$stop;
	var $dirXLast=0,$dirYLast=0,$dirZLast=0;
	var shake={};
	
	shake.on=function(options){
		this.init();
		opts = $.extend(defaults,options);
		window.addEventListener('devicemotion',devicemotion_handler,false);		
	}//end func

	shake.off=function(){
		this.init();
		window.removeEventListener('devicemotion',devicemotion_handler);
	}//end func
	
	shake.init=function(options){
		$lev=0;
		$now=0;
		$last=null;
		$lastX=null;
		$lastY=null;
		$lastZ=null;
		$stop=null;
	}//end func
	
	function devicemotion_handler(event) {
		if($last){
			var curTime = new Date().getTime();
			var diffTime = curTime -$last;
			if (diffTime>opts.delay) {
				$last = curTime;
				// 获取含重力的加速度
				var acceleration = event.accelerationIncludingGravity;
				var disX=acceleration.x-$lastX;
				var disY=acceleration.y-$lastY;
				var disZ=acceleration.z-$lastZ;
				var dirX=disX>0?1:-1;
				var dirY=disY>0?1:-1;
				var dirZ=disZ>0?1:-1;
				var speedX = Math.abs(disX)/diffTime*10000;
				var speedY = Math.abs(disY)/diffTime*10000;
				var speedZ = Math.abs(disZ)/diffTime*10000;
				if ( (dirX!=$dirXLast && speedX>=opts.hold) || (dirY!=$dirYLast && speedY>=opts.hold) || (dirZ!=$dirZLast && speedZ>=opts.hold) ){
					$lev++;
					$now++;
					if(opts.onCount) opts.onCount($now);
					if($now==1 && opts.onStart) opts.onStart();
					else if( (!opts.type && $lev==opts.max) || (opts.type && $now==opts.max)  ){
						if(opts.onComplete) opts.onComplete();
						shake.off();
					}//end if
					clearTimeout($stop);
					$stop=setTimeout(function(){
						if(opts.onStop) opts.onStop();
					},opts.stopDelay);
				}//end if
				else{
					$lev--;
					$lev=$lev<0?0:$lev;
				}//end else 
				$lastX=acceleration.x;
				$lastY=acceleration.y;
				$lastZ=acceleration.z;
				$dirXLast=dirX;
				$dirYLast=dirY;
				$dirZLast=dirZ;
				if(opts.onLevel) opts.onLevel($lev);
			}//end if
		}//end if
		else $last=new Date().getTime();
	}//end event
	
	return shake;
	
}//end import