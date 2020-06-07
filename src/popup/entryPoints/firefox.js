import { Popup } from '../popup.js';
import { Api } from '../../apis/firefox.js';


const popup = new Popup(new Api());

popup.run();
