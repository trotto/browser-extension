import { Background } from '../background.js';
import { Api } from '../../apis/firefox.js';


const background = new Background(new Api());

background.run();
