// the value of `__DEFAULT_INSTANCE__` is set by webpack according to the `instance` argument provided
// to `yarn dev` or `yarn build`
export const DEFAULT_INSTANCE = __DEFAULT_INSTANCE__;
const TROTTO_INSTANCE_KEY = 'trottoInstanceUrl';

export const getInstanceUrl = () => localStorage.getItem(TROTTO_INSTANCE_KEY) || DEFAULT_INSTANCE;
export const setInstanceUrl = (url) => localStorage.setItem(TROTTO_INSTANCE_KEY, url);
