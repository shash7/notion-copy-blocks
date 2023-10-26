/**
 * Utility functions
 */

// import * as Sentry from "@sentry/browser";

// Sentry.init({
//   dsn: "https://7ab0291cdbc745478aca0223cfa94877@o212710.ingest.sentry.io/6686204",

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

let baseApiUrl = "http://localhost:4000";
let baseAppUrl = "http://localhost:8080";

if (process.env.NODE_ENV !== "development") {
  baseApiUrl = "https://api.swipekit.app";
  baseAppUrl = "https://app.swipekit.app";
}

let setStorage = async function (key = "um/token", data) {
  let obj = {};
  obj[key] = data;
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(obj, function (hmm) {
      resolve(hmm);
    });
  });
};

let getStorage = async function (key = "um/token") {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (data) => {
      data = data[key] || null;
      resolve(data);
    });
  });
};

let getActiveTab = async function () {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currTab = tabs[0];
      if (currTab) {
        // Sanity check
        /* do stuff */
      }
      resolve(currTab);
    });
  });
};

/**
 * Main function init, event listeners and stuff
 */
(function (browser) {
  async function onMessage(request, sender, sendResponse) {
    return true;
  }

  async function onInit(data) {
    let reason = data.reason || "update";

    if (reason === "install") {
      // browser.tabs.create({
      //   url: `${baseAppUrl}?onboard=2`,
      // });
    }

    let id = browser.runtime.id; //kemnhgakmihbnggidodeabnmgjlgeknp

    let url = `chrome-extension://${id}/options.html`;

    chrome.runtime.onMessageExternal.addListener(async function (request, sender, sendResponse) {
      // if (sender.url === blocklistedWebsite) return; // don't allow this web page access
      // if (request.openUrlInEditor) openUrl(request.openUrlInEditor);
      return true;
    });
  }

  browser.runtime.onMessage.addListener(onMessage);

  browser.runtime.onInstalled.addListener(onInit);
})(chrome);
