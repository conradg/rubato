/**
 * Created by Conrad on 04/03/14.
 */

var recorder;
var audio;
var context = new webkitAudioContext();
var buffer; // the current audio buffer we're analysing
var freqs;
var center;
var range = 2;
var score;
var auto_correl_count = 0;
var attempts = 0;
var debug_notes;
var debug_good_regions;
var amps;
var max_amp;
var amp_threshold = calibrateMicrophone();
var recording = false;
var segment_size = 1200;
var error = false;
var error_text = "";

var detected_pitch_m;
var detected_pitch_s;
var detected_cents;
var detected_frequency;
var start_pitch;
var target_pitch;
var num_windows;
var curr_window;
var debug = true;
var log_view = true;


var male_range_s = ["G1","G5"];
var female_range_s =  ["G3","F5"];
var male_range_m = [pitchSciToMIDI(male_range_s[0]),pitchSciToMIDI(male_range_s[1])];
var female_range_m = [pitchSciToMIDI(female_range_s[0]),pitchSciToMIDI(female_range_s[1])];

var interval = 0; //the size of the interval in semitones, negative indicates downwards interval
var max_correlation = 0;
var ACF = []; //store the current autocorrelationfunction
var ACFs = []; //store the autocorrelation functions for the active buffer

var T1_Bb2 = "/static/assets/test_pitches/male/normal_set_1/Bb2.wav"
var T1_C3  = "/static/assets/test_pitches/male/normal_set_1/C3.wav"
var T1_D3  = "/static/assets/test_pitches/male/normal_set_1/D3.wav"
var T1_E3  = "/static/assets/test_pitches/male/normal_set_1/E3.wav"
var T1_F3  = "/static/assets/test_pitches/male/normal_set_1/F3.wav"
var T1_G3  = "/static/assets/test_pitches/male/normal_set_1/G3.wav"
var T1_A3  = "/static/assets/test_pitches/male/normal_set_1/A3.wav"
var T1_B3  = "/static/assets/test_pitches/male/normal_set_1/B3.wav"
var T1_C4  = "/static/assets/test_pitches/male/normal_set_1/C4.wav"
var T1_D4  = "/static/assets/test_pitches/male/normal_set_1/D4.wav"
var T1_E4  = "/static/assets/test_pitches/male/normal_set_1/E4.wav"
var T1_F4  = "/static/assets/test_pitches/male/normal_set_1/F4.wav"

var T2_C3  = "/static/assets/test_pitches/male/normal_set_2/C3.wav"
var T2_Cs3 = "/static/assets/test_pitches/male/normal_set_2/Cs3.wav"
var T2_D3  = "/static/assets/test_pitches/male/normal_set_2/D3.wav"
var T2_Eb3 = "/static/assets/test_pitches/male/normal_set_2/Eb3.wav"
var T2_E3  = "/static/assets/test_pitches/male/normal_set_2/E3.wav"
var T2_F3  = "/static/assets/test_pitches/male/normal_set_2/F3.wav"
var T2_Fs3 = "/static/assets/test_pitches/male/normal_set_2/Fs3.wav"
var T2_G3  = "/static/assets/test_pitches/male/normal_set_2/G3.wav"
var T2_Ab3 = "/static/assets/test_pitches/male/normal_set_2/Ab3.wav"
var T2_A3  = "/static/assets/test_pitches/male/normal_set_2/A3.wav"
var T2_Bb3 = "/static/assets/test_pitches/male/normal_set_2/Bb3.wav"
var T2_B3  = "/static/assets/test_pitches/male/normal_set_2/B3.wav"
var T2_C4  = "/static/assets/test_pitches/male/normal_set_2/C4.wav"

var TW_E3 = "/static/assets/test_pitches/male/wobbly/E3.wav"
var TW_G3 = "/static/assets/test_pitches/male/wobbly/G3.wav"
var TW_G3_2 = "/static/assets/test_pitches/male/wobbly/G3_2.wav"
var TW_E3_vib = "/static/assets/test_pitches/male/wobbly/E3_vib.wav"
var TW_G3_vib = "/static/assets/test_pitches/male/wobbly/G3_vib.wav"

