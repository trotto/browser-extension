// the value of `__DEFAULT_INSTANCE__` is set by webpack according to the `instance` argument provided
// to `yarn dev` or `yarn build`
export const DEFAULT_INSTANCE = __DEFAULT_INSTANCE__;

export const getInstanceUrl = () => localStorage.getItem('trottoInstanceUrl') || DEFAULT_INSTANCE;
