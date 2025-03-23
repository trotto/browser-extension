import { DEFAULT_INSTANCE, getInstanceUrl } from '../config';

const BLACKLISTED_HOSTNAMES = ['localhost'];


export class Background {
  constructor(apiImplementation) {
    this.api = apiImplementation;
    this.ruleIdCounter = 1; // For declarativeNetRequest rule IDs
  }

  run() {
    this.registerListeners();
    this.setupDeclarativeRules();
  }

  registerListeners() {
    this.api.runtime.onInstalled.addListener(this.handleInstall.bind(this));
    this.api.storage.onChanged.addListener(this.handleStorageChange.bind(this));
  }

  // Set up declarativeNetRequest rules to replace webRequest blocking
  setupDeclarativeRules() {
    // We'll use a dynamic rule to handle redirect logic
    // Note: The exact implementation depends on the specific URLs you need to match
    // This is a basic implementation that may need refinement
    const rules = [{
      id: 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: { regexSubstitution: this.getRegexSubstitution() }
      },
      condition: {
        regexFilter: '^(http|https)://go/.*',
        resourceTypes: ['main_frame']
      }
    }];

    // Update the rules
    this.api.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1], // Remove existing rule if it exists
      addRules: rules
    });
  }

  // Helper function to generate regex substitution based on instance URL
  getRegexSubstitution() {
    const instanceUrl = getInstanceUrl();
    return `${instanceUrl}\\1?s=crx`;
  }

  storeInstanceUrl() {
    const store = (url) => window.localStorage.setItem('trottoInstanceUrl', url);

    try {
      this.api.storage.managed.get(['TrottoInstanceUrl']).then((result) => {
        store(result.TrottoInstanceUrl || DEFAULT_INSTANCE);
        // Update rules after instance URL change
        this.setupDeclarativeRules();
      });
    } catch(e) {
      store(DEFAULT_INSTANCE);
      this.setupDeclarativeRules();
    }
  }

  getInstanceUrlAsync() {
    return new Promise(resolve => {
      this.api.storage.managed.get(['TrottoInstanceUrl']).then((result) => {
        resolve(result.TrottoInstanceUrl || DEFAULT_INSTANCE);
      });
    });
  };

  // This method is kept for reference but won't be directly used anymore
  // The logic will be applied via declarativeNetRequest instead
  rewriteGoRequests(details) {
    const [scheme, rest] = details.url.split('://');
    const [bareUrl, query] = rest.split('?');
    const hostnameAndPort = bareUrl.split('/')[0];

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
  }

  handleInstall(details) {
    this.storeInstanceUrl();

    if (details.reason !== 'install') return;

    this.getInstanceUrlAsync().then(instanceUrl => {
      if (instanceUrl !== DEFAULT_INSTANCE) return;

      this.api.tabs.query({currentWindow: true, url: '*://www.trot.to/getting-started'})
          .then((tabs) => {
            // If there is a tab matching this query, then the user was going through the walkthrough before they
            // installed the extension. So reload that tab and focus on it so 1) the browser learns to treat
            // "go/whatever" as a URL and 2) the user can continue the walkthrough experience.
            if (tabs.length === 0) {
              // then open a new tab next to the current tab
              this.api.tabs.query({active: true}).then((tabs) => {
                var createArgs = {
                  url: 'https://go/'
                };

                if (tabs.length === 1) {
                  createArgs.index = tabs[0].index + 1;
                }

                this.api.tabs.create(createArgs).then((newTab) => {
                  this.api.tabs.onUpdated.addListener((tabId, changeInfo) => {
                    if (tabId !== newTab.id) return;

                    if (changeInfo.status === 'loading') this.api.tabs.remove(newTab.id);
                  });
                });
              });
            } else {
              this.api.tabs.update(tabs[0].id, {url: 'https://go/__init__', active: true});
            }
          });
    });
  }

  handleStorageChange(changes, namespace) {
    this.storeInstanceUrl();
  }
}
