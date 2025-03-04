const NodeHelper = require("node_helper");
const record = require("node-record-lpcm16");
const Porcupine = require('@picovoice/porcupine'); // Import Porcupine library
const { Assistant, GoogleAuth } = require("google-assistant");

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting Google Assistant module...");
    this.setupVoiceRecognition();
  },

  setupVoiceRecognition: function () {
    const porcupine = new Porcupine({
      accessKey: 'YOUR_PICOVOICE_ACCESS_KEY', // Obtain an access key from Picovoice
      model: 'path/to/hey-google.ppn', // Path to the wake word model
      sensitivity: 0.5, // Adjust sensitivity as needed
    });

    // Start the microphone recording
    const mic = record.start({
      threshold: 0,
      recordProgram: "sox",
      silence: 5000,
    });

    mic.on("data", (data) => {
      // Detect if the wake word is said
      const result = porcupine.process(data);
      if (result) {
        console.log("Wake word detected: 'Hey Google'");
        this.showListeningIndicator();
        this.processGoogleAssistant(data);
      }
    });
  },

  showListeningIndicator: function () {
    // Show a visual cue on MagicMirror that Google Assistant is listening
    this.sendSocketNotification('SHOW_INDICATOR', { show: true });
  },

  processGoogleAssistant: function (data) {
    // Initialize Google Assistant
    const auth = new GoogleAuth({
      clientId: "YOUR_CLIENT_ID",
      clientSecret: "YOUR_CLIENT_SECRET",
      redirectUri: "YOUR_REDIRECT_URI",
    });

    const assistant = new Assistant(auth);

    assistant.on("ready", () => {
      console.log("Google Assistant is ready!");
      assistant.start();
    });

    assistant.on("response", (response) => {
      console.log("Google Assistant responded:", response);
      this.sendResponseToSpeakers(response);
      this.hideListeningIndicator();
    });

    assistant.processAudio(data);
  },

  sendResponseToSpeakers: function (response) {
    // Send the response from Google Assistant to the Raspberry Pi speakers
    const exec = require('child_process').exec;
    const command = `espeak "${response}"`; // Using espeak for text-to-speech on Raspberry Pi
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error: ${error}`);
        return;
      }
      console.log(`Response spoken: ${stdout}`);
    });
  },

  hideListeningIndicator: function () {
    // Hide the visual cue when Google Assistant is done responding
    this.sendSocketNotification('SHOW_INDICATOR', { show: false });
  },
});
