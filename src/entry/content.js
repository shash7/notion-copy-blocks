import Vue from "vue";
import Notion from "../view/notion.vue";
import $ from "jquery";
import store from "../store/index";

import polyfill from "webextension-polyfill";
import * as Sentry from "@sentry/browser";

window.Vue = Vue;

window.hasLoaded = false;

console.log("notion-block-copy extension loaded");
console.log(
  "This open source extension adds a handy copy button to the left hand side of most blocks inside any notion page"
);
console.log("For more info, visit notion-block-copy.com");

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: "https://f7114d94999d495b87f3e91a471b8d1f@o212710.ingest.sentry.io/4503940811194368",
    integrations: [],
    release: process.env.VUE_APP_VERSION,
    logErrors: true,
  });
}

/* eslint-disable no-new */
function init() {
  $("html").append('<div class="notion-injection"></div>');
  new Vue({
    store,
    el: ".notion-injection",
    render: (h) => h(Notion),
  });
}

window.addEventListener("load", () => {
  console.log("load");
  if (window.hasLoaded) {
    return;
  }

  init();
});
