/**
 * Created by Conrad on 04/03/14.
 */

var recorder;
var audio;
var context = new webkitAudioContext();
var buffer; // the current audio buffer we're analysing
var debug_freqs;
var debug_notes;
var pitch;
var start_pitch;
var num_windows;
var curr_window;
var debug = true;

var interval = 0; //the size of the interval in semitones, negative indicates downwards interval
var ACF = []; //store the current autocorrelationfunction
var ACFs = []; //store the autocorrelation functions for the active buffer

var C3 = "/static/assets/test_pitches/C3.wav"
var D3 = "/static/assets/test_pitches/D3.wav"
var E3 = "/static/assets/test_pitches/E3.wav"
var F3 = "/static/assets/test_pitches/F3.wav"
var G3 = "/static/assets/test_pitches/G3.wav"
var A3 = "/static/assets/test_pitches/A3.wav"
var B3 = "/static/assets/test_pitches/B3.wav"
var C4 = "/static/assets/test_pitches/C4.wav"
var D4 = "/static/assets/test_pitches/D4.wav"
var E4 = "/static/assets/test_pitches/E4.wav"
var F4 = "/static/assets/test_pitches/F4.wav"

var test_set_all = [C3,D3,E3,F3,G3,A3,B3,C4,D4,E4,F4]

var testAudioURLs  = [F4];
var numURLs        = testAudioURLs.length;
var expectedValues = new Array(numURLs);
var actualValues   = new Array(numURLs);


function testPitchDetection(){
    for (var i = 0; i<numURLs; i++){
        var x = testAudioURLs[i];
        expectedValues[i] = x.slice(x.length-6,x.length-4);
    }
    testPitchDetection_h(0);
}

function testPitchDetection_h(i){
    pitchDetect(testAudioURLs[i], function(){
        actualValues[i] = pitch;
        if (i == numURLs-1){
            var correct = 0;
            var results = "";
            for (var j = 0; j < numURLs; j++){
                if (expectedValues[j] == actualValues[j]){
                    correct ++;
                }
                results += expectedValues[j] + " " + actualValues[j] + "\n";
            }
            console.log("Percentage correct = %" + correct*100/numURLs);
            console.log(results);
            return;
        } else {
            testPitchDetection_h(i+1);
        }
    })
}

var onFail = function(e) {
    console.log('Rejected!', e);
};

var onSuccess = function(s) {
    var mediaStreamSource = context.createMediaStreamSource(s);
    recorder = new Recorder(mediaStreamSource);
    recorder.record();
}

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