var DN1_G2  =  "/static/assets/test_pitches/male/david/normal_1/G2.wav"
var DN1_A2  =  "/static/assets/test_pitches/male/david/normal_1/A2.wav"
var DN1_B2  =  "/static/assets/test_pitches/male/david/normal_1/B2.wav"
var DN1_C3  =  "/static/assets/test_pitches/male/david/normal_1/C3.wav"
var DN1_D3  =  "/static/assets/test_pitches/male/david/normal_1/D3.wav"
var DN1_E3  =  "/static/assets/test_pitches/male/david/normal_1/E3.wav"
var DN1_Fs3 =  "/static/assets/test_pitches/male/david/normal_1/Fs3.wav"
var DN1_G3  =  "/static/assets/test_pitches/male/david/normal_1/G3.wav"

var DV1_G2  =  "/static/assets/test_pitches/male/david/vibrato_1/G2.wav"
var DV1_A2  =  "/static/assets/test_pitches/male/david/vibrato_1/A2.wav"
var DV1_B2  =  "/static/assets/test_pitches/male/david/vibrato_1/B2.wav"
var DV1_C3  =  "/static/assets/test_pitches/male/david/vibrato_1/C3.wav"
var DV1_D3  =  "/static/assets/test_pitches/male/david/vibrato_1/D3.wav"
var DV1_E3  =  "/static/assets/test_pitches/male/david/vibrato_1/E3.wav"
var DV1_Fs3 =  "/static/assets/test_pitches/male/david/vibrato_1/Fs3.wav"
var DV1_G3  =  "/static/assets/test_pitches/male/david/vibrato_1/G3.wav"


var H1_C4 = "/static/assets/test_pitches/male/high_set_1/C4.wav"
var H1_Cs4 = "/static/assets/test_pitches/male/high_set_1/Cs4.wav"
var H1_D4 = "/static/assets/test_pitches/male/high_set_1/D4.wav"
var H1_Eb4 = "/static/assets/test_pitches/male/high_set_1/Eb4.wav"
var H1_E4 = "/static/assets/test_pitches/male/high_set_1/E4.wav"
var H1_F4 = "/static/assets/test_pitches/male/high_set_1/F4.wav"
var H1_Fs4 = "/static/assets/test_pitches/male/high_set_1/Fs4.wav"
var H1_G4 = "/static/assets/test_pitches/male/high_set_1/G4.wav"

var P_G2  = "/static/assets/test_pitches/piano/G2.wav"
var P_Ab2 = "/static/assets/test_pitches/piano/Ab2.wav"
var P_A2  = "/static/assets/test_pitches/piano/A2.wav"
var P_Bb2 = "/static/assets/test_pitches/piano/Bb2.wav"
var P_B2  = "/static/assets/test_pitches/piano/B2.wav"
var P_C3  = "/static/assets/test_pitches/piano/C3.wav"
var P_Cs3 = "/static/assets/test_pitches/piano/Cs3.wav"
var P_D3  = "/static/assets/test_pitches/piano/D3.wav"
var P_Eb3 = "/static/assets/test_pitches/piano/Eb3.wav"
var P_E3  = "/static/assets/test_pitches/piano/E3.wav"
var P_F3  = "/static/assets/test_pitches/piano/F3.wav"
var P_Fs3 = "/static/assets/test_pitches/piano/Fs3.wav"
var P_G3  = "/static/assets/test_pitches/piano/G3.wav"
var P_Ab3 = "/static/assets/test_pitches/piano/Ab3.wav"
var P_A3  = "/static/assets/test_pitches/piano/A3.wav"
var P_Bb3 = "/static/assets/test_pitches/piano/Bb3.wav"
var P_B3  = "/static/assets/test_pitches/piano/B3.wav"
var P_C4  = "/static/assets/test_pitches/piano/C4.wav"
var P_Cs4 = "/static/assets/test_pitches/piano/Cs4.wav"
var P_D4  = "/static/assets/test_pitches/piano/D4.wav"
var P_Eb4 = "/static/assets/test_pitches/piano/Eb4.wav"
var P_E4  = "/static/assets/test_pitches/piano/E4.wav"
var P_F4  = "/static/assets/test_pitches/piano/F4.wav"
var P_Fs4 = "/static/assets/test_pitches/piano/Fs4.wav"
var P_G4  = "/static/assets/test_pitches/piano/G4.wav"
var P_Ab4 = "/static/assets/test_pitches/piano/Ab4.wav"
var P_A4  = "/static/assets/test_pitches/piano/A4.wav"
var P_Bb4 = "/static/assets/test_pitches/piano/Bb4.wav"
var P_B4  = "/static/assets/test_pitches/piano/B4.wav"
var P_C5  = "/static/assets/test_pitches/piano/C5.wav"
var P_Cs5 = "/static/assets/test_pitches/piano/Cs5.wav"
var P_D5  = "/static/assets/test_pitches/piano/D5.wav"
var P_Eb5 = "/static/assets/test_pitches/piano/Eb5.wav"
var P_E5  = "/static/assets/test_pitches/piano/E5.wav"
var P_F5  = "/static/assets/test_pitches/piano/F5.wav"
var P_Fs5 = "/static/assets/test_pitches/piano/Fs5.wav"
var P_G5  = "/static/assets/test_pitches/piano/G5.wav"

