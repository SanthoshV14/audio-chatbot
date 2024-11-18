const recordButton = document.getElementById('recordButton');
const status = document.getElementById('status');
const playbackArea = document.getElementById('playbackArea');
const sendButton = document.getElementById('sendButton');

let mediaRecorder;
let audioChunks = [];
let audioBlob;

// Function to start recording
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            audioChunks = []; // Clear chunks after stop
            createPlaybackElement(URL.createObjectURL(audioBlob));
        };

        mediaRecorder.start();
        status.textContent = "Recording...";
    } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Microphone access is required to record audio.");
    }
}

// Function to stop recording
function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        status.textContent = "Recording stopped.";
        sendButton.style.display = 'inline-block';
    }
}

// Function to create a playback element for the recorded audio
function createPlaybackElement(audioUrl) {
    playbackArea.innerHTML = ""; // Clear any previous playback element
    const audioElement = document.createElement('audio');
    audioElement.controls = true;
    audioElement.src = audioUrl;
    playbackArea.appendChild(audioElement);
}

// Function to send audio to the server
async function sendAudioToServer(audioBlob) {
    const formData = new FormData();
    formData.append("file", audioBlob, "recorded_audio.webm");

    try {
        const response = await fetch("http://127.0.0.1:8000/audio-text", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            status.textContent = `Server Response: ${result.transcription}`;
        } else {
            status.textContent = `Server Error: ${response.statusText}`;
        }
    } catch (error) {
        console.error("Error sending audio to server:", error);
        status.textContent = "Failed to send audio to the server.";
    }
}

// Event listener for the record button
recordButton.addEventListener("click", () => {
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

// Event listener for the send button
sendButton.addEventListener("click", () => {
    if (audioBlob) {
        sendAudioToServer(audioBlob);
    }
});
