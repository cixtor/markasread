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

var debug = function (text) {
	if (window.console) {
		console.log(text);
	}
};

var fixCampaignUrl = function (url) {
	var data = url.match(/([&\?]?utm_[a-z_]+=.*)/);

	if (data === null) {
		return url;
	}

	var newurl = url.replace(data[1], '');

	if (window.console) {
		console.log(
			'MarkAsRead fix: %c' +
			url + '%c -> %c' + newurl,
			'color:red', '', 'color:green'
		);
	}

	return newurl;
};

var fixAmazonUrl = function (url) {
	var data = url.match(/amazon\.com\/[^\/]+\/dp\/([0-9A-Z]+)/);

	if (data === null) {
		return url;
	}

	var template = 'https://www.amazon.com/a/dp/{{CODE}}';
	var newurl = template.replace('{{CODE}}', data[1]);

	if (window.console) {
		console.log(
			'MarkAsRead fix: %c' +
			url + '%c -> %c' + newurl,
			'color:red', '', 'color:green'
		);
	}

	return newurl;
};

var fixMaliciousUrls = function () {
	var links = document.links;

	debug('MarkAsRead found ' + links.length + ' links');

	for (var key in links) {
		if (typeof links[key] === 'object') {
			links[key].href = fixCampaignUrl(links[key].href);
			links[key].href = fixAmazonUrl(links[key].href);
		}
	}
};

var getDocumentLinks = function (fixUrls) {
	if (document.getElementById('siteTable_organic')) {
		debug('Removing Reddit organic section');
		document.getElementById('siteTable_organic').remove()
	}

	if (fixUrls === true) {
		fixMaliciousUrls();
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

var getImportantUrls = function () {
	var links = getDocumentLinks();
	var total = links.length;
	var urls = [];

	for (var key = 0; key < total; key++) {
		if (isImportantLink(links[key])) {
			urls.push(links[key].href);
		}
	}

	return urls;
};

var getActionIcon = function (status) {
	var color = (status ? 'blue' : 'red');

	return {
		'16': 'icons/' + color + '/16.png',
		'19': 'icons/' + color + '/19.png',
		'32': 'icons/' + color + '/32.png',
		'38': 'icons/' + color + '/38.png',
		'48': 'icons/' + color + '/48.png',
		'128': 'icons/' + color + '/128.png'
	};
};
