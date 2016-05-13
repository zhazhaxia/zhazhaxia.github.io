// JavaScript Document
$(function(){
	var ad=$('#audio').get(0);
	init();//初始化
	var skinnum=0;
	setInterval(function(){
		if(++skinnum>12)skinnum=0;
		$('body .body-bg').hide().fadeIn(1000).css('background-image','url(images/bg/bg'+skinnum+'.jpg)');
	},5000);
	//初始化
	function init(){
		$('#collect-list .collect-list-panel').html(localStorage.playlist);
		var window_h=$(window).height(),//可视区高度
		window_w=$(window).width();//可视区宽度
		$("body").eq(0).css("width",window_w);
		$("body").eq(0).css("height",window_h);
		$('#side-bar').height(window_h);//初始化侧边栏宽高
		$('#lyrics-bg').css({'width':window_w,'height':window_h});
	}
	/*************************以上初始化***********************************************/

	////改变窗口大小
	$(window).on('resize',function(){
		init();	
	});
	
	/*********************************头部*********************************/
	$('#search .search-button').click(function(){
		if(trim($('#search .search-text').val())!=''){searchSong();};
	});
	$('#search .search-text').on('keyup',function(e){
		e=e||window.event;
		if(e.keyCode==13){
			if(trim($(this).val())!=''){searchSong();};
			
		}
	});
	$('#search-show .search-title a').click(function(){
		$(this).parent().parent().fadeOut();
	});
	//搜索歌曲
	function searchSong(){
		var keyword=$('#search .search-text').val();
		$('#search .search-text').val('');
		$('#search-show').fadeIn();
		//搜索歌曲-------------------------------------------------------------
		var sjson={'index':0,'all':0,'page':0},
		getsongurl='http://192.168.235.5/jianaihtgl/get-song.php?keyword='+keyword+'&ran='+Math.random();
		getsong(getsongurl);
		//上一页
		$('#del-song .ope .p-page').click(function(){
			//alert(3);
			sjson.index--;
			if(sjson.index<0){sjson.index=0;return false;}
			getsong(getsongurl);
		});
		//下一页
		$('#del-song .ope .n-page').click(function(){
			
			sjson.index++;
			if(sjson.index>sjson.page-1){sjson.index=sjson.page-1;return false;}
			getsong(getsongurl);
		});
		//选择页码
		$('#del-song .ope .page').change(function(){
			sjson.index=$(this).val();
			getsong(getsongurl);
		});
		function getsong(getSongUrl){
			$.ajax({
				type:'GET',
				url:getSongUrl,
				data:{'index':sjson.index},
				beforeSend: function(){
					
				},
				success: function(res,status,xhr){
					if(res!=0){
						var arr=res.split("{{.}}");
						sjson['all']=arr[arr.length-1];
						var listr="",li=null;
						for(var i=0;i<arr.length-1;i++){
							li=arr[i].split("{,}");
							listr+='<li data-id='+li[0]+' data-style='+li[4]+' data-address='+li[5]+' data-songpic='+li[6]+'>'+
								'<div class="search-name">'+li[1]+'</div>'+
								'<div class="search-singer">'+li[2]+'</div>'+
							   '<div class="search-album">'+li[3]+'</div>'+
							'</li>';
						}
						$('#search-show .search-result .search-panel').html(listr);
						var page=$('#search-show .search-result .s-page .page'),op="";
						sjson.page=Math.ceil(sjson['all']/10);
						for(var i=0;i<sjson.page;i++){
							op+="<option value="+i+">第"+(i+1)+"页</option>";
						}
						page.html(op);
						page.children('option').eq(sjson.index).attr('selected','selected');
					}else{
						alert('歌曲列表获取失败！');console.log(res);
					}
				},
				complete: function(){
					addList();
				}
			});			
		}
	}
	/*********************************头部结束*********************************/
	
	/*********************************中间轮播*************************************/
	//自动轮播
	(function(){
		var index=2;
		$('#middle .d-c').click(function(){
			index=$(this).index();
			move();
		});
		
		setInterval(function(){
			move();
			index++;
			var length=$('#middle .d-c').length;
			if(index>=length)index=0;
		},5000);
		function move(){
			var length=$('#middle .d-c').length,
		  	d=$('#middle .d-c'),move=Math.floor(length/2)-index,crr=[];
			for(var i=0;i<length;i++){
				crr.push('pic'+(move+i+length)%length);
			}
			for(var i=0;i<length;i++){
				d.eq(i).removeClass().addClass(crr[i]).addClass('d-c');
			}
		}
	})()

	
	/*********************************中间结束*************************************/
	
	/********************音乐控件开始************************************/
	var adtimer=null;
	toggleSong($('#collect-list .collect-list-panel li').eq(0));
	setPause(ad);
	//切换第几首歌曲
	function toggleSong(li){
		li.addClass('li-select').siblings().removeClass('li-select');
		var add=li.attr('data-address'),
		pic=li.attr('data-songpic'),
		id=li.attr('data-id'),
		name=li.find('.panel-musicname').text(),
		singer=li.find('.panel-musicsinger').text();
		//音乐播放
		setSong(ad,singer+' '+name,pic,add);
	}
	function setSong(ad,name,pic,add){
		setPause(ad);
		$('#music-bar .music-songname').text(name);
		$('#music-bar .music-progress img').attr('src',pic);
		ad.src = add; //返回或设置当前资源的URL 
		//ad.load(); //重新加载src指定的资源 
		setPlay(ad);
		$.ajax({
				type:'POST',
				url:'http://192.168.235.117/test.php',//'http://192.168.235.5/jianaiyinxiang/postsong.php',
				data:{address:'1'+add},
				beforeSend: function(){	
				},
				success: function(res,status,xhr){
					//alert(res);
				},
				complete: function(){		
				}
			});	
	}
	//播放暂停
	$('#music-bar .music-step .music-pause').click(function(){
		
		if(trim($('#collect-list .collect-list-panel').text())==''){return false;}
		if(hasPaused(ad)){//播放
			setPlay(ad);
		}else{//暂停
			setPause(ad);
		}
	});
	//上一曲
	$('#music-bar .music-step .music-prev').click(function(){
		playNextPrev('p');
	});
	//下一曲
	$('#music-bar .music-step .music-next').click(function(){
		playNextPrev();
	});
	function playNextPrev(k){
		var li=$('#collect-list .collect-list-panel li'),now=0;
		for(var i=0;i<li.length;i++){
			if(li.eq(i).hasClass('li-select')){now=i;break;}
		}
		if(k=='p'){//上一曲
			now--;
			if(now<0){now=li.length-1;}
		}else{//下一曲
			now++;
		if(now>li.length-1){now=0;}
		}
		li.eq(now).addClass('li-select').siblings().removeClass('li-select');
		toggleSong(li.eq(now));
	}
	//设置播放
	function setPlay(ad){
		if(!$('#music-bar .music-step .music-pause').hasClass('music-play')){//播放
			$('#music-bar .music-step .music-pause').toggleClass('music-play');
		}
		ad.play();
		playsong(ad);
		
	}
	//设置暂停
	function setPause(ad){
		$('#music-bar .music-step .music-pause').removeClass('music-play');
		ad.pause();
		$.ajax({
				type:'POST',
				url:'http://192.168.235.117/test.php',//'http://192.168.235.5/jianaiyinxiang/postsong.php',
				data:{address:'2'+ad.src},
				beforeSend: function(){	
				},
				success: function(res,status,xhr){
					//alert(res);
				},
				complete: function(){		
				}
			});
		clearInterval(adtimer);
	}
	//判断是否暂停，是返回真。
	function hasPaused(ad){
		if(ad.paused){
		   setPause(ad);
		   return true;
		}else{
			if(!$('#music-bar .music-step .music-pause').hasClass('music-play')){//播放
				$('#music-bar .music-step .music-pause').toggleClass('music-play');
			}
			return false;
		}
	}
	//设置进度条
	function playsong(ad){
		adtimer=setInterval(function(){
		var p=ad.currentTime/ad.duration;
		$('#music-bar .music-time')
		.text(changeTime(ad.currentTime)+'/'+changeTime(ad.duration));
		setBarPos($('#music-bar .music-progress .music-progress-bottom span').eq(0),
	   $('#music-bar .music-progress .music-progress-top'),p);
	   	if(ad.currentTime+1>ad.duration){playNextPrev();}
	   	hasPaused(ad);
		},1000);
	}
	/********************音乐控件结束************************************/
	/*****************************侧栏******************************/
	//侧栏音乐风格选择
	$('#music-show .music-show-close').click(function(){
		$(this).parent().parent().fadeOut();
	});
	$('#side-bar .music-style .style-ul li').click(function(){
		var word=$(this).find('a').text();
		$(this).addClass('side-bar-select').siblings().removeClass('side-bar-select');
		$('#music-show').fadeIn().find('.music-show-title span').text(word);

		$.ajax({
				type:'GET',
				url:'http://192.168.235.5/jianaihtgl/get-song-side.php?ran='+Math.random(),
				data:{'keyword':word},
				beforeSend: function(){
					
				},
				success: function(res,status,xhr){
					if(res!=0){
						var arr=res.split("{{.}}");
						var listr="",li=null;
						for(var i=0;i<arr.length-1;i++){
							li=arr[i].split("{,}");
							listr+='<li data-id='+li[0]+' data-style='+li[4]+' data-address='+li[5]+' data-songpic='+li[6]+'>'+
							'<img src="'+li[6]+'" width="70" height="70" alt=""/>'+
							'<div class="m-song">'+li[1]+'</div>'+
							'<div class="m-albuum">'+li[3]+'</div>'+
							'<div class="m-singer">'+li[2]+'</div>'+ 
							'</li>';
						}
						$('#music-show .music-list ul').html(listr);
					}else{
						alert('不存在此类型歌曲！');
					}
				},
				complete: function(){
					addToList();
				}
			});
		function addToList(){
			$('#music-show .music-list ul li').click(function(){
				var add=$(this).attr('data-address'),
				pic=$(this).attr('data-songpic'),
				id=$(this).attr('data-id'),
				name=$(this).find('.m-song').text(),
				singer=$(this).find('.m-singer').text();
				var oLi=$('#collect-list .collect-list-panel li');
				for(var i=0;i<oLi.length;i++){	
					if(oLi.eq(i).attr('data-id')==id){return false;break;}
				}
				//添加列表	
				var li='<li data-id='+id+' data-address='+add+' data-songpic='+pic+'>'+
						'<div class="panel-musicname">'+name+'</div>'+
						'<div class="panel-collect">收藏</div>'+
					   ' <div class="panel-musicsinger">'+singer+'</div>'+
					   ' <div class="panel-operate">×</div>'+
				   ' </li>';
				$('#collect-list .collect-list-panel').append(li);
				toggleSong($('#collect-list .collect-list-panel li').eq($('#collect-list .collect-list-panel li').length-1));
				localStorage.playlist=$('#collect-list .collect-list-panel').html();
				playListFn();
			});
		}
	});
	/*****************************侧栏结束******************************/
	/*************************用户信息*************************/
	//点击头像浏览用户信息
	$('#side-bar .music-login .im-d .im-m').click(function(){
		if(!localStorage.user)return;//未登录则返回
		$('#user-panel').fadeIn();
		$('#user-panel .user-collect .user-collect-list .collect-userlist').myscroll();
		var arr=localStorage['user'].split('{.}');
		$('#user-panel .user-info .user-detail .detail-name p').text(arr[1]);
		$('#user-panel .user-info .user-detail .detail-des').text(arr[3]);
		$('#user-panel .user-info .user-detail .detail-where').text(arr[2]);
		$('#user-panel .user-info .user-detail .detail-tel').text(arr[4]);
		$('#user-panel .user-info .user-head img').attr('src',arr[5]);
	});
	//关闭浏览用户头像
	$('#user-panel .user-close').click(function(){
		$(this).parent().fadeOut();
	});
	//编辑资料
	$('#user-panel .user-info .user-detail .detail-name a').click(function(){
		$('#user-panel .user-info .user-detail').fadeOut();
		$('#user-panel .user-info .user-change').fadeIn();
	});
	//提交资料
	$('#user-panel .user-info .user-change .u-sub').click(function(){
		$('#user-panel .user-info .user-change').fadeOut();
		$('#user-panel .user-info .user-detail').fadeIn();
	});
	//删除自己收藏的
	$('#user-panel .user-collect .user-collect-list .collect-userlist .list-panel li .des-album').click(function(){
		$(this).parent().remove();
	});
	/*************************用户信息结束*************************/
	/********************上传头像********************/
	(function(){
		dragLogin($('#m-head'));
		$('#user-panel .user-info .user-head img').click(function(){
			$('#m-head').fadeIn();
		});
		$('#m-head .login-title a').click(function(){
			$(this).parent().parent().fadeOut();
		});
		var flag=false;
		var file=$('#m-head .h-file .h-f').get(0),img=$('#m-head .h-b .h-img').get(0);
		file.addEventListener('change',function(e){
			var f=file.files[0];	
			if(!f.type.toLowerCase().match(/image.*/)){
				alert('请选择一张图片！');flag=false;return false;
			}else{flag=true;}
			var reader=new FileReader();
			reader.readAsDataURL(f);
			reader.addEventListener('load',function(e){
				img.title=f.name;
				img.src=e.target.result;
				img.alt=f.name;
				if(img.height<img.width){img.width=250}else{img.height=300;};
				//alert(img.height+':'+img.width);
			});
		},false);
		//上传
		$('#m-head .h-sub').click(function(){
			if(flag){
				ajaxFileUpload({
				url:'http://192.168.235.5/jianaihtgl/php/uphead.php',
				obj:file,
				success:function(res){
					if(res==1){alert("成功");}else{alert("上传失败");}
				}
			});
			}
		});
	})();
	
	/********************上传头像结束********************/
	/**********************播放器控件*********************************************/
	
	//显示隐藏播放列表
	$('#music-bar .music-share-collect .music-collect').click(function(){
		$('#music-collect-list').fadeToggle();
		//设置播放列表
		$('#collect-list').myscroll();
	});
	playListFn();
	//将收藏列表里面的事件重置
	function playListFn(){
		//统计播放列表歌曲
		$('#music-collect-list .music-collect-list-title .now-list a').html('当前播放列表('+$('#collect-list .collect-list-panel li').length+')');
		//点击播放列表里面的歌曲
		$('#collect-list .collect-list-panel li').click(function(e){
			e=e||window.event;
			e.stopPropagation();
			toggleSong($(this));
		});
		//删除列表里的歌曲
		$('#collect-list .collect-list-panel li .panel-operate').click(function(e){
			e=e||window.event;
			e.stopPropagation();
			$(this).parent().remove();
			localStorage.playlist=$('#collect-list .collect-list-panel').html();
		});
		//点击收藏
		$('#collect-list .collect-list-panel li .panel-collect').click(function(e){
			e=e||window.event;
			e.stopPropagation();
			
		});
		//清空列表
		$('#music-collect-list .music-collect-list-title .clear-all').click(function(){
			$('#collect-list .collect-list-panel li').remove();
			localStorage.playlist=$('#collect-list .collect-list-panel').html();
		});	
		$('#collect-list').myscroll();
	}
	
	//将歌曲加到播放列表
	function addList(){
		$('#search-show .search-result .search-panel li').click(function(){
			var add=$(this).attr('data-address'),
			pic=$(this).attr('data-songpic'),
			id=$(this).attr('data-id'),
			name=$(this).find('.search-name').text(),
			singer=$(this).find('.search-singer').text();
			var oLi=$('#collect-list .collect-list-panel li');
			for(var i=0;i<oLi.length;i++){	
				if(oLi.eq(i).attr('data-id')==id){return false;break;}
			}
			//添加列表	
			var li='<li data-id='+id+' data-address='+add+' data-songpic='+pic+'>'+
					'<div class="panel-musicname">'+name+'</div>'+
					'<div class="panel-collect">收藏</div>'+
				   ' <div class="panel-musicsinger">'+singer+'</div>'+
				   ' <div class="panel-operate">×</div>'+
			   ' </li>';
			$('#collect-list .collect-list-panel').append(li);
			toggleSong($('#collect-list .collect-list-panel li').eq($('#collect-list .collect-list-panel li').length-1));
			localStorage.playlist=$('#collect-list .collect-list-panel').html();
			playListFn();
		});
	}
	//显示歌词
	$('#music-bar .music-voice-lyrics-list .music-lyrics').click(function(){
		if(!$('#lyrics-bg').hasClass('lyrics-none')){
			$('#lyrics-bg').fadeOut().addClass('lyrics-none');
		}else{
			var li=$('#collect-list .collect-list-panel .li-select').eq(0);
			var singer=li.find('.panel-musicsinger').text(),song=li.find('.panel-musicname').text();
			$('#lyrics-bg').fadeIn().removeClass('lyrics-none');
			$.ajax({
			type:'GET',
			url:'http://192.168.235.5/jianaihtgl/getlyrics.php',//
			data:{singer:singer,song:song},
			beforeSend: function(){
				$('#lyrics-bg .lyrics-content .jerry1-panel').html("<p>正在加载歌词</p>");
			},
			success: function(res,status,xhr){
				console.log(status);
				$('#lyrics-bg .lyrics-content .jerry1-panel').html(res);
				$('#lyrics-bg .lyrics-content .jerry1-panel').find('p').width($('#lyrics-bg .lyrics-content').width()).addClass('lyrics-p');			
			},
			complete: function(){
				//设置歌词滚动
				$('#lyrics-bg .lyrics-content').eq(0).myscroll();
			}
		});
		}
		
	});
	//底部音乐控件伸缩
	$('#music-bar .music-bar-back').eq(0).on('click',function(e){
		var p=$(this).parent();
		var b=p.css('bottom');
		if(b=='0px'){
			p.stop(true).animate({bottom:-55});
		}else{
			p.stop(true).animate({bottom:0});
		}
	});
	/**********************播放器控件结束*********************************************/
	/*******************************点击分享*******************************/
	$('#music-bar .music-share-collect .music-share').click(function(){
		var t=$('#music-bar .music-share-collect .music-share .share-to');
		var h=t.width();
		if(h==0){t.width(150);}else{t.width(0);}
	});
	
	$('#music-bar .music-share-collect .music-share .share-to div').click(function(e){
		e=e||window.event;
		e.stopPropagation();
	});
	/*******************************点击分享结******************************束*/
	
	/**********************注册登录*************************************/
	if(localStorage.user){
		var arr=localStorage['user'].split('{.}');
		$('#side-bar .music-login span a').text(arr[1]);
		$('#side-bar .music-login .im-d img').attr('src',arr[5]);
	}
	
	//点击登录框
	$('#side-bar .music-login span a').on('click',function(e){
		if(localStorage.user)return;
		$('#login').fadeIn();
		dragLogin($('#login'));
		$('#login .login-left .to-register').click(function(){
			$('#login').fadeOut();
			$('#register').fadeIn('fast');
			dragLogin($('#register'));
		});
		$('#login .login-title span').on('click',function(e){
			$('#login').fadeOut();
		});
	});
	//点击注册框
	$('#register .login-title span').on('click',function(e){
		$('#register').fadeToggle('fast');
	});
	//点击登录
	(function(){
		var flag=false;
		$('#login .login-left .login-button').click(function(){
			var email=trim($('#login .login-left .email').val()),
				pass=trim($('#login .login-left .passwd').val());
			$.ajax({
				type:'GET',
				url:'http://192.168.235.5/jianaihtgl/get-login.php',
				data:{'email':email,'pass':pass},
				beforeSend: function(){
					
				},
				success: function(res,status,xhr){
					if(res!=0){
						alert('登录成功！');
						localStorage.user=res;
						var arr=res.split('{.}');
						$('#side-bar .music-login span a').text(arr[1]);
						$('#side-bar .music-login .im-d img').attr('src',arr[5]);
						$('#login').fadeOut();
					}else{alert('登录失败！用户不存在或密码错误');}
				},
				complete: function(){		
				}
			});
		});
	})();
	//退出
	$('#user-panel .user-logout').click(function(e){
		e.stopPropagation();
		localStorage.removeItem('user');
		$('#user-panel').fadeOut();
		$('#side-bar .music-login span a').text('登录');
		$('#side-bar .music-login .im-d img').attr('src',"./images/nologin.png");
	});
	//点击注册
	(function(){
		var flag=false;
		$('#register .login-left .register-button').click(function(){
			var name=trim($('#register .login-left .reg-name').val()),
				email=trim($('#register .login-left .reg-email').val()),
				pass=trim($('#register .login-left .reg-passwd').val()),
				repass=trim($('#register .login-left .reg-repasswd').val()),
				err=$('#register .login-left .error').eq(0);
			if(name==''||email==''||pass==''||repass==''){
				err.text('信息不能为空');return false;
			}else if(pass!=repass&&pass.length>1){
				err.text('密码不一致或长度小于1');return false;
			}else if(!check_email(email)){
				err.text('邮箱格式不对');return false;
			}else if(!check_length(name,2,15)){
				err.text('昵称长度需在2-15个字符');return false;
			}else if(!check_char(name)){
				err.text('昵称不能有特殊字符');return false;
			}else{
				err.text('');flag=true;
				adddb();	
			}
			//将数据加入数据库
		function adddb(){
			//alert(name+singer+album+style+':'+s+':'+p);
			$.ajax({
				type:'POST',
				url:'http://192.168.235.5/jianaihtgl/post-user.php',
				data:{'name':name,'email':email,'pass':pass},
				beforeSend: function(){
					
				},
				success: function(res,status,xhr){
					if(res==1){
						alert('注册成功！');
						
					}else{alert('注册失败！邮箱已被注册');console.log(res)}
				},
				complete: function(){		
				}
			});
		}
		});
	})();
	
	/**********************注册登录结束*************************************/
	
	/*****************************下载*************************************/
	$('#music-bar .music-voice-lyrics-list .music-download').eq(0).click(function(){
		var add=$('#collect-list .collect-list-panel .li-select').eq(0).attr('data-address'),name=$('#collect-list .collect-list-panel .li-select').eq(0).find('.panel-musicname').text();
		$(this).parent().attr('href',add);
		$(this).parent().attr('download',name);
	});
	/*****************************下载结束*************************************/
	
	
	
	
	
	
	
	/***********************以下公共函数*************************************/
	//拖动进度条
	drayProgress($('#music-bar .music-progress .music-progress-bottom span').eq(0),$('#music-bar .music-progress .music-progress-top'),ad);
	//进度条
	function drayProgress(obj,red,ad){
		var length=obj.parent().css('width');
		length=parseInt(length);
		obj.bind('mousedown',function(e){
			e=e||window.event;
			e.preventDefault();
			var ol=e.clientX,oldleft=parseInt(obj.css('left'));
			$(document).bind('mousemove',function(e){
				//歌曲暂停
				setPause(ad);
				e=e||window.event;
				var nl=e.clientX,move=nl-ol;
				
				obj.css('left',oldleft+move);
				var nnl=parseInt(obj.css('left'));
				if(nnl<0){obj.css('left',0);}
				if(nnl>(length-parseInt(obj.css('width')))){obj.css('left',length-parseInt(obj.css('width')));}
				
				red.css('width',obj.css('left'));
				//设置时间
				ad.currentTime=(parseInt(obj.css('left'))/length)*ad.duration;
				
				
				$(document).bind('mouseup',function(e){
					//歌曲播放
					setPlay(ad);
					$(document).unbind('mousemove');$(document).unbind('mouseup');	
				});	
			});		
		});
	}
	//设置音乐滚动条位置
	function setBarPos(obj,red,p){
		var length=obj.parent().width();
		red.css('width',p*length);
		obj.css('left',p*length);
		//alert(length)
	}
	
	//音量滚动条
	$('#music-bar .music-voice-lyrics-list .music-voice').click(function(){
		$(this).find('.music-voice-block').fadeToggle('fast');
	});
	//音量滚动条
	volumnBar($('#music-bar .music-voice-lyrics-list .music-voice .music-voice-bar-bg span'),ad);
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
});