var sine440 = "/static/assets/test_pitches/sine/440.wav"
var sine430 = "/static/assets/test_pitches/sine/430.wav"
var sine420 = "/static/assets/test_pitches/sine/420.wav"
var sine410 = "/static/assets/test_pitches/sine/410.wav"
var sine400 = "/static/assets/test_pitches/sine/400.wav"

var sine440n = "/static/assets/test_pitches/sine/440n.wav"
var sine430n = "/static/assets/test_pitches/sine/430n.wav"
var sine420n = "/static/assets/test_pitches/sine/420n.wav"
var sine410n = "/static/assets/test_pitches/sine/410n.wav"
var sine400n = "/static/assets/test_pitches/sine/400n.wav"

var sine440nl = "/static/assets/test_pitches/sine/440nl.wav"

var piano1 = [P_G2,P_Ab2,P_A2,P_Bb2,P_B2,P_C3,P_Cs3,P_D3,P_Eb3,P_E3,P_F3,P_Fs3];
var piano2 = [P_G3,P_Ab3,P_A3,P_Bb3,P_B3,P_C4,P_Cs4,P_D4,P_Eb4,P_E4,P_F4,P_Fs4];
var piano3 = [P_G4,P_Ab4,P_A4,P_Bb4,P_B4,P_C5,P_Cs5,P_D5,P_Eb5,P_E5,P_F5,P_Fs5,P_G5];

var piano = piano1.concat(piano2,piano3);

var male_normal_1 = [T1_Bb2,T1_C3,T1_D3,T1_E3,T1_F3,T1_G3,T1_A3,T1_B3,T1_C4,T1_D4,T1_E4,T1_F4];
var male_normal_2 = [T2_C3,T2_Cs3,T2_D3,T2_Eb3,T2_E3,T2_F3,T2_Fs3,T2_G3,T2_Ab3,T2_A3,T2_Bb3,T2_B3,T2_C4];
var male_wobbly = [TW_E3,TW_G3,TW_G3_2,TW_E3_vib,TW_G3_vib];
var david_normal_1 = [DN1_G2,DN1_A2,DN1_B2,DN1_C3,DN1_D3,DN1_E3,DN1_Fs3,DN1_G3];
var david_vibrato_1 = [DV1_G2,DV1_A2,DV1_D3,DV1_E3,DV1_Fs3];
var male_high = [H1_C4, H1_Cs4, H1_D4, H1_Eb4, H1_E4, H1_F4, H1_Fs4, H1_G4]


var normal = male_normal_1.concat(male_normal_2,david_normal_1);
var david = david_normal_1.concat(david_vibrato_1);
var all = normal.concat(male_wobbly, david, male_high);


var testAudioURLs  = [T1_D3];

var numURLs        = testAudioURLs.length;
var expectedValues = new Array(numURLs);
var actualValues   = new Array(numURLs);

var times_to_test = 1;
var iteration = 0;
var test_seconds = new Array(times_to_test);
var test_results = [];
var start_time;
var verbose = true;

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
    start_time = new Date().getTime();
    testPitchDetection_h(0);
}

