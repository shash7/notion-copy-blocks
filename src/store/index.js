import Vue from "vue";
import Vuex from "vuex";

import { store } from "@swipekit/lib/store";
import users from "./users";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    showWidget: false,
    extensionId: `gojmmkhaiojimnnjhhilmhjmhdbdagod`,
    demo: false,
    baseUrl: /*"https://api.swipekit.app/", */ "http://localhost:4000/",
  },
  getters: {
    demo: function (state) {
      return state.demo;
    },
    showWidget: function (state) {
      return state.showWidget;
    },
    extensionId: function (state) {
      return state.extensionId;
    },
    baseUrl: function (state) {
      return state.baseUrl;
    },
  },
  mutations: {
    SET_WIDGET: function (state, condition) {
      state.showWidget = condition;
    },
  },
  actions: {
    async init(store) {
      await store.dispatch("config/init", {
        env: "development", //process.env.NODE_ENV,
        mode: "EXTENSION",
      });

      await store.dispatch("users/init", { isExtension: true });

      //await store.dispatch("boards/init");

      //await store.dispatch("blocks/init");

      await store.dispatch("message/init");

      // ---

      if (store.rootGetters["users/isAuth"]) {
        await store.dispatch("afterLogin");
      }

      return true;
    },

    async afterLogin(store) {
      await store.dispatch("boards/afterLogin");

      //await store.dispatch("blocks/afterLogin");

      return true;
    },

    async afterLogout(store) {
      await store.dispatch("blocks/afterLogout");

      await store.dispatch("boards/afterLogout");

      return true;
    },

    async showWidget(store) {
      store.commit("SET_WIDGET", true);
    },
    async hideWidget(store) {
      store.commit("SET_WIDGET", false);
    },
    async logout(store) {
      await store.dispatch("users/logout");
    },
  },
  modules: {
    config: store.config,
    app: store.app,
    ads: store.ads,
    boards: store.boards,
    users: users,
    events: store.events,
    message: store.message,
  },
});
