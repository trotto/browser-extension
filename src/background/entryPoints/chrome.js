import { Background } from '../background.js';
import { Api } from '../../apis/chrome.js';


const background = new Background(new Api());

background.run();
