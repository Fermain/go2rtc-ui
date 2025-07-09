import { VideoRTC } from './video-rtc.js';

/**
 * This is example, how you can extend VideoRTC player for your app.
 * Also you can check this example: https://github.com/AlexxIT/WebRTC
 */
class VideoStream extends VideoRTC {
	set divMode(value) {
		this.querySelector('.mode').innerText = value;
		this.querySelector('.status').innerText = '';
	}

	set divError(value) {
		const state = this.querySelector('.mode').innerText;
		if (state !== 'loading') return;
		this.querySelector('.mode').innerText = 'error';
		this.querySelector('.status').innerText = value;
	}

	/**
	 * Custom GUI
	 */
	oninit() {
		super.oninit();

		this.innerHTML = `
        <style>
        video-stream {
            position: relative;
        }
        .info {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: 12px;
            color: white;
            display: flex;
            justify-content: space-between;
            pointer-events: none;
        }
        </style>
        <div class="info">
            <div class="status"></div>
            <div class="mode"></div>
        </div>
        `;

		const info = this.querySelector('.info');
		this.insertBefore(this.video, info);
	}

	onconnect() {
		const result = super.onconnect();
		if (result) this.divMode = 'loading';
		return result;
	}

	ondisconnect() {
		super.ondisconnect();
	}

	onopen() {
		const result = super.onopen();

		this.onmessage['stream'] = (msg) => {
			switch (msg.type) {
				case 'error':
					this.divError = msg.value;
					break;
				case 'mse':
				case 'hls':
				case 'mp4':
				case 'mjpeg':
					this.divMode = msg.type.toUpperCase();
					break;
			}
		};

		return result;
	}

	onclose() {
		return super.onclose();
	}

	onpcvideo(ev) {
		super.onpcvideo(ev);

		if (this.pcState !== WebSocket.CLOSED) {
			this.divMode = 'RTC';
		}
	}
}

customElements.define('video-stream', VideoStream);
