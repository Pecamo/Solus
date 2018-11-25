// 
// 	navigator.getUserMedia =
// 		navigator.getUserMedia ||
// 		navigator.webkitGetUserMedia ||
// 		navigator.mozGetUserMedia ||
// 		navigator.msGetUserMedia;
// 
// 	window.AudioContext =
// 		window.AudioContext ||
// 		window.webkitAudioContext ||
// 		window.mozAudioContext ||
// 		window.msAudioContext;
//

const WEBSOCKET_HOST = localStorage.getItem('wit_ws') || 'wss://ws.wit.ai/speech_ws';

export class Microphone {
	svg;
	conn;
	ctx;
	state;
	rec;
	elem: HTMLElement;
	path;
	thinking: boolean;
	context;
	stream;
	proc;
	src;
	me: Microphone = this;
	timer;
	onready: Function;
	onaudiostart: Function;
	onaudioend: Function;
	onresult: Function;
	onerror: Function;
	onconnecting: Function;
	ondisconnected: Function;

	constructor(elem: HTMLElement, onerror, onresult) {
		this.onerror = onerror;
		this.onresult = onresult;
		// object state
		let svg;
		this.conn = null;
		this.ctx = new AudioContext();
		this.state = 'disconnected';
		this.rec = false;

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
			const ns = "http://www.w3.org/2000/svg";
			this.path = document.createElementNS(ns, 'path');
			this.path.setAttribute('stroke', '#eee');
			this.path.setAttribute('stroke-width', '5');
			this.path.setAttribute('fill', 'none');
			svg.appendChild(this.path);
		}
	}

	// DOM methods
	public rmactive() {
		if (this.elem) {
			return this.elem.classList.remove('active');
		}
	};

	public mkactive() {
		if (this.elem) {
			return this.elem.classList.add('active');
		}
	};

	public mkthinking = () => {
		this.thinking = true;

		if (this.elem) {
			const style = getComputedStyle(this.svg);
			this.elem.classList.add('thinking');
			const w = parseInt(style.width || '0', 10);
			const h = parseInt(style.height || '0', 10);
			const b = style.boxSizing === 'border-box' ? parseInt(style.borderTopWidth || '0', 10) : 0;
			const r = (w / 2) - b - 5;
			const T = 1000; // msecs
			const from_x = (w / 2) - b;
			const from_y = (h / 2) - b - r;
			const xrotate = 0;
			const swf = 1; // sweep flag (anticw=0, clockwise=1)
			const start: number = window.performance.now();
			var tick = (time: number) => {
				const rads = ((((time - start) % T) / T) * 2 * Math.PI) - (Math.PI / 2);
				const to_x = ((Math.cos(rads) * r) + (w / 2)) - b;
				const to_y = ((Math.sin(rads) * r) + (h / 2)) - b;
				const laf = +(1.5 * Math.PI > rads && rads > Math.PI / 2); // large arc flag (smallest=0 or largest=1 is drawn)
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

		console.error("No elem defined");
		return;
	};

	public rmthinking() {
		return this.thinking = false;
	};

	_connect(token) {
		if (!token) {
			this.handleError('No token provided');
		}

		const conn = new WebSocket(WEBSOCKET_HOST);
		conn.onopen = e => {
			console.log("connection opened", e);
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
			const { ctx } = this;
			const src = ctx.createMediaStreamSource(stream);
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

				console.log(`[audiobuffer] rate=${buffer.sampleRate}, samples=${n_samples}, bytes=${int16s.byteLength}`);

				return this.conn.send(int16s);
			};

			src.connect(proc);
			proc.connect(ctx.destination);

			// NECESSARY HACK: prevent garbage-collection of these guys
			this.stream = stream;
			this.proc = proc;
			this.src = src;

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

	states = {
		disconnected: {
			connect: (token: any): string => this._connect(token)
		},
		connecting: {
			'auth-ok': () => { return 'waiting_for_stream'; },
			got_stream() { return 'waiting_for_auth'; },
			error: (err) => {
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
			start: () => { return this.fsm('toggle_record'); },
			toggle_record: () => {
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
			error: (data) => {
				this.rec = false;
				this.handleError("Error during recording");
				return 'ready';
			},
			socket_closed: () => {
				this.rec = false;
				return 'disconnected';
			},
			stop: () => { return this.fsm('toggle_record'); },
			toggle_record: () => {
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
			socket_closed: () => {
				if (this.timer) { clearTimeout(this.timer); }
				return 'disconnected';
			},
			timeout: () => {
				this.handleError('Wit timed out');
				return 'ready';
			},
			error: (data) => {
				if (this.timer) { clearTimeout(this.timer); }
				this.handleError('Wit did not recognize intent');
				return 'ready';
			},
			result: (data) => {
				if (this.timer) { clearTimeout(this.timer); }
				this.handleResult(data);
				return 'ready';
			}
		}
	};

	public fsm(event, ...ary: Array<any>) {
		let s;
		let f = this.states[this.state] != null ? this.states[this.state][event] : undefined;
		if (typeof f === 'function') {
			s = f.apply(this, ary);
			console.log(`fsm: ${this.state} + ${event} -> ${s}`, ary);
			this.state = s;

			if (['audiostart', 'audioend', 'ready', 'connecting', 'disconnected'].includes(s)) {
				if (typeof (f = this[`on${s}`]) === 'function') {
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
			// console.log(`fsm error: ${this.state} + ${event}`, ary);
		}

		return s;
	}

	public connect(token) {
		return this.fsm('connect', token);
	}

	public start() {
		return this.fsm('start');
	}

	public stop() {
		return this.fsm('stop');
	}

	public setContext(context) {
		if (!this.context) { this.context = {}; }
		for (let k in context) {
			const v = context[k];
			this.context[k] = context[k];
		}
			console.log('context: ', this.context);
		return null;
	}

	public handleError (e) {
		let f;
		if (typeof (f = this.onerror) === 'function') {
			const err = (typeof e === 'string') ? e : (typeof e.message === 'string') ? e.message : "Something went wrong!";
			return f.call(window, err, e);
		}
	}

	public handleResult (res) {
		let f;
		if (typeof (f = this.onresult) === 'function') {
			if (res) {
				return f.call(window, res);
			}
		}
	}
}
