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
var amps;
var max_amp;

var detected_pitch_m;
var detected_pitch_s;
var detected_cents;
var detected_frequency;
var start_pitch;
var target_pitch;
var num_windows;
var curr_window;
var debug = false;
var log_view = false;

var interval = 0; //the size of the interval in semitones, negative indicates downwards interval
var max_correlation = 0;
var ACF = []; //store the current autocorrelationfunction
var ACFs = []; //store the autocorrelation functions for the active buffer

var T1_Bb2 = "/static/assets/test_pitches/male/normal_set_1/Bb2.wav"
var T1_C3 = "/static/assets/test_pitches/male/normal_set_1/C3.wav"
var T1_D3 = "/static/assets/test_pitches/male/normal_set_1/D3.wav"
var T1_E3 = "/static/assets/test_pitches/male/normal_set_1/E3.wav"
var T1_F3 = "/static/assets/test_pitches/male/normal_set_1/F3.wav"
var T1_G3 = "/static/assets/test_pitches/male/normal_set_1/G3.wav"
var T1_A3 = "/static/assets/test_pitches/male/normal_set_1/A3.wav"
var T1_B3 = "/static/assets/test_pitches/male/normal_set_1/B3.wav"
var T1_C4 = "/static/assets/test_pitches/male/normal_set_1/C4.wav"
var T1_D4 = "/static/assets/test_pitches/male/normal_set_1/D4.wav"
var T1_E4 = "/static/assets/test_pitches/male/normal_set_1/E4.wav"
var T1_F4 = "/static/assets/test_pitches/male/normal_set_1/F4.wav"

var T2_C3 = "/static/assets/test_pitches/male/normal_set_2/C3.wav"
var T2_Cs3 = "/static/assets/test_pitches/male/normal_set_2/Cs3.wav"
var T2_D3 = "/static/assets/test_pitches/male/normal_set_2/D3.wav"
var T2_Eb3 = "/static/assets/test_pitches/male/normal_set_2/Eb3.wav"
var T2_E3 = "/static/assets/test_pitches/male/normal_set_2/E3.wav"
var T2_F3 = "/static/assets/test_pitches/male/normal_set_2/F3.wav"
var T2_Fs3 = "/static/assets/test_pitches/male/normal_set_2/Fs3.wav"
var T2_G3 = "/static/assets/test_pitches/male/normal_set_2/G3.wav"
var T2_Ab3 = "/static/assets/test_pitches/male/normal_set_2/Ab3.wav"
var T2_A3 = "/static/assets/test_pitches/male/normal_set_2/A3.wav"
var T2_Bb3 = "/static/assets/test_pitches/male/normal_set_2/Bb3.wav"
var T2_B3 = "/static/assets/test_pitches/male/normal_set_2/B3.wav"
var T2_C4 = "/static/assets/test_pitches/male/normal_set_2/C4.wav"

var TW_E3 = "/static/assets/test_pitches/male/wobbly/E3.wav"
var TW_G3 = "/static/assets/test_pitches/male/wobbly/G3.wav"
var TW_G3_2 = "/static/assets/test_pitches/male/wobbly/G3_2.wav"
var TW_E3_vib = "/static/assets/test_pitches/male/wobbly/E3_vib.wav"
var TW_G3_vib = "/static/assets/test_pitches/male/wobbly/G3_vib.wav"

var TH_G4 = "/static/assets/test_pitches/male/high_set_1/G4.wav"

var male_normal_set_1 = [T1_Bb2,T1_C3,T1_D3,T1_E3,T1_F3,T1_G3,T1_A3,T1_B3,T1_C4,T1_D4,T1_E4,T1_F4];
var male_normal_set_2 = [T2_C3,T2_Cs3,T2_D3,T2_Eb3,T2_E3,T2_F3,T2_Fs3,T2_G3,T2_Ab3,T2_A3,T2_Bb3,T2_B3,T2_C4];
var test_set_w = [TW_E3,TW_G3,TW_G3_2,TW_E3_vib,TW_G3_vib];

var normal = male_normal_set_1.concat(male_normal_set_2);
var all = normal.concat(test_set_w);

var testAudioURLs  = [TH_G4];

var numURLs        = testAudioURLs.length;
var expectedValues = new Array(numURLs);
var actualValues   = new Array(numURLs);


