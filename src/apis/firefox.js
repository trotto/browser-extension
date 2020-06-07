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

    this.webRequest = {
      onBeforeRequest: browser.webRequest.onBeforeRequest
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
