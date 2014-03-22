var audio = new Audio();
// Hide default controls
audio.controls = false;
audio.autoplay = false;
audio.id = 'track';

// Update the playback timer
audio.ontimeupdate = function() {
    var currentSeconds = (Math.floor(this.currentTime % 60) < 10 ? '0' : '') + Math.floor(this.currentTime % 60);
    var currentMinutes = Math.floor(this.currentTime / 60);
    // As a side note, native getElementById is faster than jQuery's $ selector
    document.getElementById('timer').innerHTML = currentMinutes + " : " + currentSeconds;
};

var context = new webkitAudioContext();
var source;
var playingid = 1;

// Wait for window.onload to fire
window.addEventListener('load', function(e) {
    // Our <audio> element will be the audio source.
    source = context.createMediaElementSource(audio);

    conv = context.createConvolver();
    gain = context.createGain();

    // Gain to compensate for volume loss after convolution
    gain.gain.value = 15;

    // A convolver for each supported standard
    IEC1_15 = context.createConvolver();
    IEC1_7 = context.createConvolver();
    IEC2_15 = context.createConvolver();
    IEC2_7 = context.createConvolver();
    NAB_15 = context.createConvolver();
    NAB_7 = context.createConvolver();
    NAB_3 = context.createConvolver();

    // Setting the ID for each convolver
    IEC1_15.id = "IEC1_15";
    IEC1_7.id = "IEC1_7";
    IEC2_15.id = "IEC2_15";
    IEC2_7.id = "IEC2_7";
    NAB_15.id = "NAB_15";
    NAB_7.id = "NAB_7";
    NAB_3.id = "NAB_3";

    // Chaining the convolver in a round-robin fashion
    IEC1_7.next = IEC1_15;
    IEC1_15.next = IEC2_7;
    IEC2_7.next = IEC2_15;
    IEC2_15.next = NAB_15;
    NAB_15.next = NAB_7;
    NAB_7.next = NAB_3;
    NAB_3.next = IEC1_7;

    // Setting the (extimated) tape rotation speeds
    IEC1_15.speed = IEC2_15.speed = NAB_15.speed = - 360 * 1.5;
    IEC1_7.speed = IEC2_7.speed = NAB_7.speed = - 360 * 0.75;
    NAB_3.speed = - 360 * 0.375;

    // Function to request impulse responses .wav files
    function setImpResp(convolver) {
        var request = new XMLHttpRequest();
        request.open("GET", "/" + convolver.id + ".wav", true);
        request.responseType = "arraybuffer";
        request.onload = function() {
            convolver.buffer = context.createBuffer(request.response, false);
            console.log("Impulse response for convolver " + convolver.id + " loaded successfully.");
        };
        request.send();
    }

    // Loading impulse responses - TBCompleted
    setImpResp(IEC1_15);
    setImpResp(NAB_7);

    //source.connect(context.destination);
    // NOT NEEDED - Upong loading a track the connection is made automatically
    // We just need to connect each convolver to the gain and the gain to the destination
    source.connect(NAB_7);
    gain.connect(context.destination);
    
    // List playable files
    $.getJSON('http://localhost:3000/list', function(result) {
        $.each(result, function(key, track) {
            $('#selector').append('<option value="'+track.filename+'">['+track.ips+'] '+track.title+'</option>');
        });
        audio.src = 'http://localhost:3000/play/'+result[0].filename;
    });

}, false);

// Play - Stop - Prev - Next functions for the buttons
function play(element) {
    element.play();
    anim.start();
}

function stop(element) {
    element.pause();
    anim.stop();
}

function next() {
    var s = document.getElementById('selector');
    s.selectedIndex = (document.getElementById('selector').selectedIndex + 1) % s.length;
    if (s.selectedIndex === 0)
        s.selectedIndex = (document.getElementById('selector').selectedIndex + 1) % s.length;
    switchSong(s.value);
}

function prev() {
    var s = document.getElementById('selector');
    s.selectedIndex = ((s.selectedIndex - 1) % s.length + s.length) % s.length;
    if (s.selectedIndex === 0)
        s.selectedIndex = ((s.selectedIndex - 1) % s.length + s.length) % s.length;
    switchSong(s.value);
}

var currentEQ;
var currentSpeed;

function changeEQ(newEQ) {
    if (newEQ != currentEQ) {
        source.disconnect(currentEQ);
        source.connect(newEQ);
        newEQ.connect(gain);
        changeSpeed(newEQ.speed);
        currentSpeed = newEQ.speed;
        currentEQ = newEQ;
    }
}

function changeSpeed(newSpeed) {
    angularSpeed = newSpeed;
}

// TO DO: revert to original EQ
// maybe add a small "lightbulb" indicator
// also maybe lighting bulbs for play/pause/prev/next too

// Change the EQ with the IPS knob
function nextEQ(inEQ) {
    if (originalSpeed / inEQ.next.speed == 2) {
        audio.playbackRate = 0.5;
    }
    else if (originalSpeed / inEQ.next.speed == 0.5) {
        audio.playbackRate = 2.0;
    }
    else
        audio.playbackRate = 1.0;
    document.getElementById('kn').setAttribute('class', inEQ.next.id);
    changeEQ(inEQ.next);
}

var originalSpeed;

function switchSong(newSong) {
    var newEQ = newSong.split('.');
    var newConv;
    anim.stop();
    audio.src = 'http://localhost:3000/play/'+newSong;
    if (newEQ[0] == 'IEC1_15')
        newConv = IEC1_15;
    else if (newEQ[0] == 'IEC1_7')
        newConv = IEC1_7;
    else if (newEQ[0] == 'IEC2_15')
        newConv = IEC2_15;
    else if (newEQ[0] == 'IEC2_7')
        newConv = IEC2_7;
    else if (newEQ[0] == 'NAB_15')
        newConv = NAB_15;
    else if (newEQ[0] == 'NAB_7')
        newConv = NAB_7;
    else if (newEQ[0] == 'NAB_3')
        newConv = NAB_3;
    changeEQ(newConv);
    originalSpeed = newConv.speed;
    document.getElementById('kn').setAttribute('class', newConv.id);
    audio.playbackRate.value = 1.0;
    play(audio);
}