function testPitchDetection_h(i){
    pitchDetect(testAudioURLs[i], function(){
        actualValues[i] = [detected_pitch_s,detected_cents];

        if (i == numURLs-1){
            var correct = 0;
            var results = "";
            for (var j = 0; j < numURLs; j++){
                if (expectedValues[j] == actualValues[j][0]){
                    correct ++;
                } else {
                    results += "WRONG! ";
                }
                var pitch_s = actualValues[j][0];
                var cents = actualValues[j][1];
                results +="Expected: " + expectedValues[j] + " Got: " + pitch_s + " " + cents + " cents" + "\n";
            }
            if (verbose) {
                console.log(results);
                console.log("Percentage correct: " + correct*100/numURLs + "% with " +  numURLs + " test cases");
            }
            var time_taken = (new Date().getTime() - start_time)/1000;
            test_seconds[iteration] = time_taken;
            var result = "Time taken: " + time_taken + " seconds, or " + (time_taken/numURLs) + " seconds per sample"
            console.log(result);
            $("#pitch").text(result);
            //increment iteration and start next test cycle;
            iteration++;
            if (iteration < times_to_test){
                testPitchDetection();
            }
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
    recording = true;
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

function toggleRecording(){
    if (recording){
        stopRecording(
            function (s) {
                var blob = s;
                var url = window.URL.createObjectURL(blob);
                updatePitchDisplay(url);
    });
    } else {
        startRecording()
        error = false;
    }
}
function startRecording() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true}, onSuccess, onFail);
    } else {
        console.log('navigator.getUserMedia not present');
    }
}

//stops recording and sets the detected_pitch value in the browser to the detected detected_pitch
function stopRecording(callback) {
    recorder.stop();
    recording = false;
    recorder.exportWAV(callback);
}

//runs detected_pitch detection on the audio found at the url and updates the detected_pitch display on the page
function updatePitchDisplay(url){
    pitchDetect(url, function(){
        if(!error){
            sendAndGetScore()
          //  $("#pitch").text(detected_pitch_s);
        } else{
            $("#pitch").text(error_text);
            return
        }

    });
}

//calculates a score based on the value in the detected_pitch variable, the starting note, and the interval
function calculateScore(){
    difference = Math.abs(detected_pitch_m-target_pitch)
    perfect_score = 0.1
    how_far_from_perfect = Math.max(difference-perfect_score,0);
    score = 1 - (how_far_from_perfect);
    score = Math.max(score,0);
    console.log("score: " + score);
    var flat_sharp = detected_pitch_m>target_pitch ? "sharp" : "flat"
    if (score==0){
        if (difference>11 && difference < 13){
            $("#pitch").text("Looks like you're singing in the wrong octave!")
        } else {
            $("#pitch").text("It seems like you're singing the wrong note, try again")
        }
    } else if (score<0.3){
        $("#pitch").text("You're quite " + flat_sharp + "!")
    } else if (score<0.7){
        $("#pitch").text("A little " + flat_sharp + " but pretty good")
    } else if (score<1){
        $("#pitch").text("Good job!")
    } else if (score==1){
        $("#pitch").text("Perfect Score!");
    }
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
    var i = interval;
    $.post('/interval/send_score', {score: score.toString(), interval: i.toString()}, function(data){
        console.log("Score saved at " + data)
     });
}

function sendAndGetScore(){
    var i = interval;
    $.post('/interval/send_score', {score: score.toString(), interval: i.toString()}, function(){
        if (score == 0){
            attempts++;
            if (attempts==3){
                playAnswer()
                $('#pitch').text("Sorry, you got it wrong too many times!")
                setTimeout(function(){
                    getInterval()
                },5000);
                attempts=0;
            }
        } else {
            getInterval()
        }
     });
}


function sendPerfectScore(){
    var i = interval;
    $.post('/interval/send_score', {score: "1", interval: i.toString()}, function(data){
        console.log("level" + data)
     });
}

function sendZeroScore(){
    var i = interval;
    $.post('/interval/send_score', {score: "0", interval: i.toString()}, function(data){
        console.log("Score saved at " + data)
     });
}

