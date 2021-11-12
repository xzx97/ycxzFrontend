import {Client} from "../utils/AgoraClient.js";

let canvas = document.getElementById("canvas");
let client = new Client();
let cfg = {
	appID : sessionStorage.appID,
	roomID : sessionStorage.roomID,
	token : sessionStorage.token,
}

client.client.on("user-published", async (user, mediaType) => {
	
	await client.client.subscribe(user, mediaType);

	if (mediaType === 'audio') {
		console.log("接收到音频");
		const audioTrack = user.audioTrack;
		audioTrack.play();
	}
})

client.join(cfg)
.then(async (uid) => {
	console.log("调用 publish ---------------")
	console.log("成功加入 uid: ", uid);
	client.publish(canvas);
	// client.sendAudio();

	client.client.on("network-quality", (stats) => {
		console.log("stat: ", stats);
		console.log("downlinkNetworkQuality", stats.downlinkNetworkQuality);
		console.log("uplinkNetworkQuality", stats.uplinkNetworkQuality);
	});

	// function getStats () {
	// 	let stat = client.client.getRTCStats()
	// 	document.dispatchEvent(new CustomEvent("rtcStat", {detail: stat}));
	// 	console.log("stat: ", stat);
	// }

	let stat = undefined;
	setInterval(async () => {
		stat = await client.client.getRTCStats();
		document.dispatchEvent(new CustomEvent("rtcStat", {detail : stat}))
		console.log("stat: ", stat);
	}, 2000);

	// 派发异常事件
	client.client.on("exception", function(evt){
		document.dispatchEvent(new CustomEvent("exceptionEvt", {detail : evt}))
	}) 

	
});

