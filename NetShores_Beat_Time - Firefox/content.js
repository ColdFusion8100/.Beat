// Function to convert a timestamp to .beat time, always based on UTC+1 (Swatch Mean Time)
function convertToBeatTime(timestamp) {
  let utcDate = new Date(timestamp);
  let utcTime = utcDate.getTime();
  let bielMeanTime = utcTime + 3600 * 1000;  // UTC+1 adjustment
  let midnightUTC1 = new Date(utcDate);
  midnightUTC1.setUTCHours(0, 0, 0, 0);  // Set to midnight (UTC+1)
  let secondsSinceMidnightUTC1 = (bielMeanTime - midnightUTC1.getTime()) / 1000;
  let beatTime = secondsSinceMidnightUTC1 / 86.4;  // 1 .beat = 86.4 seconds
  return beatTime.toFixed(2);  // Return .beat time with 2 decimal precision
}

// Function to calculate how many .beats have passed between two timestamps, only for timestamps within the last hour
function calculateBeatsAgo(pastTime) {
  let currentTime = new Date();
  let timeDifferenceInMillis = currentTime.getTime() - pastTime.getTime();  // Difference in milliseconds

  // If the time difference is negative, return null (error case)
  if (timeDifferenceInMillis < 0) {
    return null;
  }

  // Check if the time difference is less than an hour (3600 seconds)
  if (timeDifferenceInMillis < 60 * 60 * 1000) {
    let timeDifferenceInSeconds = timeDifferenceInMillis / 1000;  // Convert to seconds
    let beatsAgo = timeDifferenceInSeconds / 86.4;  // Convert seconds to beats (1 beat = 86.4 seconds)
    return beatsAgo.toFixed(2);  // Return beats passed with 2 decimal precision
  }

  return null;  // Return null for anything older than an hour
}

// Function to format the date as "[DAY OF WEEK] MM/DD/YY"
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let dayName = daysOfWeek[date.getDay()];
  let month = (date.getMonth() + 1).toString().padStart(2, '0');  // Month is 0-based, pad with leading 0 if needed
  let day = date.getDate().toString().padStart(2, '0');  // Pad day with leading 0 if needed
  let year = date.getFullYear().toString().slice(-2);  // Get the last two digits of the year
  return `${dayName} ${month}/${day}/${year}`;
}

// Function to scan the page, find timestamps, and replace them with @beat time or @XX .beats ago
function replaceTimestampsWithBeat() {
  const elements = document.querySelectorAll('time, span, p');

  elements.forEach(el => {
    const text = el.textContent.trim();
    const absoluteTimeRegex = /(\d{1,2}:\d{2}\s?[APMapm]{2})|(\d{1,2}:\d{2})/;
    const relativeTimeRegex = /(\d+\s?minutes?\s?ago)|(\d+\s?hours?\s?ago)/;

    let beatTime;
    let formattedDate;
    let beatsAgo;
    let displayBeatsAgo = false;

    if (absoluteTimeRegex.test(text)) {
      let absoluteTime = text.match(absoluteTimeRegex)[0];
      let localDate = new Date();
      let timeParts = absoluteTime.split(':');
      let hour = parseInt(timeParts[0]);
      let minute = parseInt(timeParts[1].replace(/\D/g, ''));  // Remove non-digit characters (e.g., AM/PM)
      if (/PM/i.test(absoluteTime) && hour < 12) {
        hour += 12;
      }
      if (/AM/i.test(absoluteTime) && hour === 12) {
        hour = 0;
      }
      localDate.setHours(hour, minute, 0, 0);

      // Calculate if the time is within the last hour
      beatsAgo = calculateBeatsAgo(localDate);

      // If the timestamp is within the last hour, we'll display @XX .beats ago
      if (beatsAgo !== null) {
        displayBeatsAgo = true;
      }

      beatTime = convertToBeatTime(localDate);
      formattedDate = formatDate(localDate);
    } else if (relativeTimeRegex.test(text)) {
      let relativeTime = text.match(relativeTimeRegex)[0];
      let currentTime = new Date();
      let timeInMillis;

      if (/minutes?/i.test(relativeTime)) {
        let minutesAgo = parseInt(relativeTime.match(/\d+/)[0]);
        timeInMillis = currentTime.getTime() - (minutesAgo * 60 * 1000);
      } else if (/hours?/i.test(relativeTime)) {
        let hoursAgo = parseInt(relativeTime.match(/\d+/)[0]);
        timeInMillis = currentTime.getTime() - (hoursAgo * 60 * 60 * 1000);
      }

      let pastDate = new Date(timeInMillis);

      // Calculate if the time is within the last hour
      beatsAgo = calculateBeatsAgo(pastDate);

      // If the timestamp is within the last hour, we'll display @XX .beats ago
      if (beatsAgo !== null) {
        displayBeatsAgo = true;
      }

      beatTime = convertToBeatTime(pastDate);
      formattedDate = formatDate(pastDate);
    }

    // Display the beat time or "beats ago" based on the time difference
    if (displayBeatsAgo) {
      el.textContent = `@${beatsAgo} .beats ago`;
    } else if (beatTime && formattedDate) {
      el.textContent = `@${beatTime} on ${formattedDate}`;
    }
  });
}

// Function to observe changes and run the beat time conversion
function observeDOMChanges() {
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' || mutation.type === 'subtree') {
        replaceTimestampsWithBeat();  // Re-run the beat time conversion on updates
      }
    }
  });

  // Observe the entire document body for changes
  observer.observe(document.body, {
    childList: true,   // Observe changes to the child nodes
    subtree: true,     // Observe changes within the subtree (all levels)
  });

  // Initial run to replace existing timestamps
  replaceTimestampsWithBeat();
}

// Start observing DOM changes after fetching user preferences and checking the current domain
chrome.storage.sync.get(['applyToAgoraRoad'], function(result) {
  const applyToAgoraRoad = result.applyToAgoraRoad !== false;  // Default to true
  const currentDomain = window.location.hostname;

  // Only apply to Agora Road if the preference is enabled or apply universally if disabled
  if (!applyToAgoraRoad || currentDomain.includes('agoraroad.com')) {
    observeDOMChanges();
  }
});
