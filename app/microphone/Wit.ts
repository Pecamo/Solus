import { Microphone } from './Microphone';

const WEBSOCKET_HOST = localStorage.getItem('wit_ws') || 'wss://ws.wit.ai/speech_ws';

export class Wit {
	VERSION: string = "0.8.3";
	name: string;
	message: string;
    infos: string;
    onerror: Function;
    onresult: Function;
    microphone: Microphone;

	constructor(elem: HTMLElement, onerror: Function, onresult: Function) {
        this.onerror = onerror;
        this.onresult = onresult
        this.microphone = new Microphone(elem, this.onerror, this.onresult);
		this.init();
	}

	init() {
		const w = window;
		for (let vendor of ['ms', 'moz', 'webkit', 'o']) {
			if (w.requestAnimationFrame) { break; }
			w.requestAnimationFrame = w[`${vendor}RequestAnimationFrame`];
			w.cancelAnimationFrame = (w[`${vendor}CancelAnimationFrame`] || w[`${vendor}CancelRequestAnimationFrame`]);
		}

		// deal with the case where rAF is built in but cAF is not.
		if (w.requestAnimationFrame) {
			if (w.cancelAnimationFrame) { return; }
			const browserRaf = w.requestAnimationFrame;
			const canceled = {};
			w.requestAnimationFrame = function (callback) {
				let id;
				return id = browserRaf(function (time) {
					if (id in canceled) {
						return delete canceled[id];
					} else { return callback(time); }
				});
			};
			return w.cancelAnimationFrame = id => canceled[id] = true;

			// handle legacy browsers which don’t implement rAF
		} else {
			let targetTime = 0;
			w.requestAnimationFrame = function (callback) {
				let currentTime;
				targetTime = Math.max(targetTime + 16, (currentTime = +new Date));
				return w.setTimeout((() => callback(+new Date)), targetTime - currentTime);
			};

			return w.cancelAnimationFrame = id => clearTimeout(id);
		}
	}

	WitError(message, infos) {
		this.name = "WitError";
		this.message = (message || "");
		this.infos = infos;
		return this;
	};
}
