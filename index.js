export default store => {
  store.getters = new Proxy(store.getters, {
    get(target, name) {
      if (name in target) {
        return target[name];
      }
      console.warn("A nonexistent getter has been called:", name);
    }
  });
};
