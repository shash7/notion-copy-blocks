<template>
  <div id="app">
    <div class="container">
      <div class="c-ext-popup">
        <img src="/icons/128.png" />
      </div>
    </div>
  </div>
</template>

<script>
let setStorage = async function (key = "um/token", data) {
  let obj = {};
  obj[key] = data;
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(obj, function (hmm) {
      resolve(hmm);
    });
  });
};

export default {
  components: {},

  data: function () {
    return {};
  },

  computed: {},

  methods: {},

  created: function () {},
};
</script>

<style lang="scss">
#app {
}

html {
  width: 320px;
  height: 460px;
}

.c-ext-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > img {
    margin-bottom: var(--spacer-sm) !important;
  }

  &__footer {
    padding: var(--spacer) 0;
    margin-top: auto;
    text-align: center;
  }
}
</style>
