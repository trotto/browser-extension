const DEFAULT_INSTANCE = 'https://trot.to';

const getInstanceUrl = () => {
  return localStorage.getItem('trottoInstanceUrl') || DEFAULT_INSTANCE;
};

chrome.tabs.create({ url: getInstanceUrl() });
