# vuex-getters-warning-plugin

[![CircleCI](https://circleci.com/gh/ymmooot/vuex-getters-warning-plugin.svg?style=shield)](https://circleci.com/gh/ymmooot/vuex-getters-warning-plugin)
[![version](https://img.shields.io/npm/v/vuex-getters-warning-plugin.svg)](https://www.npmjs.com/package/vuex-getters-warning-plugin)

A plugin for Vuex which dumps warning when accessing non-existent getters.

## Usage

```js
import getterWarning from 'vuex-getters-warning-plugin';

const store = new Vuex.Store({
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
```

Once registerd it, you will get warning in the console when accessing non-exsistent getters.

```js
const age = vm.$store.getters.age;
// A nonexistent getter has been called: age
```

## Options

### logger `Function`

You can specify the logger called on warning. The logger receives the two arguments, a static message from this plugin and the called target key.

```js
const throwError = (...args) => { throw new Error(args.join(' ')) }

const store = new Vuex.Store({
  plugins: [getterWarning({
    logger: throwError,
  })],
  state: {
    name: 'Alice',
  },
  getters: {
    nameWithHonorific(state) {
      return `Ms. ${state.name}`;
    },
  },
});

const age = vm.$store.getters.age;
// Error: A nonexistent getter has been called: age
```

default: `console.warn`

### silent `Boolean`

This can prevent installing this plugin.

```js
const store = new Vuex.Store({
  plugins: [getterWarning({
    silent: process.env.NODE_ENV !== 'development',
  })],
  state: {
    name: 'Alice',
  },
  getters: {
    nameWithHonorific(state) {
      return `Ms. ${state.name}`;
    },
  },
});

const age = vm.$store.getters.age;
// nothing dumps.
```

default: `process.env.NODE_ENV === 'production'`