function getInterval(){
    $.get('/interval/get_interval', function(data){
        var json = JSON.parse(data);
        interval = json.semitones;
        var name = json.name;
        var direction = json.direction;
        $("#interval_text").text(name + " " + direction);
        start_pitch = calculateStartPitch();
        target_pitch = start_pitch + interval;
        updateVex(start_pitch, target_pitch);
     }, "json");
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

    num_windows = Math.floor(audioData.length/segment_size);

    amps = new Array(num_windows);
    freqs = new Array(num_windows)


    if (debug){
        max_correlation = 0;
        ACFs = new Array(num_windows)
        debug_notes = new Array(num_windows)
        debug_good_regions = new Array(num_windows);
    }

    var audio_window;

    //run autocorrelation over each audio_window
    for (var i=0; i<num_windows; i++){

        audio_window = audioData.subarray(i*segment_size,(i+1)*segment_size);
        var freq = autoCorrelate(audio_window,sampleRate);
        freqs[i] = freq;

        var square_window = [];
        for (var sample in audio_window){
            square_window.push(audio_window[sample]*audio_window[sample]);
        }
        amps[i] = Math.sqrt(arrayAverage(square_window));

        if (debug){
            curr_window = i;
            ACFs[i] = ACF;
        }

        var note = freqToPitch_s_cents(freq);
        if (debug) debug_notes[i] = note;
    }
    max_amp = arrayMax(amps);
    if (max_amp < amp_threshold * 2){
        error_text =  "Too quiet! Please try again with gusto"
        error = true;

    }

    //isolate good regions//

    // put well recorded/detected regions into blocks and add them to a variable good_blocks.
    // a good region is defined to be one who's standard deviation is less than the average of the block
    //

    freqs = medianFilter(freqs,3);

    var slice_size = 5;
    var std_dev_threshold = 0;

    var block = new Block(0,0,[]); //the current audio_window freq values in the pitch detection
    var good_blocks = []; // all blocks in the sample.
    var in_region = false; //are we in a good region at the moment
    var last_pushed_index = 0;
    for (var i=0; i<=num_windows-slice_size; i++){
        var slice = freqs.slice(i, i+slice_size);
        var average = arrayAverage(slice);
        std_dev_threshold = Math.max(average/30,1);
        var std_dev = stdDev(slice);
        var in_threshold = std_dev<std_dev_threshold;
        if (in_threshold){
            if (!in_region){ //if we weren't in a region, then enter a new one
                var avg_slice_freq = arrayAverage(slice);
                if (reasonablePitch((avg_slice_freq), true) && reasonableVolume(amps[i])){
                    in_region = true;
                    var block = new Block(Math.max(last_pushed_index+1,i),0,[]);
                    for (var j=0; j<slice_size-1; j++){
                        var index = i + j;
                        if (index <= last_pushed_index){ //make sure we're not overlapping with old block
                            continue;
                        }

                        block.data.push(freqs[index]);
                        last_pushed_index = index;
                    }
                } else {
                    continue;
                }
            }
            if (in_region){
                index = i + slice_size - 1;
                if (index <= last_pushed_index){
                    continue;
                }
                block.data.push(freqs[index])
                last_pushed_index = index;
            }
        } else { //Leave good region, push the block to the good blocks. start a new block
            if (in_region){
                in_region = false;
                block.end = last_pushed_index;
                good_blocks.push(block);
                block = null
            } else { // otherwise we're still just in junk.
                continue
            }
        }
    }
    if (block) {
        block.end=num_windows-1;
        block.data.push(freqs[num_windows-1]);
        good_blocks.push(block);
    } //if we leave the loop while still building the block, then finish the block
    var contiguous_regions = mergeBlocks(good_blocks);
    var authoritative_region = getAuthoritativeRegion(contiguous_regions);
    if (authoritative_region[1]){
        detected_frequency = arrayAverage(authoritative_region[0].data);
    } else{
        detected_frequency = arrayAverage(authoritative_region[0].data);
    }
    authoritative_region = authoritative_region[0];
    if (debug) {
        for (var j = authoritative_region.start; j <= authoritative_region.end; j++){
            debug_good_regions[j] = [j];
        }
    }

    center = detected_frequency;
    var detected_pitch_s_cents = freqToPitch_s_cents(detected_frequency);
    detected_pitch_m = freqToPitch_m(detected_frequency);
    detected_pitch_s = detected_pitch_s_cents[0];
    detected_cents   = detected_pitch_s_cents[1];
    calculateScore()
    if (detected_frequency == NaN){
        error = true;
        error_text = "Woah! Something went wrong there... Please try again"
    }
    if(debug)updateDisplays();
}

