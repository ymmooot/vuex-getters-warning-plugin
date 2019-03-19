import Vue from 'vue';
import Vuex from 'vuex';
import getterWarning from './index';

Vue.use(Vuex);

const createStore = options => new Vuex.Store({
  plugins: [getterWarning(options)],
  state: {
    name: 'Alice',
  },
  getters: {
    nameWithHonorific(state) {
      return `Ms. ${state.name}`;
    },
  },
});

console.warn = jest.fn();

afterEach(() => {
  console.warn.mockClear();
});

describe('the happy paths', () => {
    it('returns wright value when accessing existent getters', () => {
    const store = createStore();
    expect(store.state.name).toBe('Alice');
    expect(store.getters.nameWithHonorific).toBe('Ms. Alice');
  });
});

describe('silent mode', () => {
  it('returns a function to do nothing in "production" environment', () => {
    const env = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const plugin = getterWarning();
    expect(plugin.toString()).toBe('() => {}');
    process.env.NODE_ENV = env;
  });

  it('returns a function to do nothing with the truthy "silent" option', () => {
    const env = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const plugin = getterWarning({ silent: true });
    expect(plugin.toString()).toBe('() => {}');
    process.env.NODE_ENV = env;
  });
});

describe('logging on accessing to non-existent getters', () => {
  it('calls a given logger', () => {
    const mockLogger = jest.fn();
    const store = createStore({ logger: mockLogger });
    expect(store.getters.hey).toBe(undefined);
    expect(mockLogger).toHaveBeenCalledTimes(1);
    expect(mockLogger).toHaveBeenCalledWith('A nonexistent getter has been called:', 'hey');
  });

  it('can even throw an error', () => {
    const fragileLogger = (...args) => {
      throw new Error(args.join(':'));
    };
    const store = createStore({ logger: fragileLogger });
    expect(() => {
      store.getters.theKeyDoesNotExist;
    }).toThrow(Error);
  });

  it('calls console.warn as default', () => {
    const store = createStore();
    expect(store.getters.hey).toBe(undefined);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith('A nonexistent getter has been called:', 'hey');
  });
});
