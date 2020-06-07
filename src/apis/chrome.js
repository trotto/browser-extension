const browser = require('webextension-polyfill');


export class Api {
  constructor() {
    this.runtime = {
      onInstalled: {
        // note: this doesn't work: `addListener: chrome.runtime.onInstalled.addListener`
        addListener: (callback) => chrome.runtime.onInstalled.addListener(callback)
      }
    };

    this.storage = {
      onChanged: {
        addListener: (callback) => chrome.storage.onChanged.addListener(callback)
      },
      managed: {
        get: browser.storage.managed.get
      }
    };

    this.webRequest = {
      onBeforeRequest: browser.webRequest.onBeforeRequest
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