//returns the frequency of a 1000 sample long window.
function autoCorrelate(buf, sampleRate){

    var MIN_SAMPLES = 48;	// corresponds to an 1.2kHz signal i.e. C6
    var MAX_SAMPLES = 600; // corresponds to an 80hz signal i.e. E2
    var SIZE = segment_size;
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
    var x1 = best_offset - 1;
    var x2 = best_offset;
    var x3 = best_offset + 1;

    var f1 = ACF[best_offset-MIN_SAMPLES-1]
    var f2 = ACF[best_offset-MIN_SAMPLES]
    var f3 = ACF[best_offset-MIN_SAMPLES+1]

    var B23 = x2*x2-x3*x3;
    var B31 = x3*x3-x1*x1;
    var B12 = x1*x1-x2*x2;

    var y23 = x2-x3;
    var y31 = x3-x1;
    var y12 = x1-x2;

    var qerp =(B23*f1 + B31*f2 + B12*f3)/(2*(y23*f1 + y31*f2 + y12*f3));

    auto_correl_count++;
    return sampleRate/qerp;
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
            break;
        case "C#" || "Db":
            pitch = 1;
            break;
        case "D":
            pitch = 2;
            break;
        case "D#" || "Eb":
            pitch = 3;
            break;
        case "E":
            pitch = 4;
            break;
        case "F":
            pitch = 5;
            break;
        case "F#" || "Gb":
            pitch = 6;
            break;
        case "G":
            pitch = 7;
            break;
        case "G#" || "Ab":
            pitch = 8;
            break;
        case "A":
            pitch = 9;
            break;
        case "A#" || "Bb":
            pitch = 10;
            break;
        case "B":
            pitch = 11;
            break;
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

function pitchMIDItoSci(pitch){
    var pitch12 = pitch%12
    var octave = Math.floor(pitch/12) - 1;
    switch(pitch12){
        case 0:
            return "C" + octave
        case 1:
            return "C#" + octave
        case 2:
            return "D" + octave
        case 3:
            return "Eb" + octave
        case 4:
            return "E" + octave
        case 5:
            return "F" + octave
        case 6:
            return "F#" + octave
        case 7:
            return "G" + octave
        case 8:
            return "Ab" + octave
        case 9:
            return "A" + octave
        case 10:
            return "Bb" + octave
        case 11:
            return "B" + octave
        default:
            return null;
    }
}

function pitchMIDItoVex(pitch){
    var sci = pitchMIDItoSci(pitch)
    var pitch = sci.slice(0,sci.length-1)
    var octave = sci[sci.length-1] - - 1
    return pitch.toLowerCase() + "/" + octave
}

function reasonableRange(pitch){
    var gender =  "male";
    if (gender == "male"){
        return pitch>=male_range_m[0] && pitch<=male_range_m[1];
    } else {
        return pitch>=female_range_m[1] && pitch<=female_range_m[1];
    }
}
function reasonablePitch(pitch, is_freq){
    if (is_freq)
        pitch = freqToPitch_m(pitch);
    return reasonableRange(pitch);
}

function reasonableVolume(amp){
    return amp>amp_threshold;
}
function updateCorrelation() {

    var canvas = $("#correlation_canvas")[0];

    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;

    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    var analyserContext = canvas.getContext('2d');

    var BAR_WIDTH = 1;
    var numBars = ACF.length;
    var mid = canvasHeight/2;

    analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw ACF.
    for (var i = 0; i < numBars; ++i) {
        var multiplier = -1*mid/max_correlation;
        var magnitude = ACF[i]*multiplier;
        analyserContext.fillStyle = "#00FF00"
        analyserContext.fillRect(i*BAR_WIDTH, mid, BAR_WIDTH, magnitude);
    }


    // Draw estimated fundamental frequency
    var freq = freqs[curr_window];
    var lag = Math.floor(48000/freq);
    analyserContext.fillStyle = "#FF0000";
    analyserContext.fillRect(lag-48, 0, 1, canvasHeight);


    var window_pitch = freqToPitch_s_cents(freqs[curr_window]);
    $("#window").text("window: " + curr_window + "/" + (num_windows-1));
    $("#window_pitch").text(window_pitch[0] + " " + window_pitch[1] + " cents");
}

function updateFrequency(){
    var canvas = $("#frequency_canvas")[0];

    var spacing = 0;
    var BAR_WIDTH = Math.floor(canvas.clientWidth/num_windows) - spacing;

    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;

    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var analyserContext = canvas.getContext('2d');


    analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);

    var freq = freqs[curr_window];
    analyserContext.fillStyle = "rgba(255, 255, 255, 0.8 )";
    analyserContext.fillRect(curr_window*(BAR_WIDTH+spacing), 0, BAR_WIDTH, canvasHeight);

    // Draw Frequencies.
    for (var i = 0; i < num_windows; i++) {

        var mid = canvasHeight/2;

        function freqToBar(freq, log_view){
            if (log_view){
                var m =  mid/Math.log(range)
                var c = mid*(1-Math.log(center)/Math.log(range))
            }
            else {
                var m = 70;
                var c = 280;
            }
            return  m * Math.log(freq) + c;

        }

        var magnitude = freqToBar(freqs[i], log_view)

        if (debug_good_regions[i]){ //If it is a "good region", make it green, else red
            analyserContext.fillStyle = "#00FF00"
        } else {
            analyserContext.fillStyle = "#FF0000"
        }
        analyserContext.fillRect(i*(BAR_WIDTH+spacing), canvasHeight, BAR_WIDTH, -magnitude);

    }

    // Draw estimated fundamental frequency

    var sciPitch = freqToPitch_s_cents(freq)

    $("#frequency").text("frequency: " + Math.floor(freq*10)/10 + " pitch: " + sciPitch[0] +" " + sciPitch[1] + "cents" );

}

