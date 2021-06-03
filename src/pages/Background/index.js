console.log('This is the background page.');
console.log('Put the background scripts here.');


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.sendMessage(tabs[0].id, {type: "urlUpdated"}); // sends msg to popup when url changes
});
