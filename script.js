let stream = null;
let audio = null;
let chunks = [];
let mediaStream = null;
let recorder = null;
let startButton = null;
let stopButton = null;
let downloadButton = null;
let recordedVideo = null;

async function streamSetup() {
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });
        audio = await navigator.mediaDevices.getUserMedia({
            audio: {
                noiseSuppression: true,
                echoCancellation: true,
                sampleRate:44100,
            }
        });
        setupPreviewVideo();
    } catch (error) {
        console.error(error);
    }
}

function setupPreviewVideo()
{
    if (stream)
    {
let video=document.querySelector('.video-preview')
        video.srcObject = stream;
        video.play();
    }
    else {
        console.log("error at setupPreview()");
    }
}



async function startRecorder()
{
    await streamSetup();
    if (stream && audio)
    {
        mediaStream = new MediaStream(
            [...stream.getTracks(), ...audio.getTracks()]
        );
        recorder = new MediaRecorder(mediaStream);
        recorder.ondataavailable = dataAvailableHandler;
        recorder.onstop = stopHandler;
        recorder.start();

        startButton.disabled = true;
        stopButton.disabled=false;
        
    }
    else{
    console.log("error in startRecording");
        
    }
}



function stopRecorder()
{
    recorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
    document.body.scrollTop = 1000;
}

function dataAvailableHandler(e)
{
    chunks.push(e.data)
}

function stopHandler(e) {
    const blob = new Blob(chunks, { type: 'video/mp4' });
    chunks = [];
    downloadButton.href = URL.createObjectURL(blob);
    downloadButton.download = 'video.mp4';
    downloadButton.disabled = false;

    recordedVideo.src = URL.createObjectURL(blob);
    recordedVideo.load();
     recordedVideo.onloadeddata = function() {
		recordedVideo.play();
	}

	stream.getTracks().forEach((track) => track.stop());
	audio.getTracks().forEach((track) => track.stop());

	console.log('Recording stopped here');
}

window.addEventListener('load', () => {
     startButton = document.querySelector('.start-recording');;
     stopButton = document.querySelector('.stop-recording');
      downloadButton = document.querySelector('.download-video');
     recordedVideo = document.querySelector('.recorded-video');
	startButton.addEventListener('click', startRecorder);
	stopButton.addEventListener('click', stopRecorder);
})