import { DEFAULT_INSTANCE, getInstanceUrl } from '../config';


export class Popup {
  constructor(apiImplementation) {
    this.api = apiImplementation;
  }

  run() {
    let queryOptions = { active: true, currentWindow: true };
    this.api.tabs.query(queryOptions)
      .then(([tab]) => document.getElementById('currentUrl').value = tab.url);
    
    document.getElementById('submit').onclick = () => {
      fetch('https://trot.to/_/api/links', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'api.trot.to',
        },
        body: JSON.stringify({
          "namespace": 'go',
          "shortpath": document.getElementById('shortUrl').value,
          "destination": document.getElementById('currentUrl').value,
          "owner": 'brad@trot.io',
          "visits_count": 0,
        }),
      })
      .then(response => {
        console.log(response.json());
      })
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
    
    
    
    // this.api.tabs.create({ url: getInstanceUrl() })
    //     .then(() => window.close());
  }
}
