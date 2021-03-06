/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const VERSION = "0.8.3";

navigator.getUserMedia =
	navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;

window.AudioContext =
	window.AudioContext ||
	window.webkitAudioContext ||
	window.mozAudioContext ||
	window.msAudioContext;


(function() {
	const w = window;
	for (let vendor of ['ms', 'moz', 'webkit', 'o']) {
		if (w.requestAnimationFrame) { break; }
		w.requestAnimationFrame = w[`${vendor}RequestAnimationFrame`];
		w.cancelAnimationFrame = (w[`${vendor}CancelAnimationFrame`] ||
															w[`${vendor}CancelRequestAnimationFrame`]);
	}

	// deal with the case where rAF is built in but cAF is not.
	if (w.requestAnimationFrame) {
			if (w.cancelAnimationFrame) { return; }
			const browserRaf = w.requestAnimationFrame;
			const canceled = {};
			w.requestAnimationFrame = function(callback) {
					let id;
					return id = browserRaf(function(time) {
							if (id in canceled) { return delete canceled[id];
							} else { return callback(time); }
					});
				};
			return w.cancelAnimationFrame = id => canceled[id] = true;

	// handle legacy browsers which don’t implement rAF
	} else {
			let targetTime = 0;
			w.requestAnimationFrame = function(callback) {
					let currentTime;
					targetTime = Math.max(targetTime + 16, (currentTime = +new Date));
					return w.setTimeout((() => callback(+new Date)), targetTime - currentTime);
				};

			return w.cancelAnimationFrame = id => clearTimeout(id);
		}
})();

const log = (typeof localStorage !== 'undefined' && localStorage !== null ? localStorage.getItem : undefined) && localStorage.getItem('wit_debug') ?
	(function() { return console.log.apply(console, arguments); })
:
	function() {};

const WitError = function(message, infos) {
	this.name = "WitError";
	this.message = (message || "");
	this.infos = infos;
	return this;
};
WitError.prototype = Error.prototype;

const WEBSOCKET_HOST = localStorage.getItem('wit_ws') || 'wss://ws.wit.ai/speech_ws';

const Microphone = function(elem) {
	// object state
	let svg;
	this.conn  = null;
	this.ctx   = new AudioContext();
	this.state = 'disconnected';
	this.rec   = false;

	// methods
	this.handleError = function(e) {
		let f;
		if (_.isFunction(f = this.onerror)) {
			const err = _.isString(e) ? e : _.isString(e.message) ? e.message : "Something went wrong!";
			return f.call(window, err, e);
		}
	};
	this.handleResult = function(res) {
		let f;
		if (_.isFunction(f = this.onresult)) {
			if (res) {
				return f.call(window, res);
			}
		}
	};

	// DOM setup
	if (elem) {
		this.elem = elem;

		elem.innerHTML = `\
<div class='mic mic-box icon-wit-mic'>
</div>
<svg class='mic-svg mic-box'>
</svg>\
`;
		elem.className += ' wit-microphone';
		elem.addEventListener('click', e => {
			return this.fsm('toggle_record');
		});

		svg = this.elem.children[1];
		const ns  = "http://www.w3.org/2000/svg";
		this.path = document.createElementNS(ns, 'path');
		this.path.setAttribute('stroke', '#eee');
		this.path.setAttribute('stroke-width', '5');
		this.path.setAttribute('fill', 'none');
		svg.appendChild(this.path);
	}

	// DOM methods
	this.rmactive = function() {
		if (this.elem) {
			return this.elem.classList.remove('active');
		}
	};
	this.mkactive = function() {
		if (this.elem) {
			return this.elem.classList.add('active');
		}
	};
	this.mkthinking = function() {
		this.thinking = true;
		if (this.elem) {
			const style = getComputedStyle(svg);
			this.elem.classList.add('thinking');
			const w = parseInt(style.width, 10);
			const h = parseInt(style.height, 10);
			const b = style.boxSizing === 'border-box' ?
				parseInt(style.borderTopWidth, 10)
			:
				0;
			const r = (w/2)-b-5;
			const T = 1000; // msecs
			const from_x = (w/2)-b;
			const from_y = (h/2)-b-r;
			const xrotate = 0;
			const swf  = 1; // sweep flag (anticw=0, clockwise=1)
			const start = (window.performance != null ? window.performance.now() : undefined) || new Date;
			var tick = time => {
				const rads = ((((time-start)%T)/T) * 2*Math.PI) - (Math.PI/2);
				const to_x = ((Math.cos(rads)*r)+(w/2))-b;
				const to_y = ((Math.sin(rads)*r)+(h/2))-b;
				const laf  = +(1.5*Math.PI > rads && rads > Math.PI/2); // large arc flag (smallest=0 or largest=1 is drawn)
				this.path.setAttribute('d', `M${from_x},${from_y}A${r},${r},${xrotate},${laf},${swf},${to_x},${to_y}`);

				if (this.thinking) {
					return requestAnimationFrame(tick);
				} else {
					this.elem.classList.remove('thinking');
					return this.path.setAttribute('d', 'M0,0');
				}
			};

			return requestAnimationFrame(tick);
		}
	};

	this.rmthinking = function() {
		return this.thinking = false;
	};

	return this;
};

