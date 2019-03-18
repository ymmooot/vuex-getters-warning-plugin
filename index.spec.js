import Vue from 'vue';
import Vuex from 'vuex';
import getterWarning from './index';

Vue.use(Vuex);

console.warn = jest.fn();

const store = new Vuex.Store({
  plugins: [getterWarning],
  state: {
    name: 'Alice',
  },
  getters: {
    nameWithHonorific(state) {
      return `Ms. ${state.name}`;
    },
  },
});

beforeEach(() => {
  console.warn
  console.warn.mockClear();
})

it('returns wright value when accessing existent getters', () => {
  expect(store.state.name).toBe('Alice');
  expect(store.getters.nameWithHonorific).toBe('Ms. Alice');
});

it('dumps a warning when accessing non-existent getters', () => {
  expect(store.getters.hey).toBe(undefined);
  expect(console.warn).toHaveBeenCalledTimes(1);
  expect(console.warn).toHaveBeenCalledWith('A nonexistent getter has been called:', 'hey')
});
