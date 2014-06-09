/**
 * Created by Conrad on 04/03/14.
 */

var recorder;
var audio;
var context = new webkitAudioContext();
var buffer; // the current audio buffer we're analysing
var freqs;

var debug_notes;
var debug_good_regions;

var detected_pitch_m;
var detected_pitch_s;
var detected_cents;
var detected_frequency;
var start_pitch;
var target_pitch;
var num_windows;
var curr_window;
var debug = true;

var interval = 0; //the size of the interval in semitones, negative indicates downwards interval
var max_correlation = 0;
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

var testAudioURLs  = [B3];
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
        actualValues[i] = detected_pitch_s;
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

//stops recording and sets the detected_pitch value in the browser to the detected detected_pitch
function stopRecording() {
    recorder.stop();
    var callback = function (s) {
        var blob = s;
        var url = window.URL.createObjectURL(blob);
        updatePitchDisplay(url);
    };
    recorder.exportWAV(callback);
}

//runs detected_pitch detection on the audio found at the url and updates the detected_pitch display on the page
function updatePitchDisplay(url){
    pitchDetect(url, function(){
        $("#pitch").text(detected_pitch_s);
    });
}

//calculates a score based on the value in the detected_pitch variable, the starting note, and the interval
function calculateScore(){
    return 1;
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// AJAX LOGIC ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var csrftoken = $.cookie('csrftoken');

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


//runs detected_pitch detection on the audio found at the url and passes the callback on completion.
function pitchDetect(url, callback){
    toAudioBuffer(url, function(){
        getPitch(buffer);
        callback();
    })
}


// breaks a recording buffer into windows of 1000 samples and analyses each one, then combines them into one pitch,
// sets the detected pitch_m pitch_s and cents values;
function getPitch(buf){
    var audioData = buf.getChannelData(0);
    var sampleRate = buf.sampleRate;
    var notes = [];

    num_windows = Math.floor(audioData.length/1000);

    if (debug == true){
        max_correlation = 0;
        ACFs = new Array(num_windows)
        freqs = new Array(num_windows)
        debug_notes = new Array(num_windows)
        debug_good_regions = new Array(num_windows);
    }

    var window;

    var time1 = new Date().getTime();

    //run autocorrelation over each window
    for (var i=0; i<num_windows; i++){

        window = audioData.subarray(i*1000,(i+1)*1000);
        var freq = autoCorrelate(window,sampleRate);

        if (debug == true){
            curr_window = i;
            freqs[i] = freq
            ACFs[i] = ACF;
        }

        var note = freqToPitch_s_cents(freq);
        notes[i] = note;
        debug_notes[i] = note;
    }

    //isolate good regions//

    var slice_size = 5;
    var std_dev_threshold = 1;
    var good_regions = [];

    var in_region = false;
    for (var i=0; i<num_windows-slice_size; i++){
        var slice = freqs.slice(i, i+slice_size);
        var std_dev = stdDev(slice);
        var in_threshold = std_dev<std_dev_threshold;
        if (in_threshold){
            if (!in_region){
                var avg_slice_freq = arrayAverage(slice);
                var region_pitch_m = freqToPitch_m(avg_slice_freq);
                if (reasonablePitch(region_pitch_m)){
                    in_region = true;
                    for (var j=0; j<slice_size-1; j++){
                        var index = i + j;
                        good_regions.push(freqs[index])
                        debug_good_regions[index] = freqs[index];
                    }
                } else {
                    continue;
                }
            }
            if (in_region){
                index = i + slice_size - 1;
                good_regions.push(freqs[index])
                if (debug){
                    debug_good_regions[index] = freqs[index];
                }
            }
        } else {
            in_region = false;
        }
    }

    detected_frequency = arrayAverage(good_regions);
    var detected_pitch_s_cents = freqToPitch_s_cents(detected_frequency);
    detected_pitch_m = freqToPitch_m(detected_frequency);
    detected_pitch_s = detected_pitch_s_cents[0];
    detected_cents   = detected_pitch_s_cents[1];
    updateCorrelation()
    updateFrequency()
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
        var max = SIZE-offset;

        for (var n=0; n<max; n++) {
            correlation += (buf[n])*(buf[n+offset]);
        }

        ACF[offset-MIN_SAMPLES] = correlation //populate the autocorrelation function

        if (correlation > best_correlation) {
            best_correlation = correlation;
            best_offset = offset;
        }
        if (correlation > max_correlation){
            max_correlation = correlation;
        }
    }
    return sampleRate/best_offset;
}




