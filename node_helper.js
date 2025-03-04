const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Google Assistant Node Helper Started.");
        this.sendSocketNotification("INIT", {});
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "INIT") {
            this.initializeAssistant();
        }
    },

    initializeAssistant: function () {
        // You can initialize any necessary components here, e.g., microphone
        console.log("Initializing Google Assistant...");
    },
});
