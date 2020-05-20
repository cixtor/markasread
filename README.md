# Mark As Read

Chrome extension based on [Mark All As Read](https://github.com/imkevinxu/mark-all-as-read) to add the relevant links in the current web page to the web browser history, consequently applying the `:visited` state and, depending on the website’s design, changing their color to pretend the links have already been visited.

The original project has an interesting behavior, it pushes all links in the page to the browser history without any special reasoning. Google Chrome stores the history in a SQlite database that is locked while the browser is running and that after certain amount of data starts making the navigation slow. This fork aims to ease the amount of URLs pushed to the history to reduce the consumption, for instance, visiting the front page of Reddit without an open session forces the original project to push more than two hundred links to the history, while this version pushes only the main twenty-five links.

![screenshot](screenshot.gif)

## Support

The list of supported websites is limited due to the way this version of the extension filters the important links from the active page. To differentiate from main and normal links this extension compares the associated CSS class names, for example, Reddit associates the CSS class name _"title"_ to the HTML anchor tags pointing to their content:

- [x] https://www.reddit.com/
- [x] https://www.craigslist.org/
- [x] https://news.ycombinator.com/
- [x] https://www.designernews.co/