function freqToPitch_s_cents(freq){
    var pitch_m = freqToPitch_m(freq);
    var closest_pitch_m = Math.round(pitch_m);
    var octave = Math.floor(closest_pitch_m/12) - 1;
    var cents = Math.floor((pitch_m - closest_pitch_m)*100);
    var letter = pitch12ToSci(closest_pitch_m % 12);

    return [letter + octave, cents];
}

function freqToPitch_m(freq){
    return 69+(12*Math.log(freq/440)/Math.LN2);
}

// converts from scientific notation e.g. C3, A4 etc. to MIDI notation where A440 is 69, and going up and down semitones
// increases or decreases that number respectively by 1, e.g. 57 is A220
function pitchSciToMIDI(sci){
    var letter = sci.slice(0,sci.length-1);;
    var octave = parseInt(sci[sci.length-1]);
    var pitch  = 0;
    switch(letter){
        case "C":
            pitch = 0;
        case "C#" || "Db":
            pitch = 1;
        case "D":
            pitch = 2;
        case "D#" || "Eb":
            pitch = 3;
        case "E":
            pitch = 4;
        case "F":
            pitch = 5;
        case "F#" || "Gb":
            pitch = 6;
        case "G":
            pitch = 7;
        case "G#" || "Ab":
            pitch = 8;
        case "A":
            pitch = 9;
        case "A#" || "Bb":
            pitch = 10;
        case "B":
            pitch = 11;
    }

    return (octave+1)*12 + pitch;
}

function pitch12ToSci(pitch){
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

function reasonableRange(pitch){
    var gender = $("#gender").text() || "male";
    if (gender == "male"){
        return pitch>=44 && pitch<=69;
    } else {
        return pitch>=57 && pitch<=69;
    }
}
function reasonablePitch(pitch){
    return reasonableRange(pitch);
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
        var multiplier = -1;
        var magnitude = ACF[i]*multiplier;
        analyserContext.fillStyle = "#00FF00"
        analyserContext.fillRect(i, canvasHeight/2, BAR_WIDTH, magnitude);
    }

    // Draw estimated fundamental frequency
    var freq = freqs[curr_window];
    var lag = Math.floor(48000/freq);
    analyserContext.fillStyle = "#FF0000";
    analyserContext.fillRect(lag-40, 0, 1, canvasHeight);


    var window_pitch = freqToPitch_s_cents(freqs[curr_window]);
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

    analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw Frequencies.
    for (var i = 0; i < num_windows; i++) {

        var mid = canvasHeight/2;
        var range = 1.1;
        var x = mid/Math.log(range);
        var y = mid*Math.log(detected_frequency/range)/Math.log(range);
        var z = freqs[i];
        var magnitude = y - x * Math.log(z);
        if (i==35){
            console.log("x:" + x);
            console.log("y:" + y);
            console.log("z:" + z);
            console.log("magnitude:" + magnitude);
        }

        if (debug_good_regions[i] != null){ //If it is a "good region", make it green, else red
            analyserContext.fillStyle = "#00FF00"
        } else {
            analyserContext.fillStyle = "#FF0000"
        }
        analyserContext.fillRect(i*BAR_WIDTH, canvasHeight, BAR_WIDTH, magnitude);
    }

    // Draw estimated fundamental frequency
    var freq = freqs[curr_window];
    analyserContext.fillStyle = "rgba(255, 0, 0, 0.5 )";
    analyserContext.fillRect(curr_window*BAR_WIDTH, 0, BAR_WIDTH, canvasHeight);


    $("#frequency").text("frequency: " + Math.floor(freq*10)/10);

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

function arrayAverage(array){
    acc = 0;
    for (var x=0; x<array.length; x++){
        acc += array[x];
    }

    return (acc/array.length);
}

function stdDev(array){
    average = arrayAverage(array);
    sq_diff_acc = 0;
    for (var i=0; i<array.length; i++){
        sq_diff_acc += Math.pow((array[i] - average),2);
    }
    return Math.sqrt(sq_diff_acc/array.length);
}