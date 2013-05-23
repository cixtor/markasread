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

var processHistoryAction = function (request, sender) {
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
};

var processInterfaceAction = function (request, sender) {
	var total = request.urls.length;

	if (total > 0) {
		chrome.browserAction.setBadgeText({
			tabId: sender.tab.id,
			text: (total).toString()
		});
	} else {
		chrome.browserAction.disable(sender.tab.id);
	}
};

chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(tab.id, {
		'code': 'markAsRead();'
	});
});

chrome.runtime.onMessage.addListener(function (request, sender) {
	/**
	 * Handle the history manipulation.
	 *
	 * If the user clicks the browser action button for the first time the
	 * extension will scan the active page for important links, this is, any
	 * HTML anchor tag listed in news aggregator websites and that lead to
	 * either an internal or external content of the associated article.
	 *
	 * @param  {string} request.scope Action that is being performed.
	 * @return {void}
	 */
	if (request.scope === 'history') {
		processHistoryAction(request, sender);
		setBadgeBackground(request, sender);
	}

	/**
	 * Display number of important links.
	 *
	 * Once a supported website is loaded the extension will scan the active
	 * page for important links, then will try to analyze the history to see if
	 * one of more of these links are already marked as visited, the remaining
	 * URLs will be part of a counter in the badge of the browser action.
	 *
	 * @param  {string} request.scope Action that is being performed.
	 * @return {void}
	 */
	if (request.scope === 'interface') {
		processInterfaceAction(request, sender);
		setBadgeBackground(request, sender);
	}
});
