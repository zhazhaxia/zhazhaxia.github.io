# 不要停！八分音符酱

----------

## 游戏demo来源背景

2017年春节期间，一款来自东洋霓虹的游戏开始在微博、朋友圈火了起来，这款游戏就是《不要停！八分音符酱》。八分音符酱之所以能够火起来，是因为它不通过手工操作，而是通过声音来控制游戏的行走和跳跃，这样会让用户感觉很新颖。其有趣的玩法也在网上产生了很多段子，如”要不是邻居来敲门，我早就通关了“等等，现在网上都有人通过乐器来玩这个游戏。

![八分音符酱游戏截图](http://i.imgur.com/gN7TuvS.png)

一开始八分音符酱只有PC版本，目前又好像开始有了ios、android版，相关资源可以自行搜索下载。本文则尝试使用JS，结合web端音频处理接口webAudio，实现一个H5版本的《不要停！八分音符酱》demo。本人也是第一次写小游戏，文章中出现的不足（比如游戏建模、代码实现）也麻烦读者们批评指正，共同学习。

## 开始

先看下游戏的截图吧，体验地址 [https://zhazhaxia.github.io/server/public/demo/8notes.html](https://zhazhaxia.github.io/server/public/demo/8notes.html "八分音符酱")

![H5八分音符酱](http://i.imgur.com/aNzryFk.png)

- 玩法

  连接耳机后，最好在微信或手Q打开这个页面（系统需android5.0+），同意获取麦克风权限。然后对着麦克风大声说几句话，如“啊……”，然后游戏里面的doge就会开始走了，声音大到一定程度，doge就会跳起来，掉坑则输。

## 游戏建模

本质上这应该是一个碰撞模型的游戏，碰撞模型中几个主要的概念是

- 目标物体：游戏中doge方块
- 碰撞物体：游戏中的坑
- 输赢条件：目标物体与碰撞物体部分体积重合则判为输


根据以上的概念我们可以开始设计这款游戏了。

## 游戏设计

先看一张初始设计图吧

![设计图2](http://i.imgur.com/zOU1ttq.png)

- 目标物体

  图中棕色物体为目标物体，是我们视觉中的操作对象，可以进行行走或者跳跃

- 目标物体的载体

  图中蓝色框则为游戏中的路，承载了物体的行走。游戏中的路是一个整体，我们实际在代码操作的对象，可以对下方的路整体移动，在视觉上感觉是目标物体的移动。移动后如下图


![设计图3](http://i.imgur.com/PPymPJz.png)

- 碰撞物体

  碰撞物体其实就是游戏路中的坑。目标物体移动的时候，游戏会给物体设置障碍，目标物体必须跳过这些坑，否则就游戏就失败重来了。


## 游戏实现

游戏建模设计后就可以开始实现了，由于这个是单页面且动作相对简单，所以采用单体的设计模式实现。

- 参数配置

  游戏中涉及到一些参数的配置用来控制游戏的状态，具体的配置可以在编写的时候生成，这里有本文部分的配置信息。


	  config:{
	      barrierWidth:80,//障碍物宽
	      containerWidth:$('.container').width(),//大容器宽
	      numberOfBarrier:0,//容器障碍物数目
	      rank : 2,//难度1,2,3
	      timer:null,
	      lockMove:false,//锁定移动
	      lockLost:false,//坑来了，开始判断
	      dangerArea:[null,null],//危险区域,碰撞区域
	      $tmpBarrier:$(".barrier-low"),
	      lockConsole:true,
	      volSum:0,//音量大小
	      vol:0,
	      score:0,
	      gameEnd:false,
	      walkValue:1,//走的音量临界值
	      jumpValue:~~$('.threshold').val()//起跳的音量临界值
	  }
  ​

- 初始化

  初始化主要是生成载体，填充到页面中。本文主要根据游戏容器的宽，生成初始载体的个数，填充到容器中。

	  initStat:function () {//初始化障碍物宽高，初始化载体
	      $('.barrier').width(exports.config.barrierWidth);
	      exports.config.numberOfBarrier = Math.ceil(exports.config.containerWidth / exports.config.barrierWidth) + 2;
	      $('.bottom-barrier').width(exports.config.numberOfBarrier * exports.config.barrierWidth);//障碍物容器宽
	      exports.createBarrier(exports.config.numberOfBarrier);//创建并填充
	  }

- 获取麦克风跟音量大小

  在web中获取麦克风可以通过`navigator.getUserMedia`获取，不过目前在移动端只有android5.0+才有这个功能，iPhone目前还没有提供这方面的接口给JS调用。目前国内部分手机厂商的默认浏览器对这个权限也有限制，或者有兼容问题，建议用微信、手Q等webview采用QQ浏览器X5内核的app进行体验（卖了个广告）。

  `navigator.getUserMedia`在pc的兼容一般是


	 navigator.getUserMedia = (navigator.getUserMedia ||
	                 navigator.webkitGetUserMedia ||
	                 navigator.mozGetUserMedia ||
	                 navigator.msGetUserMedia);



- webAudioApi

获取麦克风的大小需要用到webAudioApi的相关接口（webAudioApi的了解可以参考笔者之前写的介绍[https://github.com/zhazhaxia/webAudioApi-testing/blob/master/public/README.md](https://github.com/zhazhaxia/webAudioApi-testing/blob/master/public/README.md "webAudioApi")）

​		
利用webAudioApi的scriptProcessNode可以获取到麦克风的音频数据，如果将音频数据再输出，就会有返耳效果。

利用webAudioApi的Analyser接口可以获取到音频经过傅里叶变换后的数据，这些数据包含了音频振幅等信息。

		getSpeaker:function () {//链接麦克风 并获取音调数据
			 if(!navigator.getUserMedia){alert('不支持麦克风录音');return;}
			 navigator.getUserMedia({audio:true}, function (stream) {
			      ...//webAudioApi的相关操作
			 },function (err) {
			      console.log('err',err)
			 });
		}

- 创建载体

本文游戏中的各种物体设计采用的是DOM来实现，当然也可以采用canvas或其他实现。载体移动到一定距离便在容器后面插入一个载体，插入的载体有可能是路，也可能是坑。插入后要把前面移动过的载体删了，以免DOM过多造成吸能性能问题。

	  	createBarrier:function (num) {//创建障碍物，num个数
	  		...//其他代码
	  	    $bc.append(exports.getBarrier(num,type));
	  	},
	  	getBarrier:function (num,type) {//获取障碍物
	  	    var html = "";
	  	    for(var i = 0; i < num; i++){
	  	        html += '<div class="barrier '+(type === 1 ? "barrier-high" : "barrier-low")+'" data-id="'+new Date().getTime()+'">》</div>'
	  	    }
	  	    return html;
	  	}


- 目标物体移动和跳动

  当音量达到一定条件，目标物体在视觉中就开始移动，实际我们移动的是目标物体下面的载体。

  	letsGo:function (vol) {//达到条件行走或者跳跃
  	    if (vol > exports.config.walkValue ) {//走
  	        exports.moveBarrier();
  	        if (vol > exports.config.jumpValue) {//跳
  	            exports.jumpNotes();
  	        }
  	    }else {//停
  	        exports.stopBarrier();
  	    }
  	}

- 碰撞检测

  碰撞检测就是对目标物体和碰撞物体之间距离的检测。在本文这个游戏中，采用一个数组来更新碰撞物体，碰撞物体来的时候添加，离开的时候再更新一次。边移动边检测。


  	judgeLost:function(){//是否失败，碰撞检测
  	    ....//其他代码
  	    if(exports.config.$tmpBarrier.attr('data-id') !== $barrier.attr("data-id")){//更新碰撞物体
  			...//其他代码，更新，计分
  	    }
  	    ...//
  	    if (parseInt($notes.css("bottom")) <= 200) {//判断是否在区间
  	        var left = exports.config.dangerArea[0],
  	            right = exports.config.dangerArea[1];
  	        if(left <= 80 && right >= 160){//是否达到碰撞条件
  	            exports.lost();
  	        }
  	    }
  	}

- 失败重置

  游戏失败后会重新初始化设置参数，重复以上步骤

  	lost:function () {//输了掉坑了
  	    $('.title').text('啊！掉坑了！重新来一遍吧！')
  	    exports.stopBarrier();
  	    exports.config.gameEnd = true;
  	    $notes.stop(true).animate({bottom:0},500)
  	    setTimeout(function () {
  	        exports.config.gameEnd = false;
  	        $('.bottom-barrier').html("");
  	        exports.initStat();
  	        $notes.css("bottom",200)
  	        $('.title').text('大声点！不要停！八分音符酱')
  	        exports.config.score = 0;
  	        $('.j_score').text(exports.config.score);
  	    }, 3000)
  	}

以上就是本文游戏的主要设计的相关思路。

## 结束语

本文从PC游戏《不要停？八分音符酱》的灵感出发，描述了其H5简易版本的开发思路，游戏的设计许多不足，请读者们批评指正。笔者开发H5版本《八分音符酱》的意图不只是简单的为了把pc的游戏用H5来实现，而且想通过这么一个在玩法上有些创新的游戏，来完成一个webAduio的demo。目前web正在蓬勃发展，W3C也出了许多新的web标准，如webAudioApi，webAssembly，webAR，webGL等，这些都在发展阶段，在实际的应用中还没有广泛应用。所以希望通过这么一个demo，能够有更多想法，利用webAudio做出更多好玩有趣的应用。
