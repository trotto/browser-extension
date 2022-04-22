import { getInstanceUrl, setInstanceUrl, DEFAULT_INSTANCE } from './config';

let input = document.getElementById('instance_url');
input.value = getInstanceUrl();

let save = document.getElementById('save');
save.onclick = () => setInstanceUrl(input.value);

let reset = document.getElementById('reset');
reset.onclick = () => {
  input.value = DEFAULT_INSTANCE;
  setInstanceUrl(DEFAULT_INSTANCE);
}
