/* global chrome */
/* jshint forin: false */

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

var globalStatus = false; /* Whether to add or delete */

var debug = function (text) {
	if (window.console) {
		console.log(text);
	}
};

var getDocumentLinks = function () {
	if (document.getElementById('siteTable_organic')) {
		debug('Removing Reddit organic section');
		document.getElementById('siteTable_organic').remove()
	}

	return document.links;
};

var isImportantLink = function (link) {
	var important = {
		'title': 'https://www.reddit.com/',
		'hdrlnk': 'https://www.craigslist.org/',
		'storylink': 'https://news.ycombinator.com/',
		'montana-item-title': 'https://www.designernews.co/',
	};

	if (link.className !== undefined) {
		var classes = link.className.split('\u0020');

		for (var key in classes) {
			if (important.hasOwnProperty(classes[key])) {
				return true;
			}
		}
	}

	return false;
};

var getIcon = function (status) {
	var color = (status ? 'blue' : 'red');

	return {
		'16': 'icons/' + color + '/16.png',
		'19': 'icons/' + color + '/19.png',
		'32': 'icons/' + color + '/32.png',
		'38': 'icons/' + color + '/38.png',
		'48': 'icons/' + color + '/48.png',
		'128': 'icons/' + color + '/128.png'
	};
}

var markAsRead = function () {
	var urls = [];
	var links = getDocumentLinks();
	var total = links.length;

	for (var key = 0; key < total; key++) {
		if (isImportantLink(links[key])) {
			urls.push(links[key].href);
		}
	}

	if (urls.length > 0) {
		if (globalStatus) {
			debug('MarkAsRead (add): ' + urls.length);
		} else {
			debug('MarkAsRead (del): ' + urls.length);
		}

		chrome.runtime.sendMessage({
			urls: urls,
			visited: globalStatus,
			browserIcon: getIcon(globalStatus)
		});

		globalStatus = !globalStatus;
	} else {
		debug('MarkAsRead (err): no_important_links');
	}
};
