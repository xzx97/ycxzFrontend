import "./AgoraRTC_N-4.7.0.js";

export class Client {

	constructor() {
		this.client = AgoraRTC.createClient({
			codec: "vp8",
			mode: "rtc",
		})
	}

	async join(cfg) {
		await this.client.join(cfg.appID, cfg.roomID, cfg.token, 0);
	}

	async publish(canvasDom) {
		let canvasStream = canvasDom.captureStream(30);
		const [videoTrack] = canvasStream.getVideoTracks();
		let localVideoTrack = await AgoraRTC.createCustomVideoTrack({
			optimizationMode: "detail",
			mediaStreamTrack: videoTrack,
		});

		let localTrack = {};
		localTrack.videoTrack = localVideoTrack;

		this.client.publish(localTrack.videoTrack);

		try {
			localTrack.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
			this.client.publish(localTrack.audioTrack);
		} catch (error) {
			console.log("获取麦克风失败！");
		}
	}

	async sendAudio() {
		let localTrack = {};
		try {
			localTrack.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
			await this.client.publish(localTrack.audioTrack);
		} catch (error) {
			console.log("发布音频流失败");
		}

	}
}