var AudioBox=function (playlist){
	var _this=this;
	var media= document.getElementById("audio");
	var index;
	var playingFile=null;
	var quBuyStatus=false;
	//播放
	this.play=function(){
		if(_this.quBuyStatus){
			location.href="/music/"+playlist[0].id+".html"
		}else{
            media.play();
		}
	}
	//暂停
	this.pause=function(){
		media.pause();
	}
	//播放当前一首
	this.playIndex=function(b){
		playingFile=playlist[b];
		media.setAttribute("src",playingFile.url);
		media.play();
	}
	//更新进度条和当前时间
	this.updateProgress = function() {
		var duraTime = media.duration;
		var curTime  = media.currentTime;
		var scale    = (curTime / duraTime)*100+"%";
		$(".audio-play-bar").width(scale);
		$(".audio-time-current").html(_this.timeChange(curTime));
		
	}
	//加载前准备
	this.loadStart=function(){
		$(".audio-progress strong").html(playingFile.title);
		$(".audio-info .albumtitle").html(playingFile.albumtitle);
		$(".audio-info .performer").html(playingFile.performer);
	}
	//加载完成准备
	this.loadOk=function(){
		$(".audio-time-current").html(_this.timeChange(media.currentTime));
		$(".audio-time-total").html(_this.timeChange(media.duration));
	}
	//监听播放
	this.playing=function(){
		setInterval(function(){
			_this.updateProgress();
		},1000);
		$(".audio-play").hide();
		$(".audio-pause").css('display','block');

	} 
	//暂停
	this. pausePaly=function(){
		$(".audio-pause").hide();
		$(".audio-play").css('display','block');
	}
	//加载出错
	this. loadError=function(){
		$(".audio-info strong").html("歌曲加载出错");
		//$(".audio-info b").html("3秒后自动播放下一首");
		setTimeout(function(){_this.next()},3000)
	}
	//初始化
	this.init=function(b,flag){
        _this.quBuyStatus=flag;
        if(!flag){
            for(var a in playlist){
                $(".audio-list ul").append("<li rel='"+playlist[a].id+"'>"+playlist[a].title+"<span>播放中</span></li>");
            }
            $(".audio-list ul li").on('click',function(){
                var b=$(this).index();
                _this.select(b);
            })
            if(b){
                index=b;
            }
            else{
                index=0
            }
            _this.playIndex(index);
		}
	}
	//转换时间格式
	this.timeChange=function(time){
		var minute = time / 60;
		var minutes = parseInt(minute);
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		var second = time % 60;
		seconds = parseInt(second);
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		var allTime = "" + minutes + "" + ":" + "" + seconds + "";
		return allTime;
	}
}