function updateAmplitude(){
    var canvas = $("#amplitude_canvas")[0];

    var BAR_WIDTH = Math.floor(canvas.clientWidth/num_windows);

    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;

    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var analyserContext = canvas.getContext('2d');


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



    $("#amplitude").text("amplitude: " + Math.floor(amp*100000)/100000);

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
    } else if (key == 67){ //c key
        curr_window = num_windows-1;
    } else if (key == 87){ // w key
        range = range + (range-1)*0.2;
    } else if (key == 83){ // s key
        range = range - (range-1)*0.2
    } else if (key == 69){ // e
        center -= 5*(range-1);
    } else if (key == 68){ // d
        center += 5*(range-1);
    } else if (key == 27){
        hideHelp();
    } else {
        return
    }
    ACF = ACFs[curr_window]
    updateDisplays()
}}

function showHelp(){
    $("#help").fadeIn(200);

}

function hideHelp(){
    $("#help").fadeOut(200);
}

function updateDisplays(){
    updateCorrelation();
    updateFrequency();
    updateAmplitude();
}
function arrayAverage(array){
    var acc = 0;
    for (var x=0; x<array.length; x++){
        acc += array[x];
    }

    return (acc/array.length);
}

function stdDev(array){
    var average = arrayAverage(array);
    var sq_diff_acc = 0;
    for (var i=0; i<array.length; i++){
        sq_diff_acc += Math.pow((array[i] - average),2);
    }
    return Math.sqrt(sq_diff_acc/array.length);
}

function arrayMax(numArray) {
    return Math.max.apply(null, numArray);
}

function Block(start, end, data){
    this.start = start;
    this.end = end;
    this.data = data;
}

function mergeBlocks(blocks){
    var merged_blocks = [blocks.pop()];
    while (blocks.length>0){
        var merged = merged_blocks.pop();
        var block =  blocks.pop()
        var merged_first = merged.data[0];
        var block_last = block.data[block.data.length-1];
        var ratio = merged_first/block_last;
        if (merged.start == block.end + 1 && (Math.max(ratio,1/ratio) <1.05) ){
            var contiguous_block = new Block(block.start, merged.end, block.data.concat(merged.data));
            merged_blocks.push(contiguous_block);
        } else {
            merged_blocks.push(merged);
            merged_blocks.push(block);
        }
    }
    return merged_blocks;
}