getInterval();


function testPitchDetection(){
    for (var i = 0; i<numURLs; i++){
        var x = testAudioURLs[i];
        var start_index = x.lastIndexOf("/")+1;
        var und_index = x.slice(start_index).indexOf("_") + start_index;
        if (und_index == start_index-1){
            var end_index = x.indexOf(".wav")
        } else {
            var end_index = und_index;
        }
        expectedValues[i] = x.slice(start_index,end_index);
        var note = expectedValues[i]
        var sharp = expectedValues[i].indexOf("s")
        if (sharp != - 1 ){
            expectedValues[i] = note[0] + "#" + note[2];
        }
    }
    testPitchDetection_h(0);
}

function testPitchDetection_h(i){
    pitchDetect(testAudioURLs[i], function(){
        actualValues[i] = [detected_pitch_s,detected_cents];
        console.log(actualValues[i]);
        if (i == numURLs-1){
            var correct = 0;
            var results = "";
            for (var j = 0; j < numURLs; j++){
                if (expectedValues[j] == actualValues[j][0]){
                    correct ++;
                }
                var pitch_s = actualValues[j][0];
                var cents = actualValues[j][1];
                results +="Expected: " + expectedValues[j] + " Got: " + pitch_s + " " + cents + " cents" + "\n";
            }
            console.log("Percentage correct: " + correct*100/numURLs + "%");
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
    pitchDetect(url, function(err){
        if(!err){
            sendScore();
            getInterval()
            $("#pitch").text(detected_pitch_s);
        } else{
            return
        }

    });
}

//calculates a score based on the value in the detected_pitch variable, the starting note, and the interval
function calculateScore(){
    difference = Math.abs(detected_pitch_m-target_pitch)
    var score = 1 - Math.pow((0.8*difference-0.2),2);
    score = Math.min(Math.max(score,0),1);
    console.log("score: " + score);
    return(score);
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
    var i = interval;
    $.post('/interval/send_score', {score: score.toString(), interval: i.toString()}, function(data){
        console.log("Score saved at " + data)
     });
}

function getInterval(){
    $.get('/interval/get_interval', function(data){
        interval = parseInt(data);
        $("#interval_text").text(interval);
        start_pitch = calculateStartPitch();
        target_pitch = start_pitch + interval;
        console.log("Interval " + interval + " loaded from sever");
     });
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function calculateStartPitch(){
    var lower = 51;
    var upper = 58;

    var start_pitch = getRandomInt(lower,upper) - interval;

    return start_pitch;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

    amps = new Array(num_windows);
    freqs = new Array(num_windows)

    num_windows = Math.floor(audioData.length/1000);

    if (debug){
        max_correlation = 0;
        ACFs = new Array(num_windows)
        debug_notes = new Array(num_windows)
        debug_good_regions = new Array(num_windows);
    }

    var window;

    //run autocorrelation over each window
    for (var i=0; i<num_windows; i++){

        window = audioData.subarray(i*1000,(i+1)*1000);
        var freq = autoCorrelate(window,sampleRate);
        freqs[i] = freq;
        amps[i] = arrayMax(window);


        if (debug){
            curr_window = i;
            ACFs[i] = ACF;
        }

        var note = freqToPitch_s_cents(freq);
        notes[i] = note;
        if (debug) debug_notes[i] = note;
    }
    max_amp = arrayMax(amps);
    try{
        if (max_amp < 0.1){
            throw "Too quiet! Please try again with gusto"
        }
    } catch (err){
        $("#help").text(err);
        return err
    }

    //isolate good regions//

    var slice_size = 5;
    var std_dev_threshold = 0;
    var good_regions = [];

    var in_region = false;
    for (var i=0; i<num_windows-slice_size; i++){
        var slice = freqs.slice(i, i+slice_size);
        var average = arrayAverage(slice);
        std_dev_threshold = Math.max(average/80,1);
        var std_dev = stdDev(slice);
        var in_threshold = std_dev<std_dev_threshold;
        if (in_threshold){
            if (!in_region){
                var avg_slice_freq = arrayAverage(slice);
                if (reasonablePitch((avg_slice_freq), true) && reasonableVolume(amps[i])){
                    in_region = true;
                    for (var j=0; j<slice_size-1; j++){
                        var index = i + j;
                        good_regions.push(freqs[index])
                        if (debug) debug_good_regions[index] = freqs[index];
                    }
                } else {
                    continue;
                }
            }
            if (in_region){
                index = i + slice_size - 1;
                good_regions.push(freqs[index])
                if (debug) debug_good_regions[index] = freqs[index];
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
    if(debug)updateDisplays();
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
        if (!reasonablePitch(sampleRate/offset,true)){
            ACF[offset-MIN_SAMPLES] = correlation;
            continue;
        }
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
function reasonablePitch(pitch, is_freq){
    if (is_freq)
        pitch = freqToPitch_m(pitch);
    return reasonableRange(pitch);
}

function reasonableVolume(amp){
    return amp>max_amp*0.1;
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

    var freq = freqs[curr_window];
    analyserContext.fillStyle = "rgba(255, 255, 255, 0.8 )";
    analyserContext.fillRect(curr_window*BAR_WIDTH, 0, BAR_WIDTH, canvasHeight);

    // Draw Frequencies.
    for (var i = 0; i < num_windows; i++) {

        var mid = canvasHeight/2;
        var range = 1.2;

        function freqToBar(freq, log_view){
            if (log_view){
                var x = mid/Math.log(range);
                var y = mid*Math.log(detected_frequency/range)/Math.log(range);
            }
            else {
                var x = 70;
                var y = 280;
            }
            return  y - x * Math.log(freq);
        }

        var magnitude = freqToBar(freqs[i], log_view)

        if (debug_good_regions[i] != null){ //If it is a "good region", make it green, else red
            analyserContext.fillStyle = "#00FF00"
        } else {
            analyserContext.fillStyle = "#FF0000"
        }
        analyserContext.fillRect(i*BAR_WIDTH, canvasHeight, BAR_WIDTH, magnitude);
    }

    // Draw estimated fundamental frequency



    $("#frequency").text("frequency: " + Math.floor(freq*10)/10);

}

function updateAmplitude(){
    var canvas = $("#amplitude_canvas")[0];
    var BAR_WIDTH = 4;

    canvas.width = num_windows*BAR_WIDTH;
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var analyserContext = canvas.getContext('2d');

    var BAR_WIDTH = 4;

    analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);

    var amp = amps[curr_window];
    analyserContext.fillStyle = "rgba(255, 255, 255, 0.8 )";
    analyserContext.fillRect(curr_window*BAR_WIDTH, 0, BAR_WIDTH, canvasHeight);

    // Draw Frequencies.
    for (var i = 0; i < num_windows; i++) {

        var mid = canvasHeight/2;

        var magnitude = amps[i]/max_amp*mid;

        if (debug_good_regions[i] != null){ //If it is a "good region", make it green, else red
            analyserContext.fillStyle = "#00FF00"
        } else {
            analyserContext.fillStyle = "#FF0000"
        }
        analyserContext.fillRect(i*BAR_WIDTH, mid-magnitude, BAR_WIDTH, 2*magnitude);
    }

    // Draw estimated fundamental frequency



    $("#amplitude").text("amplitude: " + Math.floor(amp*1000)/1000);

}

if (debug) {window.onkeydown = function(e) {
    var key = e.keyCode;
    if (key == 37) { //left key
        curr_window = curr_window>0 ? curr_window-1 : curr_window
    } else if (key == 39) { //right key
        curr_window = curr_window<num_windows-1 ? curr_window+1 : curr_window
    } else if (key == 90){ //z key
        curr_window = 0;
    } else if (key == 88){ //x key
        curr_window = Math.round(num_windows/2);
    } else if (key == 67){ //x key
        curr_window = num_windows-1;
    } else {
        return
    }
    ACF = ACFs[curr_window]
    updateDisplays()
}}

function updateDisplays(){
    updateCorrelation();
    updateFrequency();
    updateAmplitude();
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

function arrayMax(numArray) {
    return Math.max.apply(null, numArray);
}

function playNote(){
    var delay = 0; // play one note every quarter second
    var note = start_pitch; // the MIDI note
    var velocity = 127; // how hard the note hits
    // play the note
    MIDI.setVolume(0, 127);
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + 0.75);
}

