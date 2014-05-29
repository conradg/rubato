/**
 * Created by Conrad on 04/03/14.
 */

var recorder;
var audio;
var context = new webkitAudioContext();
var buffer;
var freqs;

var onFail = function(e) {
    console.log('Rejected!', e);
};

var onSuccess = function(s) {
    var context = new webkitAudioContext();
    var mediaStreamSource = context.createMediaStreamSource(s);
    recorder = new Recorder(mediaStreamSource);
    recorder.record();
}

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


function toAudioBuffer(){
    var url = window.URL.createObjectURL(audio);
    console.log(url);
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        context.decodeAudioData(request.response, function(b) {
            buffer = b;
        }, function(e){console.log("error in decoding data", e)});
    }
    request.send();
}

function startRecording() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true}, onSuccess, onFail);
    } else {
        console.log('navigator.getUserMedia not present');
    }
}

function stopRecording() {
    recorder.stop();
    var callback = function(s) {
        audio = s;
        toAudioBuffer();
        console.log(buffer);
        freqs = getPitch(buffer);
    }
    recorder.exportWAV(callback);
}



var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}


function getPitch(buf){
    var audioData = buf.getChannelData(0);
    var sampleRate = buf.sampleRate;
    var freqs = [];
    var windows = Math.floor(audioData.length/1000);
    var window;
    for (var i=0; i<windows; i++){
        window = audioData.subarray(i*1000,(i+1)*1000);
        freqs[i] = autoCorrelate(window,sampleRate);
    }

}

function autoCorrelate(buf, sampleRate){
    var MIN_SAMPLES = 40;	// corresponds to an 1.2kHz signal
    var MAX_SAMPLES = 500; // corresponds to a 96Hz signal
    var SIZE = 1000;
    var best_offset = -1;
    var best_correlation = 0;


    for (var offset = MIN_SAMPLES; offset <= MAX_SAMPLES; offset++) {
        var correlation = 0;

        for (var n=0; n<SIZE-offset; n++) {
            correlation += (buf[n])*(buf[n+offset]);
        }
        correlation *= (SIZE-offset)/SIZE;

        if (correlation > best_correlation) {
            best_correlation = correlation;
            best_offset = offset;
        }
    }

    return sampleRate/best_offset;
}