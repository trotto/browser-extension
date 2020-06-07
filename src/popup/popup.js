import { DEFAULT_INSTANCE, getInstanceUrl } from '../config';


export class Popup {
  constructor(apiImplementation) {
    this.api = apiImplementation;
  }

  run() {
    this.api.tabs.create({ url: getInstanceUrl() })
        .then(() => window.close());
  }
}
