# vuex-getters-warning-plugin
A plugin for Vuex which dumps warning when accessing to non-existent getters.

## usage

```js
import getterWarning from 'vuex-getters-warning-plugin';

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
```

Once registerd it, you will get warning in the console when accessing non-exsistent getters, 

```js
const age = vm.$store.getters.age;
// A nonexistent getter has been called: age
```
