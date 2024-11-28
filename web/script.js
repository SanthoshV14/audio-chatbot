document.addEventListener("DOMContentLoaded", () => {

    const recordButton = document.getElementById('recordButton');
    const status = document.getElementById('status');
    const playbackArea = document.getElementById('playbackArea');
    const sendButton = document.getElementById('sendButton');
    const textArea = document.getElementById('textArea');
    const chatArea = document.getElementById('chatArea');
    const loader = document.getElementById("loader");

    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;

    // Show or Hide loader
    function toggleLoader(display) {
        loader.style.display = display;
    }

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
                if (audioBlob) {
                    toggleLoader("block")
                    const response = await audioToText(audioBlob);
                    toggleLoader("none")
                    console.log(response)
                    if (response.success) {
                        textArea.value = response.result
                    } else {
                        console.log(response.success)
                    }
                }
            };
            mediaRecorder.start();
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Microphone access is required to record audio.");
        }
    }

    // Function to stop recording
    async function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            sendButton.style.display = 'inline-block';
        }
    }

    // Function to send audio to the server
    async function audioToText(audioBlob) {
        const formData = new FormData();
        formData.append("file", audioBlob, "recorded_audio.webm");
        try {
            const response = await fetch("http://127.0.0.1:8000/audio-text", {
                method: "POST",
                body: formData,
            });
            return response.json()
        } catch (error) {
            console.error("Error sending audio to server:", error);
        }
    }

    // Function to send audio to the server
    async function chat(userMessage) {
        try {
        // Make a POST request to the /chat endpoint
        const response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: userMessage })
        });
        return response.json()
        } catch (error) {
        console.error("Error:", error);
        //   displayMessage("Bot", "An error occurred. Please try again.");
        }
    }

    // Function to display a message in the chat area
    function displayMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatArea.appendChild(messageElement);
        chatArea.scrollTop = chatArea.scrollHeight; // Auto-scroll to the latest message
    }

    // Event listener for the record button
    recordButton.addEventListener("click", () => {
        if (recordButton.textContent === "🎤 Record") {
            startRecording();
            recordButton.textContent = "Stop Recording";
            recordButton.classList.add("stop");
        } else {
            stopRecording();
            recordButton.textContent = "🎤 Record";
            recordButton.classList.remove("stop");
        }
    });

    // Event listener for the send button
    sendButton.addEventListener("click", async () => {
        const userMessage = textArea.value.trim();
        if (!userMessage) {
        alert("Please enter a message before sending.");
        return;
        }
        displayMessage("You", userMessage);
        textArea.value = "";
        toggleLoader("block")
        var response = await chat(userMessage)
        toggleLoader("none")
        if (response.success) {
            response = JSON.parse(response.result)
            console.log(response)
            displayMessage("Chat-Bot", response[1]["content"]);
        } else {
            console.log(response.success)
        }
    });
});