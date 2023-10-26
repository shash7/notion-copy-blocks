import api from "@swipekit/lib/api";
import parseISO from "date-fns/parseISO";
import differenceInDays from "date-fns/differenceInDays";
import sub from "date-fns/sub";
import { parse } from "date-fns";

let store = {
  namespaced: true,
  state: {
    user: {},
    isExtension: false,
    trialLength: 10,
  },
  getters: {
    user: function (state) {
      return state.user;
    },
    isAuth: function (state) {
      if (state.user && state.user.id) {
        return true;
      }
      return false;
    },
    trialStarted: function (state, getters, rootState, rootGetters) {
      let workspace = rootGetters["workspaces/all"];

      if (!workspace) {
        return false;
      }

      return workspace.trialStartedAt;
    },
    trialStartedDate: function (state, getters, rootState, rootGetters) {
      let workspace = rootGetters["workspaces/all"];

      if (!workspace) {
        return false;
      }

      let date = parseISO(workspace.trialStartedAt);

      return date;
    },
    trialStartedDifference: function (state, getters, rootState, rootGetters) {
      let workspace = rootGetters["workspaces/all"];

      if (!workspace) {
        return false;
      }

      let date = workspace.trialStartedAt;

      if (!date) {
        return;
      }

      date = parseISO(date);

      let trialLength = state.trialLength;

      let trialEndDate = sub(new Date(), {
        days: trialLength + 1,
      });

      let diff = differenceInDays(date, trialEndDate);

      return diff;
    },
    isTrialOver: function (state, getters, rootState, rootGetters) {
      let workspace = rootGetters["workspaces/all"];

      if (!workspace) {
        return false;
      }

      if (workspace.plan === "DEACTIVATED") {
        return true;
      }
      return false;
      // let diff = getters.trialStartedDifference;

      // if (diff > state.trialLength) {
      //   return true;
      // }
      // return false;
    },
    isPaid: function (state, getters, rootState, rootGetters) {
      let workspace = rootGetters["workspaces/all"];
      if (!workspace) {
        return false;
      }
      if (workspace.plan === "PRO") {
        return true;
      }

      if (workspace.isPaying === true) {
        return true;
      }
      return false;
    },
    isAdmin: function (state) {
      if (state.user && state.user.type === "ADMIN") {
        return true;
      }
      return false;
    },
  },
  mutations: {
    SET: function (state, user) {
      if (user) {
        state.user = user;
      } else {
        state.user = {};
      }
    },
  },
  actions: {
    async init(store, opts = {}) {
      let isExtension = opts.isExtension || false;
      store.state.isExtension = isExtension;

      let res = await store.dispatch("headlessLogin").catch((err) => {
        //console.log(err);
      });
      return true;
    },

    async getUser(store) {
      let users = await api.users.get();
      if (users.length > 0) {
        store.commit("SET", users[0]);
      }
    },

    async setUser(store) {},

    async create(store, ad) {},

    async signup(store, form) {
      let config = store.rootState.config;
      form.meta = {
        browser: config.browser,
        mode: config.mode,
        screenX: config.screenX,
        screenY: config.screenY,
        os: config.os,
      };
      let response = null;
      try {
        response = await api.users.signup(form);
      } catch (err) {
        throw err;
      }

      store.dispatch("identify", response);

      store.commit("SET", response);

      return response;
    },

    async update(store, form) {
      let user = store.state.user;
      form.id = user.id;
      let response = null;
      try {
        response = await api.users.update(form);
      } catch (err) {
        throw err;
      }

      store.commit("SET", response);

      //store.dispatch("afterLogin", null, { root: true });

      return response;
    },

    async updateMarketing(store) {
      let user = store.state.user;

      let marketing = user.marketing || {};

      let config = store.rootState.config;

      let screen = `${config.screenX}x${config.screenY}`;

      marketing.screen = screen;
      marketing.timezone = config.timezone;
      marketing.utcOffset = config.utcOffset;

      let form = {
        id: user.id,
        marketing: marketing,
      };

      user = await api.users.update(form).catch((err) => {
        console.log(err);
      });

      if (user) {
        store.commit("SET", user);
      }
    },

    /**
     * Basically, gets the user if they are logged in
     * If not logged in, returns null
     * If logged in, sets the user
     *
     * Run this ideally, before init
     */
    async headlessLogin(store) {
      let user = null;
      if (!store.state.isExtension) {
        user = await api.users.headlessLogin();
      } else {
        user = await api.users.headlessChromeLogin();
      }
      if (user) {
        store.commit("SET", user);

        store.dispatch("identify", user);
      }

      //store.dispatch("afterLogin", null, { root: true });

      return user;
    },

    async resetPassword(store, form) {
      let payload = null;
      try {
        payload = await api.users.resetPassword(form);
      } catch (err) {
        throw err;
      }

      return payload;
    },

    async updatePassword(store, form) {
      let user = null;
      try {
        user = await api.users.updatePassword(form);
      } catch (err) {
        throw err;
      }

      if (user) {
        store.commit("SET", user);
      }

      return user;
    },

    /**
     * Logs in user using the form pass as payload
     * If user logs in successfully, they are committed to the store
     */
    async login(store, form) {
      let user = null;
      try {
        user = await api.users.login(form);
      } catch (err) {
        throw err;
      }

      if (user) {
        store.commit("SET", user);

        store.dispatch("identify", user);
      }

      await store.dispatch("sendTokenToChromeExtension");

      return user;
    },

    async sendTokenToChromeExtension(store, auth = true) {
      let extensionId = store.rootState.extensionId;
      let token = "";
      if (auth) {
        token = (await api.users.getToken()) || "";
      }
      if (!chrome.runtime) {
        return;
      }
      chrome.runtime.sendMessage(extensionId, { type: `auth`, jwt: token }, (response) => {});
    },

    async logout(store) {
      // Sometimes the server returns a 403, not sure how to handle it for now but the frontend assumes that the cookie is now invalid/user's session has been destroyed successfully
      let success = await api.users.logout().catch((err) => {
        console.log(err);
      });

      store.dispatch("message/onLogout", null, { root: true });

      // Somewhere over here also call afterLogout on the main store so other modules can flush their state out
      //if (success) {
      store.dispatch("afterLogout", null, { root: true });
      store.commit("SET");
      store.dispatch("sendTokenToChromeExtension", false);
      //}
    },

    async upgrade(store, plan) {
      let data = await api.users.upgrade(plan);

      if (data && data.url) {
        window.location = data.url;
      }
    },

    async getPie(store) {
      let user = store.state.user;

      if (!user) {
        return;
      }

      let pie = await api.users.pie();

      return pie;
    },

    async acceptInvite(store, form) {
      let response = await api.users.acceptInvite(form);

      if (response && response.data) {
        store.commit("SET", response.data);
      }

      return response.data;
    },

    identify(user) {
      if (typeof posthog === "undefined") {
        console.log("posthog undefined");
        return;
      }
      if (!window) {
        console.log("window undefined");
        return;
      }

      window.posthog.identify(user.id);
    },
  },
  modules: {},
};

export default store;
