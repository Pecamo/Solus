const MAX_SILENCE_TIME = 3 * 1000;
const THRESHOLD_PERCENT = 0.3;
const CURRENT_VOLUME_DIV = document.querySelector('#current-volume');
const THRESHOLD_VOLUME_DIV = document.querySelector('#threshold-volume');
window.AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();
let Meter = null;
let isRecording = false;

// TODO Placeholder
const fonctionDeKewinDousse = (res) => {
    console.log('Je suis la fonction!', res);
};

function onMicrophoneGranted(stream) {
    // Create an AudioNode from the stream.
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
    THRESHOLD_VOLUME_DIV.style.width = `${THRESHOLD_PERCENT * 100}%`;

    // Create a new volume meter and connect it.
    // createAudioMeter(audioContext, clipLevel, averaging, clipLag);
    Meter = createAudioMeter(audioContext, THRESHOLD_PERCENT, 0, MAX_SILENCE_TIME);
    
    mediaStreamSource.connect(Meter);

    // Trigger callback that shows the level of the "Volume Meter"
    onLevelChange();
}

function onLevelChange(time) {
    CURRENT_VOLUME_DIV.style.width = `${Meter.volume * 100}%`;
    if (Meter.checkClipping()) {
        if (!isRecording) {
            mic.start();
        }
        // console.warn(Meter.volume);
    } else {
        if (isRecording) {
            console.log("should stop");
            mic.stop();
        }
        // console.log(Meter.volume);
    }

    window.requestAnimationFrame(onLevelChange);
}

// Try to get access to the microphone
try {
    // Retrieve getUserMedia API with all the prefixes of the browsers
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // Ask for an audio input
    navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        },
        onMicrophoneGranted,
        () => alert('Stream generation failed.')
    );
} catch (e) {
    alert('getUserMedia threw exception :' + e);
}

let mic = new Wit.Microphone(document.getElementById("microphone"));
let info = function (msg) {
    document.getElementById("info").innerHTML = msg;
};
let error = function (msg) {
    document.getElementById("error").innerHTML = msg;
};
mic.onready = function () {
    info("Microphone is ready to record");
};
mic.onaudiostart = function () {
    isRecording = true;
    info("Recording started");
    error("");
};
mic.onaudioend = function () {
    isRecording = false;
    info("Recording stopped, processing started");
};
mic.onresult = function (res) {
    let ret = {};

    if (!res) {
        return;
    }

    if (!res.outcome) {
        fonctionDeKewinDousse(ret);
        return;
    }

    ret.msg_body = res.msg_body;
    ret.msg_id = res.msg_id;
    ret.intent = res.outcome.intent;
    ret.entities = res.outcome.entities;

    fonctionDeKewinDousse(ret);
};
mic.onerror = function (err) {
    isRecording = false;
    console.error(err);
    error("Error: " + err);
};
mic.onconnecting = function () {
    info("Microphone is connecting");
};
mic.ondisconnected = function () {
    info("Microphone is not connected");
};

mic.connect("XJVMRCY6K4B54B2T3X4DATHDNJO6SFY7");