function toAudioBuffer(url, callback){
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        context.decodeAudioData(request.response, function(b) {
            buffer = b;
            callback();
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

//stops recording and sets the pitch value in the browser to the detected pitch
function stopRecording() {
    recorder.stop();
    var callback = function (s) {
        var blob = s;
        var url = window.URL.createObjectURL(blob);
        updatePitchDisplay(url);
    };
    recorder.exportWAV(callback);
}

//runs pitch detection on the audio found at the url and updates the pitch display on the page
function updatePitchDisplay(url){
    pitchDetect(url, function(){
        $("#pitch").text(pitch);
    });
}

//calculates a score based on the value in the pitch variable, the starting note, and the interval
function calculateScore(){
    return 1;
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// AJAX LOGIC ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var csrftoken = $.cookie('csrftoken');
console.log(csrftoken);

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    crossDomain: false, // obviates need for sameOrigin test
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

function sendScore(){
    var score = calculateScore();
    var timestamp = Date.now()
    $.post('/interval/score', {score: score.toString(), interval: interval.toString()}, function(data){
        console.log("Score saved at " + data)
     });
}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


//runs pitch detection on the audio found at the url and passes the callback on completion.
function pitchDetect(url, callback){
    toAudioBuffer(url, function(){
        pitch = getPitch(buffer);
        callback();
    })
}



var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}


//breaks a recording buffer into windows of 1000 samples and analyses each one, then combines them into one pitch reading
function getPitch(buf){
    var audioData = buf.getChannelData(0);
    var sampleRate = buf.sampleRate;
    var notes = [];

    num_windows = Math.floor(audioData.length/1000);

    if (debug == true){
        ACFs = new Array(num_windows)
        debug_freqs = new Array(num_windows)
        debug_notes = new Array(num_windows)
    }

    var window;
    var pop_table = [[],[]]; // [[note],[number of occurrences]]
    for (var i=0; i<num_windows; i++){
        window = audioData.subarray(i*1000,(i+1)*1000);
        var freq = autoCorrelate(window,sampleRate);

        if (debug == true){
            curr_window = i;
            debug_freqs[i] = freq
            ACFs[i] = ACF;
        }

        var note = freqToPitch(freq);
        notes[i] = note;
        debug_notes[i] = note;
        var index = pop_table[0].indexOf(note[0]);
        if (index == -1){
            pop_table[0].push(note[0]);
            pop_table[1].push(1);
        } else {
            pop_table[1][index]++;
        }
    }
    var mode;
    var mode_index = 0;
    for (var i=0; i<pop_table[0].length; i++){
        if (pop_table[1][i] >= pop_table[1][mode_index]){
            mode = pop_table[0][i];
            mode_index = pop_table[1][i];
        }
    }

    return mode;

}

//returns the frequency of a 1000 sample long window.
function autoCorrelate(buf, sampleRate){
    var MIN_SAMPLES = 40;	// corresponds to an 1.2kHz signal
    var MAX_SAMPLES = 500; // corresponds to a 96Hz signal
    var SIZE = 1000;
    var best_offset = -1;
    var best_correlation = 0;
    ACF = new Array(MAX_SAMPLES-MIN_SAMPLES+1) // store the autocorrelation function.

    for (var offset = MIN_SAMPLES; offset <= MAX_SAMPLES; offset++) {
        var correlation = 0;

        for (var n=0; n<SIZE-offset; n++) {
            correlation += (buf[n])*(buf[n+offset]);
        }
        correlation *= (SIZE-offset)/SIZE; //not sure what this does, some sort of optimisation?

        ACF[offset-MIN_SAMPLES] = correlation //populate the autocorrelation function

        if (correlation > best_correlation) {
            best_correlation = correlation;
            best_offset = offset;
        }
    }

    return sampleRate/best_offset;
}




function freqToPitch(freq){
    var pitch = 69+(12*Math.log(freq/440)/Math.LN2);
    var octave = Math.floor(pitch/12) - 1;
    var closest_note = Math.round(pitch);
    var cents = Math.floor((pitch - closest_note)*100);
    var letter = pitchToLetter(closest_note % 12);
    return [letter + octave, cents];
}

function pitchToLetter(pitch){
    switch(pitch){
        case 0:
            return "C"
        case 1:
            return "C#"
        case 2:
            return "D"
        case 3:
            return "Eb"
        case 4:
            return "E"
        case 5:
            return "F"
        case 6:
            return "F#"
        case 7:
            return "G"
        case 8:
            return "Ab"
        case 9:
            return "A"
        case 10:
            return "Bb"
        case 11:
            return "B"
        default:
            return null;
    }
}

function updateCorrelation() {

    var canvas = $("#correlation_canvas")[0];
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var analyserContext = canvas.getContext('2d');

    var BAR_WIDTH = 1;
    var numBars = ACF.length;

    analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw ACF.
    for (var i = 0; i < numBars; ++i) {
        var magnitude = ACF[i]*-1;
        analyserContext.fillStyle = "#00FF00"
        analyserContext.fillRect(i, canvasHeight/2, BAR_WIDTH, magnitude);
    }

    // Draw estimated fundamental frequency
    var freq = debug_freqs[curr_window];
    var lag = Math.floor(48000/freq);
    analyserContext.fillStyle = "#FF0000";
    analyserContext.fillRect(lag-40, 0, 1, canvasHeight);


    var window_pitch = freqToPitch(debug_freqs[curr_window]);
    $("#window").text("window: " + curr_window + "/" + (num_windows-1));
    $("#window_pitch").text(window_pitch[0] + " " + window_pitch[1] + " cents");
}

function updateFrequency(){
    var canvas = $("#frequency_canvas")[0];
    var BAR_WIDTH = 4;

    canvas.width = num_windows*BAR_WIDTH;
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var analyserContext = canvas.getContext('2d');

    var BAR_WIDTH = 4;
    var numBars = debug_freqs.length;

    analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw Frequencies.
    for (var i = 0; i < numBars; i++) {
        var magnitude = (debug_freqs[i]*-1)/10;
        analyserContext.fillStyle = "#00FF00"
        analyserContext.fillRect(i*BAR_WIDTH, canvasHeight, BAR_WIDTH, magnitude);
    }

    // Draw estimated fundamental frequency
    var freq = debug_freqs[curr_window];
    analyserContext.fillStyle = "rgba(255, 0, 0, 0.5 )";
    analyserContext.fillRect(curr_window*BAR_WIDTH, 0, BAR_WIDTH, canvasHeight);


    var window_pitch = freqToPitch(debug_freqs[curr_window]);
    $("#window").text("window: " + curr_window + "/" + (num_windows-1));
    $("#window_pitch").text(window_pitch[0] + " " + window_pitch[1] + " cents");

}


window.onkeydown = function(e) {
    var key = e.keyCode;
    if (key == 37) { //left key
        curr_window = curr_window>0 ? curr_window-1 : curr_window
    } else if (key == 39) { //right key
        curr_window = curr_window<num_windows-1 ? curr_window+1 : curr_window
    } else {
        return
    }
    ACF = ACFs[curr_window]
    updateCorrelation()
    updateFrequency()

}