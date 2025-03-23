// the value of `__DEFAULT_INSTANCE__` is set by webpack according to the `instance` argument provided
// to `yarn dev` or `yarn build`
export const DEFAULT_INSTANCE = __DEFAULT_INSTANCE__;
const TROTTO_INSTANCE_KEY = 'trottoInstanceUrl';

// For Manifest V3 service worker compatibility, we need to handle local storage differently
// Service workers don't have direct access to localStorage
export const getInstanceUrl = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(TROTTO_INSTANCE_KEY) || DEFAULT_INSTANCE;
  }
  // Fallback for service worker context
  return DEFAULT_INSTANCE;
};

export const setInstanceUrl = (url) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TROTTO_INSTANCE_KEY, url);
  }
  // In a service worker context, we might want to use chrome.storage instead
  // This would require additional implementation
};
