Module.register("googleAssistant", {
  socketNotificationReceived: function (notification, payload) {
    if (notification === "SHOW_GOOGLE_INDICATOR") {
      this.showIndicator();
    } else if (notification === "HIDE_GOOGLE_INDICATOR") {
      this.hideIndicator();
    }
  },

  showIndicator: function () {
    // Display a visual indicator (e.g., an icon or text) that Google Assistant is listening
    const indicator = document.createElement("div");
    indicator.classList.add("google-assistant-indicator");
    indicator.innerText = "Google Assistant Listening...";
    document.body.appendChild(indicator);
  },

  hideIndicator: function () {
    // Remove the visual indicator
    const indicator = document.querySelector(".google-assistant-indicator");
    if (indicator) {
      indicator.remove();
    }
  }
});
