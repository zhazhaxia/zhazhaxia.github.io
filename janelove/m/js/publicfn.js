/*公共函数*/
	//拖动登录框插件
	function dragLogin(obj){
		sun=obj.find('.login-title').eq(0);
		var p_width=obj.parent().width(),p_height=obj.parent().height(),
			o_width=obj.width(),o_height=obj.height();	
		sun.on('mousedown',function(e){
			e=e||window.event;
			e.preventDefault();  //阻止默认行
			//e.stopPropagation();
			var oldX=e.clientX,oldY=e.clientY,
				objL=parseInt(obj.css('left')),objT=parseInt(obj.css('top'));	
			$(document).bind('mousemove',function(e){
				e=e||window.event;
				e.preventDefault();  //阻止默认行
				var moveX=e.clientX-oldX,moveY=e.clientY-oldY;
				obj.css({'left':objL+moveX,'top':objT+moveY});
				var nowl=parseInt(obj.css('left')),nowt=parseInt(obj.css('top'));
				if(nowl<0){obj.css('left',0);}
				if(nowt<0){obj.css('top',0);}
				if(nowl>(p_width-o_width)){obj.css('left',p_width-o_width);}
				if(nowt>(p_height-o_height)){obj.css('top',p_height-o_height);}			
			});
			$(document).bind('mouseup',function(e){
				$(document).unbind('mousemove');
				$(document).unbind('mouseup');
			});
		});
	}
	//音量滚动条
	function volumnBar(obj,ad){
		var length=100;
		var oh=obj.height();
		obj.bind('mousedown',function(e){
			//console.log(1)
			e=e||window.event;
			e.preventDefault();
			var sh=e.clientY,nowtop=parseInt(obj.css('top'));
			$(document).bind('mousemove',function(e){
				e=e||window.event;
				e.preventDefault();  //阻止默认行
				var eh=e.clientY,move=eh-sh;
				obj.css('top',nowtop+move);
				var endtop=parseInt(obj.css('top'));
				if(endtop<-5){obj.css('top',-5);}
				if(endtop>(length-oh)){obj.css('top',length-oh);}
				//以上改变滚动条位置
				//console.log(eh)
				obj.parent().height(parseInt(obj.css('top'))+5);
				//设置音量
				ad.volume=1-obj.parent().height()/100;
				if(ad.volume<0.10){ad.volume=0;}
				
			});
			$(document).bind('mouseup',function(e){
				//console.log(3)
				$(document).unbind('mousemove');
				$(document).unbind('mouseup');
			});
		});
	}
	
	//格式化时间
	function changeTime(iNum){
		iNum=parseInt(iNum);
		var hour=toZero(Math.floor(iNum/3600));
		var minute=toZero(Math.floor(iNum%3600/60));
		var second=toZero(Math.floor(iNum%60));
		return minute+':'+second;
	}
	function toZero(num){
		if(num<=9){
			return '0'+num;
		}
		else{
			return ''+num;
		}
	}
	//封装滚轮事件，obj为对象，fn为回调函数，包含一个参数delta滚动距离,下滚为正,每步30px
	function mousewheelEvent(obj,fn){
		obj.onmousewheel=obj.onmousewheel=function(event){
			var delta = 0;
			if (!event) event = window.event;
			if (event.wheelDelta) {
				delta = event.wheelDelta/4; 
				if (window.opera) delta = -delta;
			} else if (event.detail) {
				delta = -event.detail*10;
			}
			if (delta){
				fn(-delta);
			} 
		};
	}
	//异步上传文件
	function ajaxFileUpload(s){// 接收上传文件的后台地址,后台地址需要允许跨域传输操作
		var xhr = new XMLHttpRequest();
		var form=new FormData(),//表单对象
			target=s.obj;
		var file=target.files[0];
		form.append('file',file);
		xhr.open("post", s.url, true);//异步方式上传文件
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if(xhr.status==200){//上传成功返回回调信息xhr.responseT
					s.success(xhr.responseText);
				}
			}
		}
     	xhr.send(form);//发送表单内容	
	}
	
	
	

	
	//post get
	function jerryGet(typ,url,successFn,dat,beforeFn,completeFn){
		$.ajax({
			type:typ,
			url:url,
			data:dat,
			beforeSend: function(){
				beforeFn();
			},
			success: function(response,status,xhr){
				successFn(response,status,xhr);	
			},
			complete: function(){
				completeFn();
			}
		});
	}
	function jerryPost(){
		$.ajax({
			type:'POST',
			url:"ajax-login-user.php",
			data:$('.login form').serialize(),
			dataType:'json',
			success: function(response,status,xhr){
				if(response.state==1){//执行成功		
				}else{//执行失败，没有此用户
					$('.login .hint').text('没有此用户或密码错误！');
				}
			}
		})
	}
	//检查email
	function check_email(e){
		if(e.match(/^([\w\.\-]+)@([\w\-]+)\.([a-zA-Z]{2,4})$/))return true;
		else return false;
	}
	//特殊字符
	function check_char(name){
		if(name.indexOf(';')>0||name.indexOf('\'')>0||name.indexOf('\"')>0)return false;
		else return true;
	}
	function check_length(name,s,e){
		if(name.length<s||name>e)return false;
		else return true;
	}
	//去除首尾空白
	function trim(str) { 
		var newStr = str.replace(/^\s*/g,'').replace(/\s*$/g,'');
		return newStr; 
	}