var camera = function(){
	var _self = this;

	var loadBox=$('aside.loadBox');
	var imgShell=$('div.shell');
	var btnCamera=$('a.btnCamera');
	var imgCanvas,imgLayer;
	var imgScaleMin=1,imgScaleMax=5,imgScaleTimer;
    var fileInput;
    var control = true;
    var callback = function(){
    	cobsole.log("upimg");
    };

    //初始化
    _self.init = function(box,btn,c,onUoload){
    	imgShell = box;
    	btnCamera = btn;
    	control = c;
    	if(onUoload) callback = onUoload;

    	fileInput=$('<input type="file" accept="image/*" name="imageInput" class="formfield"/>').appendTo(btnCamera);
		fileInput.on('change',file_select);
		imgCanvas=$('<canvas></canvas>').attr({width:imgShell.width() * 2,height:imgShell.height() * 2}).css({width:imgShell.width(),height:imgShell.height()}).prependTo(imgShell);
		imgCanvas[0].getContext("2d").imageSmoothingEnabled = true;
    }//end func

    //html转图片
	_self.makeImg = function(ele,callback){
		var shareContent = ele;   //需要截图的包裹的DOM 元素
		shareContent.css({width:shareContent.width(),height:shareContent.height()});
        var canvas = document.createElement("canvas"); //创建一个canvas节点
        var scale = 2; //定义任意放大倍数 支持小数
        canvas.width = (shareContent.width()+shareContent.offset().left) * scale; //定义canvas 宽度 * 缩放
        canvas.height = (shareContent.height() + shareContent.offset().top + $(window).scrollTop()) * scale; //定义canvas高度 *缩放
        canvas.getContext("2d").scale(scale,scale); //获取context,设置scale 
        var opts = {
            scale:scale, // 添加的scale 参数
            canvas:canvas, //自定义 canvas
            logging: true, //日志开关
            width:shareContent.width(), //dom 原始宽度
            height:shareContent.height() //dom 原始高度
        };
        html2canvas(shareContent[0], opts).then(function (canvas) {
            icom.canvas_send(canvas,callback,'anchor');
        });
    }//end func

    //拍照或打开本地图片
	function file_select(e) {
		console.log('file_select');
        var file = this.files[0];
        if (file) {
			loadBox.show();
			ireader.read({ file: file, callback: function (resp,wd,ht) {
                if (resp) img_creat(resp,wd,ht);
                else loadBox.hide();
            }});
        }//end if
   }//end select

   //复制图片至canvas
	function img_creat(src,wd,ht){	
		loadBox.hide();
		callback();
		if(control){
//			btnCamera.hide();
			btnCamera.addClass('uploadBtnSide');
		}//edn if
		var size=imath.autoSize([wd,ht],[imgShell.width() * 2,imgShell.height() * 2],1);
		imgCanvas.removeLayers()
		.drawImage({
		  layer: true,
		  source: src,
		  width:size[0],height:size[1],
		  x: imgCanvas.width(), y: imgCanvas.height(),
		  scale:1,
		  fromCenter: true,
		  touchstart: layer_touchstart
		}).drawLayers();
	}//end func

	function layer_touchstart(layer){
	  	if(control) img_addEvent(imgCanvas,imgShell,layer);
	}//edn func

	//添加图片编辑事件
	function img_addEvent(canvas,shell,layer){
		shell.off().on('pinch',{layer:layer,canvas:canvas},img_pinch).on('pinchmove',{layer:layer},img_pinchmove).on('pinchscale',{layer:layer},img_pinchscale).on('pinchrotate',{layer:layer},img_pinchrotate);
	}//end func
	
	//单指双指触控
	function img_pinchmove(e,xOffset,yOffset){
		var layer=e.data.layer;
   		layer.x+=xOffset;
		layer.y+=yOffset;
   	}//end func
   	
   	function img_pinchscale(e,scaleOffset){
   		var layer=e.data.layer;
   		layer.scale+=scaleOffset*0.5;
   		layer.scale=layer.scale<=imgScaleMin?imgScaleMin:layer.scale;
		layer.scale=layer.scale>=imgScaleMax?imgScaleMax:layer.scale;
   	}//end func
   	
   	function img_pinchrotate(e,rotateOffset){
   		var layer=e.data.layer;
   		layer.rotate+=rotateOffset;
   	}//end func
	
	function img_pinch(e){
		var canvas=e.data.canvas;
		canvas.drawLayers();
	}//end func
	
	//图片缩放
	function imgScale_touchstart(e){
		e.preventDefault();
		clearInterval(imgScaleTimer);
		imgScaleTimer=requestAnimationFrame(function(){
			imgScale_handler(e.data.layer,e.data.canvas,e.data.offset,0.05);
		});
	}//end func
	
	function imgScale_touchend(e){
		e.preventDefault();
		cancelAnimationFrame(imgScaleTimer);
	}//end func
	
	function imgScale_handler(layer,canvas,offset,speed){
		speed=speed!=null?speed:0.05;
		layer.scale+=speed*offset;
		layer.scale=layer.scale<=imgScaleMin?imgScaleMin:layer.scale;
		layer.scale=layer.scale>=imgScaleMax?imgScaleMax:layer.scale;
		canvas.drawLayers();
		imgScaleTimer=requestAnimationFrame(function(){
			imgScale_handler(layer,canvas,offset,speed);
		});
	}//end func
	
	//图片旋转
	function img_rotate(e){
		var canvas=e.data.canvas;
		var layer=e.data.layer;
		if(layer.rotate%90!=0) layer.rotate=Math.floor(layer.rotate/90)*90;
		else layer.rotate+=90;
		layer.rotate=layer.rotate>360?layer.rotate%360:layer.rotate;
   		layer.rotate=layer.rotate<-360?-layer.rotate%360:layer.rotate;
		canvas.drawLayers();
	}//end func
}

var icamera = new camera();