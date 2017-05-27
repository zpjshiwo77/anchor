//2017.5.2

var _hmt=_hmt||[];
//百度监测贴这里



//ga监测贴这里


var hmsr=icom.getQueryString('hmsr');
var imonitor=importMonitor();


function importMonitor(){
	var monitor={};
	
	monitor.add=function(option){
		if(option){
			var obj=option.obj;
			var category=option.category||'';
			var action=option.action||'touchend';
			var label=option.label||'';
			var index=option.index||'0';
			if(obj && obj.length>0){
				obj.each(function(i) {
					$(this).on(action,{category:category,label:obj.length==1?label:label+(i+1),index:index},event_bind);}
				);
			}//end if
			else event_bind(null,{category:category,label:label,index:index});
		}//end if
	}//end func
	
	function event_bind(e,data){
		if(e) event_handler(e.data);
		else event_handler(data);
	}//end func
	
	function event_handler(data){
		_hmt.push(['_trackEvent', hmsr?'来源：'+hmsr:'来源：默认', data.index, (data.category!=''?data.category+'-':'') + data.label]);
		if(window.ga) ga('send', 'event', hmsr?'来源：'+hmsr:'来源：默认', data.index, (data.category!=''?data.category+'-':'') + data.label);
		console.log('监测来源：'+(hmsr?hmsr:'默认')+' | '+'监测说明：'+(data.index!='0'?data.index+'-':'')+(data.category!=''?data.category+'-':'') + data.label);
	}//end func
	
	return monitor;
}//end import