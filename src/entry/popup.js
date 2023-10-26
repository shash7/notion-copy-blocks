import Vue from "vue";
import App from "../view/popup.vue";

import store from "../store";

/* eslint-disable no-new */
new Vue({
  store: store,
  el: "#app",
  render: (h) => h(App),
});
