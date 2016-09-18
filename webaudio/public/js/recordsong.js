//recordsong
define('./js/recordsong',function( require, exports, module){
    exports = module.exports={
        init:function(audio){
            this.audio = audio;
            this.audioContext = this.getContext();
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.audioContext.destination);

    		navigator.getUserMedia = (navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
        },
        mediaRecorder:null,
        chunk:[],
        getContext: function() {
            return new AudioContext();;
        },
        getSpeaker:function () {
        	if(!navigator.getUserMedia){alert('不支持麦克风录音');return;}
        	navigator.getUserMedia({audio:true}, exports.onSuccess,exports.onError);
        },
        onSuccess:function (stream) {
        	exports.mediaRecorder = new MediaRecorder(stream);
        	exports.mediaRecorder.onstop = function (e) {
      			var blob = new Blob(exports.chunk, { 'type' : 'audio/wav;' }),
      			    url = window.URL.createObjectURL(blob);
        		exports.audio.src = url;
        	}
        	exports.mediaRecorder.ondataavailable = function (e) {
        		exports.chunk.push(e.data);
        	}
        },
        record:function () {
        	exports.chunk = [];
        	exports.mediaRecorder.start();
	      	console.log(exports.mediaRecorder.state);
        },
        stop:function () {
        	
        	exports.mediaRecorder.stop();
        },
        onError:function (err) {
        	console.log("err",err);
        }
    }
});