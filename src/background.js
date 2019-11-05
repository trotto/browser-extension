const BLACKLISTED_HOSTNAMES = ['localhost'];
const DEFAULT_INSTANCE = 'https://trot.to';

const getInstanceUrl = () => {
  return DEFAULT_INSTANCE;
};

const getInstanceUrlAsync = () => {
  return new Promise(resolve => resolve(DEFAULT_INSTANCE));
};


chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      const [scheme, rest] = details.url.split('://');
      const [bareUrl, query] = rest.split('?');
      const hostnameAndPort = bareUrl.split('/')[0];

      if (query === '__tr=ot') {
        return {redirectUrl: details.url.split('?')[0]};
      }

      if (hostnameAndPort === 'go' && query === 'wt') {
        return {redirectUrl: 'https://trot.to?wt'};
      }

      if (hostnameAndPort.indexOf('.') !== -1
          || hostnameAndPort.indexOf(':') !== -1
          || BLACKLISTED_HOSTNAMES.indexOf(hostnameAndPort) !== -1
          || (query && decodeURIComponent(query.trim()))
          || ['http', 'https'].indexOf(scheme) === -1) {
        return {};
      }

      var fullShorcut;

      const shortcuts = [
        {
          shortcut: 'go/',
          destinationPrefix: ''
        }
      ];

      for (var i in shortcuts) {
        var shortcut = shortcuts[i];
        if (bareUrl.slice(0, shortcut.shortcut.length) === shortcut.shortcut) {
          fullShorcut = bareUrl.slice(shortcut.shortcut.length - 1);  // keep leading "/"

          if (fullShorcut !== '/') {
            fullShorcut = shortcut.destinationPrefix + fullShorcut;
            fullShorcut += '?s=crx';
          }
          break;
        }
      }

      if (fullShorcut === undefined) {
        fullShorcut = '/' + bareUrl + '?s=crx&sc=' + scheme;
      }

      return {redirectUrl: getInstanceUrl() + fullShorcut};
    },
    {urls: ["<all_urls>"]},  // will match app URLs that the extension requested permission to ("go/" etc.)
    ["blocking"]);

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason !== 'install') return;

  getInstanceUrlAsync().then(instanceUrl => {
    if (instanceUrl !== DEFAULT_INSTANCE) return;

    chrome.tabs.query(
      {currentWindow: true, url: '*://www.trot.to/getting-started'},
      function(tabs) {
        // If there is a tab matching this query, then the user was going through the walkthrough before they installed
        // the app. So reload that tab and focus on it so 1) Chrome learns to treat "go/whatever" as a URL and 2) the
        // user can continue the walkthrough experience.
        if (tabs.length === 0) {
          chrome.tabs.create({
            url: 'https://go/trotto-init'
          });
        } else {
          chrome.tabs.update(tabs[0].id, {url: 'https://go/trotto-init', active: true});
        }
      }
    );
  });
});
