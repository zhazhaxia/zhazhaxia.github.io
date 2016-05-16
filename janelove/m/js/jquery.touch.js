
;(function($){
	$.fn.extend({//局部插件，去掉.fn是全局插件
		'swipeleft':function(fn){//手指左滑动，fn是回调函数
			$(this).on('touchstart',function(e){
				e=e.originalEvent.touches[0];//获取对应触摸对象
				var sx=0;
				sx=e.pageX;
				$(this).on('touchend',function(e){
					e=e.originalEvent.changedTouches[0];//获取对应触摸对象
					if((sx-e.pageX)>50){//如果滑动距离大于50px就认为是要触发左滑动事件了
						fn();//调用回调函数
					}
					$(this).unbind('touchend');
				});
			});
			return this;
		},
		'swiperight':function(fn){//手指右滑动，fn是回调函数
			$(this).on('touchstart',function(e){
				e=e.originalEvent.touches[0];//获取对应触摸对象
				var sx=0;
				sx=e.pageX;
				$(this).on('touchend',function(e){
					e=e.originalEvent.changedTouches[0];//获取对应触摸对象
					if((e.pageX-sx)>50){//如果滑动距离大于50px就认为是要触发右滑动事件了
						fn();//调用回调函数
					}
					$(this).unbind('touchend');
				});
			});
		},
		'swipetop':function(fn){//手指上滑动，fn是回调函数
			$(this).on('touchstart',function(e){
				e=e.originalEvent.touches[0];//获取对应触摸对象
				var sy=0;
				sy=e.pageY;
				$(this).on('touchend',function(e){
					e=e.originalEvent.changedTouches[0];//获取对应触摸对象
					if((sy-e.pageY)>50){//如果滑动距离大于50px就认为是要触发上滑动事件了
						fn();//调用回调函数
					}
					$(this).unbind('touchend');
				});
			});
		},
		'swipedown':function(fn){//手指下滑动，fn是回调函数
			$(this).on('touchstart',function(e){
				e=e.originalEvent.touches[0];//获取对应触摸对象
				var sy=0;
				sy=e.pageY;
				$(this).on('touchend',function(e){
					e=e.originalEvent.changedTouches[0];//获取对应触摸对象
					if((e.pageY-sy)>50){//如果滑动距离大于50px就认为是要触发下滑动事件了
						fn();//调用回调函数
					}
					$(this).unbind('touchend');
				});
			});
		}
	});
})(jQuery);