function getAuthoritativeRegion(regions){
    var good_data_size = 0 ;
    for (var i = 0; i<regions.length; i++){
        good_data_size+= regions[i].data.length;
    }
    var largest_region = 0;
    var largest_index = 0;
    for (var i = 0; i<regions.length; i++){
        if (regions[i].data.length>largest_region){
            largest_index = i;
            largest_region = regions[i].data.length;
        }
    }
    if (largest_region>0.6*good_data_size){
        return [regions[largest_index],true];
    } else return [regions[largest_index],false];

}

function medianFilter(signal,window_size){
    if (!window_size%2){
        console.log("error: median filter must have odd window_size")
    }
    var medians = new Array(signal.length);
    for (var i = 0; i<signal.length; i++){
        var mid = Math.floor(window_size/2);
        var startIndex = i - mid;
        var median_window = new Array(window_size);
        for (var j = 0; j <window_size; j++){
            if (startIndex + j < 0){
                median_window[j] = signal[0]
            } else if (startIndex + j >= signal.length){
                median_window[j] = signal[signal.length];
            } else{
                median_window[j] = signal[startIndex + j];
            }
        }
        var med = median(median_window);
        if (median_window[mid] > Math.pow(med,1.03) || median_window[mid] < Math.pow(med,0.97)){
            medians[i] = (median_window[mid-1]+median_window[mid+1])/2;
            signal[i] = medians[i];
        } else {
            medians[i] = signal[i];
        }
    }

    return medians;
}

function median(values) {

    var sorted = values.slice(0);
    sorted.sort( function(a,b) {return a - b;} );

    var half = Math.floor(sorted.length/2);

    if(sorted.length % 2)
        return sorted[half];
    else
        return (sorted[half-1] + sorted[half]) / 2.0;
}

function calibrateMicrophone(){
    return 0.02
}

function playNote(pitch){
    var delay = 0; // play one note every quarter second
    var note = pitch; // the MIDI note
    var velocity = 127; // how hard the note hits
    // play the note
    MIDI.setVolume(0, 127);
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + 0.75);
}

function playAnswer(){
    playNote(start_pitch)
    setTimeout(function(){
        playNote(target_pitch)}, 1000
    )
    setTimeout(function(){
        playNote(start_pitch);
        playNote(target_pitch)}, 2000
    )
}

function toggleDisplays(){
    $("#displays").toggle()
}

function updateVex(start_pitch,target_pitch){
    var start_pitch_vex = pitchMIDItoVex(start_pitch);
    var target_pitch_vex = pitchMIDItoVex(target_pitch);

    var canvas = $("#vexflow")[0];
    var renderer = new Vex.Flow.Renderer(canvas,
    Vex.Flow.Renderer.Backends.CANVAS);

    var ctx = renderer.getContext();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var stave = new Vex.Flow.Stave(10, 0, 300);
    stave.addClef("treble").setContext(ctx).draw();

    var notes = []
    if (start_pitch_vex.length != 4){
        notes.push(new Vex.Flow.StaveNote({ keys: [start_pitch_vex], duration: "h" }))
    } else{
        notes.push(new Vex.Flow.StaveNote({ keys: [start_pitch_vex], duration: "h" }).addAccidental(0,new Vex.Flow.Accidental(start_pitch_vex[1])))
    }
    if (target_pitch_vex.length != 4){
        notes.push(new Vex.Flow.StaveNote({ keys: [target_pitch_vex], duration: "h" }))
    } else{
        notes.push(new Vex.Flow.StaveNote({ keys: [target_pitch_vex], duration: "h" }).addAccidental(0,new Vex.Flow.Accidental(target_pitch_vex[1])))
    }

    var voice = new Vex.Flow.Voice({
        num_beats: 4,
        beat_value: 4,
        resolution: Vex.Flow.RESOLUTION
    });

    voice.addTickables(notes);

    var formatter = new Vex.Flow.Formatter().
        joinVoices([voice]).format([voice], 300);

    voice.draw(ctx, stave);
}