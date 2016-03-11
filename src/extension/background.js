chrome.browserAction.onClicked.addListener(function (activeTab) {
    var newURL = chrome.extension.getURL("/app/index.html");
    chrome.tabs.create({ url: newURL });
});