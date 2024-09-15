// Load the saved preferences on page load
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['applyToAgoraRoad'], function(result) {
      document.getElementById('applyToAgoraRoad').checked = result.applyToAgoraRoad !== false;  // Default to true
    });
  });
  
  // Save the preferences when the user clicks "Save"
  document.getElementById('saveButton').addEventListener('click', function() {
    const applyToAgoraRoad = document.getElementById('applyToAgoraRoad').checked;
    chrome.storage.sync.set({ applyToAgoraRoad: applyToAgoraRoad }, function() {
      alert('Preferences saved!');
    });
  });
  