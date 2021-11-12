import {Client} from "../utils/AgoraClient.js";

let client = new Client();
let cfg = {
	appID : sessionStorage.appID,
	token : sessionStorage.token,
	roomID : sessionStorage.roomID,
}
client.join(cfg)
.then(() => {
	
	let stat = undefined;
	setInterval(async () => {
		stat = await client.client.getRTCStats();
		document.dispatchEvent(new CustomEvent("rtcStat", {detail : stat}))
		console.log("stat: ", stat);
	}, 2000);
});

client.client.on("user-published", async (user, mediaType) => {
	console.log("接收到视频");

	await client.client.subscribe(user, mediaType);

	client.sendAudio();

	if (mediaType === 'audio') {
		const audioTrack = user.audioTrack;
		audioTrack.play();
	} else {
		const videoTrack = user.videoTrack;
		// let display = document.getElementById('canvasDiv');
		videoTrack.play('displayPanel');
		let video = document.querySelectorAll('video')[0];
		let canvas = document.getElementById('videoCanvas');
		console.log("videoCanvas: ", canvas);
		video.style.display = "none";
		// canvas.width = canvas.clientWidth * 1.5;
		// canvas.height = canvas.clientHeight * 1.5;
		// let ctx = canvas.getContext('2d');
		let updiv = video.parentNode;
		updiv.style.display = 'none';
		// video.style.display = 'none';
		let FPS = 30;
		setInterval(()=> {
			canvas.drawVideo(video);
		}, 1000/FPS)
	}
})

// 派发异常事件
client.client.on("exception", function(evt){
	document.dispatchEvent(new CustomEvent("exceptionEvt", {detail : evt}))
}) 

client.client.on("network-quality", (stats) => {
    console.log("downlinkNetworkQuality", stats.downlinkNetworkQuality);
    console.log("uplinkNetworkQuality", stats.uplinkNetworkQuality);
});
