// JavaScript Document
$(function(){
	
	
	
	
/******************侧栏********************************/
(function(){
	$('#head img').eq(0).click(function(){
		if(parseInt($('#side').css('left'))!=0){
			$('#side').animate({'left':0});
		}else{$('#side').stop(true).animate({'left':-50});}
	});
})();


/******************轮播图********************************/
(function(){
	var timer=null,width=$('#flash .f-ul li').width(),index=0;
	timer=setInterval(flash,7000);
	function flash(){
		var left=parseInt($('#flash .f-ul').css('left'));
		index++
		if(index>=5)index=0;
		left=-index*width;
		$('#flash .f-ul').animate({'left':left});
		$('#flash .f-ro li').eq(index).addClass('focus').siblings().removeClass('focus');
	}
	/*$('#flash .f-ul').on('touchstart',function(e){//轮播图左滑动事件
		e=e.originalEvent.touches[0];//获取对应触摸对象
		//alert(e.pageX+':'+e.pageY);
	});*/
	$('#flash .f-ul').swipeleft(function(){
		index=index-2;
		if(index<0)index=4;
		flash();
	});
	$('#flash .f-ul').swiperight(function(){
		flash();
	});
})();
/******************轮播图结束********************************/

/******************音乐控件********************************/
(function(){
	var player = $('#audio')[0];
	$('#m-bar .op .play').click(function(){
		if (player.paused) {
			player.play();
			$('.play').attr('src','images/play.png');
		}else {
			player.pause();
			$('.play').attr('src','images/pause.png');
		}
		
	});
})();
/******************音乐控件结束********************************/
	
});