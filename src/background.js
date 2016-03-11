chrome.browserAction.onClicked.addListener(function (activeTab) {
    var newURL = chrome.extension.getURL("index.html");
    chrome.tabs.create({ url: newURL });
});