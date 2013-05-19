/* global debug */
/* global chrome */
/* global getActionIcon */
/* global getDocumentLinks */
/* global getImportantUrls */

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

/* False if the links were visited, true if not */
var globalStatus = false;

var markAsRead = function () {
	var urls = getImportantUrls();
	var total = urls.length;

	if (total > 0) {
		if (globalStatus) {
			debug('MarkAsRead (add): ' + total);
		} else {
			debug('MarkAsRead (del): ' + total);
		}

		chrome.runtime.sendMessage({
			scope: 'history',
			visited: globalStatus,
			browserIcon: getActionIcon(globalStatus),
			urls: urls
		});

		globalStatus = !globalStatus;
	} else {
		debug('MarkAsRead (err): no_important_links');
	}
};

/* Display number of important links in the badge */
setTimeout(function () {
	/* Fix all URLs */
	getDocumentLinks(true);

	/* Count important URLs */
	chrome.runtime.sendMessage({
		scope: 'interface',
		visited: !globalStatus,
		urls: getImportantUrls()
	});
}, 5);