const states = {
	disconnected: {
		connect(token) {
			if (!token) {
				this.handleError('No token provided');
			}

			// websocket
			const conn = new WebSocket(WEBSOCKET_HOST);
			conn.onopen = e => {
				log("connection opened", e);
				const opts = {
					token,
					bps: 16,
					encoding: 'signed-integer'
				};
				return conn.send(JSON.stringify(["auth", opts]));
			};
			conn.onclose = e => {
				return this.fsm('socket_closed');
			};
			conn.onmessage = e => {
				const [type, data] = Array.from(JSON.parse(e.data));

				if (data) {
					return this.fsm.call(this, type, data);
				} else {
					return this.fsm.call(this, type);
				}
			};

			this.conn = conn;

			// webrtc
			const on_stream = stream => {
				const { ctx }  = this;
				const src  = ctx.createMediaStreamSource(stream);
				const proc = (ctx.createScriptProcessor || ctx.createJavascriptNode).call(ctx, 4096, 1, 1);
				proc.onaudioprocess = e => {
					if (!this.rec) { return; }
					const buffer = e.inputBuffer;
					// Float32Array
					const float32s = buffer.getChannelData(0);
					// we receive 32bps, 44.1khz audio, mono
					// we want 16bps, 16khz, mono
					const n_samples = float32s.length;

					// let's convert these 32bits samples into 16bits samples
					const int16s = new Int16Array(n_samples);
					for (let i = 0, end = n_samples, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
						const x = float32s[i];
						const y = x < 0 ?
							x * 0x8000
						:
							x * 0x7fff;

						int16s[i] = y;
					}

					log(`[audiobuffer] rate=${buffer.sampleRate}, samples=${n_samples}, bytes=${int16s.byteLength}`);

					return this.conn.send(int16s);
				};

				src.connect(proc);
				proc.connect(ctx.destination);

				// NECESSARY HACK: prevent garbage-collection of these guys
				this.stream = stream;
				this.proc   = proc;
				this.src    = src;

				// @cleanup = ->
				//   src.disconnect()
				//   proc.disconnect()
				//   stream.stop()

				return this.fsm('got_stream');
			};

			navigator.getUserMedia(
				{ audio: true },
				on_stream,
				this.handleError
			);

			return 'connecting';
		}
	},
	connecting: {
		'auth-ok'() { return 'waiting_for_stream'; },
		got_stream() { return 'waiting_for_auth'; },
		error(err) {
			this.handleError(err);
			return 'connecting';
		},
		socket_closed() { return 'disconnected'; }
	},
	waiting_for_auth: {
		'auth-ok'() { return 'ready'; }
	},
	waiting_for_stream: {
		got_stream() { return 'ready'; }
	},
	ready: {
		socket_closed() { return 'disconnected'; },
		timeout() { return 'ready'; },
		start() { return this.fsm('toggle_record'); },
		toggle_record() {
			if (!this.ctx) { console.error("No context"); }
			if (!this.stream) { console.error("No stream"); }
			if (!this.src) { console.error("No source"); }
			if (!this.proc) { console.error("No processor"); }

			if (this.ctx.state === 'suspended') {
				this.ctx.resume();
			}

			this.conn.send(JSON.stringify(["start", this.context || {}]));
			this.rec = true;

			return 'audiostart';
		}
	},
	audiostart: {
		error(data) {
			this.rec = false;
			this.handleError(new WitError("Error during recording", {code: 'RECORD', data}));
			return 'ready';
		},
		socket_closed() {
			this.rec = false;
			return 'disconnected';
		},
		stop() { return this.fsm('toggle_record'); },
		toggle_record() {
			// if _.isFunction(f = @cleanup)
			//   f()
			//   @cleanup = null

			this.rec = false;
			this.conn.send(JSON.stringify(["stop"]));
			this.timer = setTimeout((() => this.fsm('timeout')), 60000);

			return 'audioend';
		}
	},
	audioend: {
		socket_closed() {
			if (this.timer) { clearTimeout(this.timer); }
			return 'disconnected';
		},
		timeout() {
			this.handleError(new WitError('Wit timed out', {code: 'TIMEOUT'}));
			return 'ready';
		},
		error(data) {
			if (this.timer) { clearTimeout(this.timer); }
			this.handleError(new WitError('Wit did not recognize intent', {code: 'RESULT', data}));
			return 'ready';
		},
		result(data) {
			if (this.timer) { clearTimeout(this.timer); }
			this.handleResult(data);
			return 'ready';
		}
	}
};

Microphone.prototype.fsm = function(event) {
	let s;
	let f   = states[this.state] != null ? states[this.state][event] : undefined;
	const ary = Array.prototype.slice.call(arguments, 1);
	if (_.isFunction(f)) {
		s   = f.apply(this, ary);
		log(`fsm: ${this.state} + ${event} -> ${s}`, ary);
		this.state = s;

		if (['audiostart', 'audioend', 'ready', 'connecting', 'disconnected'].includes(s)) {
			if (_.isFunction(f = this[`on${s}`])) {
				f.call(window);
			}
		}

		switch (s) {
			case 'disconnected':
				this.rmthinking();
				this.rmactive();
				break;
			case 'ready':
				this.rmthinking();
				this.rmactive();
				break;
			case 'audiostart':
				this.mkactive();
				break;
			case 'audioend':
				this.mkthinking();
				this.rmactive();
				break;
		}
	} else {
		log(`fsm error: ${this.state} + ${event}`, ary);
	}

	return s;
};

Microphone.prototype.connect = function(token) {
	return this.fsm('connect', token);
};

Microphone.prototype.start = function() {
	return this.fsm('start');
};

Microphone.prototype.stop = function() {
	return this.fsm('stop');
};

Microphone.prototype.setContext = function(context) {
	if (!this.context) { this.context = {}; }
	for (let k in context) {
		const v = context[k];
		this.context[k] = context[k];
	}
	log('context: ', this.context);
	return null;
};

// utils
if (!window._) { window._ = {}; }
if (!_.isFunction) { _.isFunction = x => (typeof x) === 'function'; }
if (!_.isString) { _.isString = obj => toString.call(obj) === '[object String]'; }

if (!window.Wit) { window.Wit = {}; }
Wit.Microphone = Microphone;
