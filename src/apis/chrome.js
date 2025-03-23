const browser = require('webextension-polyfill');

export class Api {
  constructor() {
    this.runtime = {
      onInstalled: {
        addListener: (callback) => chrome.runtime.onInstalled.addListener(callback)
      }
    };

    this.storage = {
      onChanged: {
      addListener: (callback) => chrome.storage.onChanged.addListener(callback)
      },
      managed: {
      get: browser.storage.managed.get
      },
      local: chrome.storage.local
    };

    // Replace webRequest with declarativeNetRequest
    this.declarativeNetRequest = {
      updateDynamicRules: chrome.declarativeNetRequest ? 
        chrome.declarativeNetRequest.updateDynamicRules : 
        (rules) => console.error("declarativeNetRequest API not available")
    };

    this.tabs = {
      query: browser.tabs.query,
      create: browser.tabs.create,
      remove: browser.tabs.remove,
      update: browser.tabs.update,
      onUpdated: {
        addListener: (callback) => browser.tabs.onUpdated.addListener(callback)
      }
    };
  }
}
