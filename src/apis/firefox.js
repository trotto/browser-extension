export class Api {
  constructor() {
    this.runtime = {
      onInstalled: {
        addListener: browser.runtime.onInstalled.addListener
      }
    };

    this.storage = {
      onChanged: {
        addListener: browser.storage.onChanged.addListener
      },
      managed: {
        get: browser.storage.managed.get
      }
    };

    // Replace webRequest with declarativeNetRequest
    this.declarativeNetRequest = {
      updateDynamicRules: browser.declarativeNetRequest ? 
        browser.declarativeNetRequest.updateDynamicRules : 
        (rules) => console.error("declarativeNetRequest API not available")
    };

    this.tabs = {
      query: browser.tabs.query,
      create: browser.tabs.create,
      remove: browser.tabs.remove,
      update: browser.tabs.update,
      onUpdated: {
        addListener: browser.tabs.onUpdated.addListener
      }
    };
  }
}
