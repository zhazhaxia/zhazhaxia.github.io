;(function($){
	$.fn.extend({//局部插件$.fn.extend，去掉.fn是全局插件
		'myscroll':function(callfn){
			/*自定义滚动条插件，html格式为<div id='自定义'><div class="jerry-panel"></div><div class"jerry-bar"></div></div>调用：$("#自定义").myscroll();*/
		//callfn={top:function(){},bottom:function(){},between:fn(){}}3个参数，回调函数
			var bar=$(this).find('.jerry-bar').eq(0),panel=$(this).find('.jerry-panel').eq(0);
			
			var height=bar.parent().height();
			var panelHeight=panel.height();
			var p=height/panelHeight;//比例
			var bh=p<1?(p*height):height;
			panel.css('top',0);
			bar.height(bh);//滚动条的高
			
			bar.bind('mousedown',function(e){
				e=e||window.event;
				e.preventDefault();
				var sh=e.clientY,nowtop=parseInt(bar.css('top'));
				$(document).bind('mousemove',function(e){
					//console.log(1)
					e=e||window.event;
					e.preventDefault();  //阻止默认行
					var eh=e.clientY,move=eh-sh;
					bar.css('top',nowtop+move);
					var endtop=parseInt(bar.css('top'));
					//到头
					if(endtop<0){
						bar.css('top',0);
						if(typeof callfn!='undefined'){
							if(typeof callfn.top!='undefined'){callfn.top();}
						}
					}
					//到尾
					if(endtop>(height-bh)){
						bar.css('top',height-bh);
						if(typeof callfn!='undefined'){
							if(typeof callfn.bottom!='undefined'){callfn.bottom();}
						}
					}

					endtop=parseInt(bar.css('top'));
					panel.css('top',-endtop*(panelHeight/height)); 
				});
				$(document).bind('mouseup',function(e){
					$(document).unbind('mousemove');
					$(document).unbind('mouseup');
				});
			});
			//添加鼠标滚动
			if(p>1){bar.fadeOut();mousewheelEvent(panel.get(0),null);
			}else{bar.fadeIn();mousewheelEvent(panel.get(0),mainFaceWheel);}
			function mainFaceWheel(delta){
				var move=parseInt(panel.eq(0).css('top'));
				panel.eq(0).css('top',move-delta);
				var pl=panel.parent().height(),
					ll=panel.height();
				move=parseInt(panel.eq(0).css('top'));
				if((move-delta)>1){//滚到头部
					panel.eq(0).css('top',1);
					if(typeof callfn!='undefined'){
						if(typeof callfn.top!='undefined'){callfn.top();}
					}
				}
				//滚到底
				if((-move+pl)>=ll){panel.eq(0).css('top',-(ll-pl));
					if(typeof callfn!='undefined'){
						if(typeof callfn.bottom!='undefined'){callfn.bottom();}
					}
				}
				//同步侧栏滚动条
				bar.css('top',-(move-delta)/(ll/pl));
				if(!((move-delta)>1)&&!((-move+pl)>=ll)){
					if(typeof callfn!='undefined'){
						if(typeof callfn.between!='undefined'){callfn.between();}
					}
				}
			}		
			return this;
		}
	});
	//封装滚轮事件，obj为对象，fn为回调函数，包含一个参数delta滚动距离,下滚为正,每步30px
	function mousewheelEvent(obj,fn){
		
		obj.onmousewheel=obj.onmousewheel=function(event){
			var delta = 0;
			if (!event) event = window.event;
			if (event.wheelDelta) {
				delta = event.wheelDelta/15; 
				if (window.opera) delta = -delta;
			} else if (event.detail) {
				delta = -event.detail*10;
			}
			if (delta){
				if(fn)fn(-delta);
			} 
		};
	}
})(jQuery);