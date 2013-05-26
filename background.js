/* global chrome */

/**
 * Mark links as viewed
 *
 * For a specific list of websites this extension will mark some links are
 * viewed when triggered. This is, for example, in the HackerNews website the
 * main links identified by the CSS class "storylink" will be marked as viewed
 * once the extension is executed. For Reddit the filter change to HTML anchor
 * tags identified by the CSS class "title", and so on.
 *
 * Note that clicking triggering the extension the first time will mark all the
 * appropriate links as visited, second time will mark them as not visited and
 * so on.
 */

chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(null, {
		code: 'markAsRead();'
	});
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	var urls = request.urls;
	var total = urls.length;

	chrome.browserAction.setIcon({
		tabId: sender.tab.id,
		path: request.browserIcon
	});

	for (var key = 0; key < total; key++) {
		var url = {url: urls[key]};

		if (request.visited) {
			chrome.history.deleteUrl(url);
		} else {
			chrome.history.addUrl(url);
		}
	}
});
