// 初始 badge 设置
chrome.browserAction.setBadgeText({
    text: "On",
});
chrome.browserAction.setBadgeBackgroundColor({
    color: "red",
});

// 初始状态设置
chrome.storage.sync.set({ enabled: true }, function () {
    console.log("Value is set to ", { enabled: true });
});

// 接收 content script 请求，查询当前状态返回
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.storage.sync.get(["enabled"], function (result) {
        sendResponse({ enabled: result.enabled });
    });
    return true;
});

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.storage.sync.get(["enabled"], function (result) {
        var current_state = !result.enabled;

        chrome.storage.sync.set({ enabled: current_state }, function () {
            console.log("Value is set to ", { enabled: current_state });
        });

        if (current_state) {
            chrome.browserAction.setBadgeText({
                text: "On",
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: "red",
            });
        } else {
            chrome.browserAction.setBadgeText({
                text: "Off",
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: "green",
            });
        }
    });
});

// 当状态有变化时，回调函数中发送给前端
chrome.storage.onChanged.addListener(function (changes, areaName) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { enabled: changes.enabled.newValue },
            (response) => { }
        );
    });
});
