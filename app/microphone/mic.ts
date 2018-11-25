import { Wit } from './Wit';
import { Meter } from './Meter';
import { Microphone } from './Microphone';

export class Mic {
  MAX_SILENCE_TIME = 3 * 1000;
  THRESHOLD_PERCENT = 0.3;
  micDiv: HTMLDivElement;
  currentVolumeDiv: HTMLDivElement;
  thresholdVolumeDiv: HTMLDivElement;
  meter: Meter;
  wit: Wit;
  onresult: Function;
  onMicrophoneOn: Function;
  audioContext: AudioContext;
  mic: Microphone;
  isRecording: boolean = false;
  hasBeenCalledMicOn: boolean = false;

  constructor (onMicrophoneOn: Function, onresult: Function) {
    this.onresult = onresult;
    this.onMicrophoneOn = onMicrophoneOn;
    this.audioContext = new AudioContext();
    this.wit = new Wit(onerror, onresult);
  }

  public init () {
    // Try to get access to the microphone
    try {
      // Retrieve getUserMedia API with all the prefixes of the browsers
      // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      const constraints: MediaTrackConstraints & any = {};
      constraints.audio = true;
      constraints.echoCancelation = false;
      constraints.autoGainControl = false;
      constraints.noiseSuppression = false;
      constraints.highpassFilter = false;

      // Ask for an audio input
      navigator.getUserMedia(constraints, this.onMicrophoneGranted, () => alert('Stream generation failed.'));
    } catch (e) {
      alert('getUserMedia threw exception :' + e);
    }

    this.mic = this.wit.microphone;

    const info = (msg) => {
      console.info(msg);
    };

    const error = (msg) => {
      console.error(msg);
    };

    this.mic.onready = () => {
      info('Microphone is ready to record');
    };

    this.mic.onaudiostart = () => {
      this.isRecording = true;
      info('Recording started');
    };

    this.mic.onaudioend = () => {
      this.isRecording = false;
      info('Recording stopped, processing started');
    };

    this.mic.onresult = (res) => {
      const ret: any = {};

      if (!res) {
        return;
      }

      if (!res.outcome) {
        this.onresult(ret);
        return;
      }

      ret.msg_body = res.msg_body;
      ret.msg_id = res.msg_id;
      ret.intent = res.outcome.intent;
      ret.entities = res.outcome.entities;

      this.onresult(ret);
    };

    this.mic.onerror = (err) => {
      this.isRecording = false;
      console.error(err);
      error('Error: ' + err);
    };

    this.mic.onconnecting = () => {
      info('Microphone is connecting');
    };

    this.mic.ondisconnected = () => {
      info('Microphone is not connected');
    };

    this.mic.connect('XJVMRCY6K4B54B2T3X4DATHDNJO6SFY7');
  }

  onMicrophoneGranted = (stream) => {
    console.log('micro granted');

    // Create an AudioNode from the stream.
    const mediaStreamSource = this.audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    // createAudioMeter(audioContext, clipLevel, averaging, clipLag);
    this.meter = new Meter(this.audioContext, this.THRESHOLD_PERCENT, 0, this.MAX_SILENCE_TIME);

    mediaStreamSource.connect(this.meter.processor);

    // Trigger callback that shows the level of the 'Volume Meter'
    this.onLevelChange();
  }

  onLevelChange = (time?) => {
    if (this.thresholdVolumeDiv instanceof HTMLElement) {
      this.thresholdVolumeDiv.style.width = `${this.THRESHOLD_PERCENT * 100}%`;
    }

    if (!this.hasBeenCalledMicOn && this.meter.processor.volume > 0) {
      this.hasBeenCalledMicOn = true;
      this.onMicrophoneOn();
    }

    if (this.currentVolumeDiv instanceof HTMLElement) {
      this.currentVolumeDiv.style.width = `${this.meter.processor.volume * 100}%`;
    }

    if (this.meter.processor.checkClipping()) {
      if (!this.isRecording) {
        this.mic.start();
      }
      // console.warn(Meter.volume);
    } else {
      if (this.isRecording) {
        console.log('should stop');
        this.mic.stop();
      }
      // console.log(Meter.volume);
    }

    window.requestAnimationFrame(this.onLevelChange);
  }

  setElements = (micDiv: HTMLDivElement, curVolDiv: HTMLDivElement, thresholdVolDic: HTMLDivElement) => {
    this.mic.setMicElem(micDiv);
    this.currentVolumeDiv = curVolDiv;
    this.thresholdVolumeDiv = thresholdVolDic;
  }
}
