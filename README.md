NetShores .Beat Extension
Overview
NetShores .Beat Extension is a Chrome extension that converts standard timestamps on webpages to .beat time based on Swatch Internet Time (UTC+1). The extension features customizable settings, allowing users to apply the conversion globally or only to specific websites like agoraroad.com.

Features
Converts timestamps on webpages to .beat time format.
Supports dynamic pages and updates automatically using a MutationObserver.
Option to only apply the conversion on agoraroad.com.
Automatically converts timestamps within the last hour to show today @X beats ago.
Installation
Option 1: Install as Unpacked Extension
Download or clone the repository:

bash
Copy code
git clone https://github.com/your-username/beat-time-converter.git
Open Chrome and navigate to chrome://extensions/.

Enable Developer mode by toggling the switch in the top-right corner.

Click Load unpacked and select the folder where you cloned or downloaded the repository.

The extension should now be active.

Option 2: Install from the .crx File
Download the .crx file from the Releases page.

Open Chrome and navigate to chrome://extensions/.

Enable Developer mode.

Drag and drop the .crx file into the chrome://extensions/ page.

Confirm the installation by clicking Add Extension.

Usage
Once the extension is installed, it will automatically:

Convert timestamps on webpages to .beat time format (@70.83 on Monday 7/23/24).
For timestamps within the last hour, it will display today @X beats ago.
Preferences
You can customize the behavior of the extension via the preferences popup:

Click the extension icon in the Chrome toolbar.
In the popup, you'll find a checkbox labeled "Only apply to Agora Road". When enabled (default), the extension only converts timestamps on agoraroad.com. Unchecking the box will apply the conversion to all websites.
Click Save to apply your preferences.
Development
To contribute to this project, follow these steps:

Clone the repository:

bash
Copy code
git clone https://github.com/your-username/beat-time-converter.git
Make your changes and ensure the extension runs correctly by following the installation steps above.

Submit a pull request to contribute your changes.

License
This project is licensed under the MIT License. See the LICENSE file for more details.

Troubleshooting
If you're having trouble installing the .crx file or using the extension, try the following:

Ensure Developer Mode is enabled in chrome://extensions/.
Make sure you are running the latest version of Chrome.
Feel free to open an issue if you encounter any problems or have suggestions!

Screenshots
Add some screenshots showing the extension in action on a webpage.

This README should give users all the information they need to install, use, and contribute to your extension project. You can adjust the URLs and details as necessary to fit your GitHub repository. Let me know if you'd like to tweak or add anything!
