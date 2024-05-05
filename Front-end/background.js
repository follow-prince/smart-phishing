
// Other code remains the same
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        const urlObj = new URL(changeInfo.url);
        const mainUrl = urlObj.protocol + "//" + urlObj.hostname;
        checkWebsite(mainUrl);
    }
});

function checkWebsite(websiteUrl) {
    // Check if the websiteUrl is a valid HTTP or HTTPS URL
    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        // Not a valid URL, return or handle accordingly
        return;
    }

    const apiUrl = 'http://localhost:8000/api/v1/detect';

    fetch(apiUrl + '?website_url=' + encodeURIComponent(websiteUrl))
    .then(response => response.json())
    .then(data => {
        if (data.result === 'LEGITIMATE') {
            // Create a notification
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'warning.png',
                title: legitimate_string.notifications.attention,
                message: legitimate_string.notifications.phishingProbability(data.probability)
            });
        } 
        else if (data.result === 'PHISHING') {
            // Create a notification
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'warning.png',
                title: phishing_string.notifications.attention,
                message: phishing_string.notifications.phishingProbability(data.probability)
            });
        }
    })

}

const legitimate_string = {
    notifications: {
        attention: 'Attention!',
        phishingProbability: function(probability) {
            return `This site has ${probability}% chance of being Legitimate`;
        }
    },
};

const phishing_string = {
    notifications: {
        attention: 'Attention!',
        phishingProbability: function(probability) {
            return `This site has ${probability}% chance of being Phishing`;
        }
    },
};
