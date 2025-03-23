import { Background } from '../background.js';
import { Api } from '../../apis/chrome.js';

// In Manifest V3, we need to create the background instance right away
const background = new Background(new Api());
background.run();

// Service worker needs to be kept alive when it's needed
// This can be handled by Chrome for most event listeners, 
// but we can also explicitly use event handlers if needed
