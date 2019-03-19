module.exports = (_options = {}) => {
  const defaultOptions = {
    logger: console.warn,
    silent: process.env.NODE_ENV === 'production',
  };
  const options = Object.assign({}, defaultOptions, _options);

  if (options.silent) {
    return () => {};
  }

  return store => {
    store.getters = new Proxy(store.getters, {
      get(target, name) {
        if (name in target) {
          return target[name];
        }
        options.logger('A nonexistent getter has been called:', name);
      },
    });
  };
};
