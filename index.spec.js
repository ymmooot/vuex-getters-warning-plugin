import Vue from 'vue';
import Vuex from 'vuex';
import getterWarning from './index';

Vue.use(Vuex);

let store;
console.warn = jest.fn();

afterEach(() => {
  store = null;
  console.warn.mockClear();
});

describe('the happy paths', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      plugins: [getterWarning()],
      state: {
        name: 'Alice',
      },
      getters: {
        nameWithHonorific(state) {
          return `Ms. ${state.name}`;
        },
      },
    });
  });

  it('returns wright value when accessing existent getters', () => {
    expect(store.state.name).toBe('Alice');
    expect(store.getters.nameWithHonorific).toBe('Ms. Alice');
  });
});

describe('logging on accessing non-existent getters', () => {
  const createStore = pluginOptions => {
    store = new Vuex.Store({
      plugins: [getterWarning(pluginOptions)],
      state: {
        name: 'Alice',
      },
      getters: {
        nameWithHonorific(state) {
          return `Ms. ${state.name}`;
        },
      },
    });
  };

  it('calls a given logger', () => {
    const mockLogger = jest.fn();
    createStore({ logger: mockLogger });
    expect(store.getters.hey).toBe(undefined);
    expect(mockLogger).toHaveBeenCalledTimes(1);
    expect(mockLogger).toHaveBeenCalledWith('A nonexistent getter has been called:', 'hey');
  });

  it('can even throw an error', () => {
    const fragileLogger = (...args) => {
      throw new Error(...args);
    };
    createStore({ logger: fragileLogger });
    expect(() => {
      store.getters.theKeyDoesNotExist;
    }).toThrow(Error);
  });

  it('calls console.warn as default', () => {
    createStore();
    expect(store.getters.hey).toBe(undefined);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith('A nonexistent getter has been called:', 'hey');
  });

  describe('silent mode', () => {
    it('does nothing in "production" environment', () => {
      const env = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      createStore();
      expect(store.getters.hey).toBe(undefined);
      expect(console.warn).not.toHaveBeenCalled();
      process.env.NODE_ENV = env;
    });

    it('does nothing with the truthy "silent" option', () => {
      createStore({ silent: true });
      expect(store.getters.hey).toBe(undefined);
      expect(console.warn).not.toHaveBeenCalled();
    });
  });
});
