const recordButton = document.getElementById('recordButton');
const status = document.getElementById('status');
const playbackArea = document.getElementById('playbackArea');

let mediaRecorder;
let audioChunks = [];

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            createPlaybackElement(audioUrl);
            audioChunks = []; // Clear audio chunks after stop
        };

        mediaRecorder.start();
        status.textContent = "Recording...";
    } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Microphone access is required to record audio.");
    }
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        status.textContent = "Recording stopped. Playback is available below.";
    }
}

function createPlaybackElement(audioUrl) {
    playbackArea.innerHTML = ""; // Clear any previous playback element
    const audioElement = document.createElement('audio');
    audioElement.controls = true;
    audioElement.src = audioUrl;
    playbackArea.appendChild(audioElement);
}

recordButton.addEventListener('click', () => {
    if (recordButton.textContent === "Start Recording") {
        startRecording();
        recordButton.textContent = "Stop Recording";
        recordButton.classList.add("stop");
    } else {
        stopRecording();
        recordButton.textContent = "Start Recording";
        recordButton.classList.remove("stop");
    }
});
