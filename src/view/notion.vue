<template>
  <div class="c-notion-block-copy">
    <div
      ref="swipekitButton"
      :class="[
        'swipekit-button',
        { hide: this.hide === true, disabled: disabled === true, processing: processing === true },
      ]"
    >
      <Float ref="float"></Float>
      <button @click.prevent="onCopy">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 13V20C16 21.1046 15.1046 22 14 22H5C3.89543 22 3 21.1046 3 20V8C3 6.89543 3.89543 6 5 6H9M16 13L9 6M16 13H9.5C9.22386 13 9 12.7761 9 12.5V6M21 8V15C21 16.1046 20.1046 17 19 17H17M21 8L14 1M21 8H14.5C14.2239 8 14 7.77614 14 7.5V1M14 1H10C8.89543 1 8 1.89493 8 2.9995V6"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

import axios from "axios";

import Float from "./float";

export default {
  components: {
    Float,
  },

  data: function () {
    return {
      listView: false,
      processing: false,
      disabled: true,
      hide: false,
    };
  },

  computed: {},

  watch: {},

  methods: {
    onCopy: function (e) {
      if (this.processing) {
        return;
      }

      this.$refs.float.addFloat();

      this.processing = true;
      const el = this.$refs.swipekitButton;
      const dataValue = el.getAttribute("data-value");
      if (dataValue) {
        navigator.clipboard
          .writeText(dataValue)
          .then(() => {
            //console.log("Data-value copied to clipboard:", dataValue);
          })
          .catch((error) => {
            console.error("Error copying data-value to clipboard:", error);
          });

        setTimeout(() => {
          this.processing = false;
        }, 400);
      }
    },
    onScroll: function (e) {
      this.disabled = true;
    },
    onMouseMove: function (e) {
      this.disabled = false;
      // Get the current mouse position
      const mouseY = e.clientY;
      const centerX = window.innerWidth / 2;
      const gap = 84;
      const swipekitButton = this.$refs.swipekitButton;

      // Get the element at the center of the screen (centerX) and mouseY
      const el = document.elementFromPoint(centerX, mouseY);

      if (!el) {
        return;
      }

      const notionBlock = el.closest(".notion-selectable");

      if (!notionBlock) {
        return;
      }

      // Do something with the element (e.g., log its tag name)

      //console.log("Element at mouse position:", notionBlock.classList);

      // Get the position of the notionBlock using getBoundingClientRect()
      const elementRect = notionBlock.getBoundingClientRect();

      // Calculate the new position for the ".swipekit-button" div
      const newX = elementRect.right - elementRect.width - gap;
      const newY = elementRect.top;

      // Set the position of the ".swipekit-button" div
      swipekitButton.style.left = newX + "px";
      swipekitButton.style.top = newY + "px";

      const copyTextObj = this.extractCopyableContent(notionBlock);
      const copyText = copyTextObj.value;
      if (copyText) {
        this.hide = false;
      } else {
        this.hide = true;
      }
      swipekitButton.setAttribute("data-value", copyText || "");
      swipekitButton.setAttribute("data-type", copyTextObj.type);
    },
    extractCopyableContent: function (el) {
      let value = ``;
      let type = "n/a";
      if (el.classList.contains("notion-text-block")) {
        value = el.innerText;
        type = "text";
      }
      if (el.classList.contains("notion-header-block")) {
        value = el.innerText;
        type = "header";
      }
      if (el.classList.contains("notion-code-block")) {
        value = el.innerText;
        type = "code";
      }
      if (el.classList.contains("notion-numbered_list-block")) {
        value = el.innerText;
        type = "text";
      }
      if (el.classList.contains("notion-to_do-block")) {
        value = el.innerText;
        type = "text";
      }
      if (el.classList.contains("notion-bulleted_list-block")) {
        value = el.innerText;
        type = "text";
      }
      if (el.classList.contains("notion-page-block")) {
        const a = el.querySelector("a");
        type = "page";
        if (a) {
          value = `${a.href}`;
        }
      }
      if (el.classList.contains("notion-image-block")) {
        const img = el.querySelector("img");
        type = "img-src";

        if (img) {
          value = img.src;
        }
      }

      return {
        value,
        type,
      };
    },

    throttle: function (callback, delay) {
      let timeoutId;
      return function (...args) {
        // Use rest parameter to capture arguments
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          callback.apply(this, args); // Invoke the callback with captured arguments
        }, delay);
      };
    },
    setupEventListeners: function () {
      const throttledOnMouseMove = this.throttle(this.onMouseMove, 5);

      document.addEventListener("mousemove", throttledOnMouseMove);

      setTimeout(() => {
        const frameScroller = document.querySelector(".notion-frame > .notion-scroller");
        if (frameScroller) {
          frameScroller.addEventListener("scroll", this.onScroll);
        }
      }, 3000);
    },
    // scriptLoader: function () {
    //   let o = document.createElement("script");
    //   o.src = chrome.runtime.getURL("script.js");
    //   document.documentElement.appendChild(o);
    //   o.onload = function () {
    //     this.remove();
    //   };
    // },
  },

  async mounted() {
    this.setupEventListeners();
    //this.scriptLoader();
  },

  created: function () {},
};

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
</script>

<style lang="scss">
.relative {
  position: relative;
}

.swipekit-button {
  position: fixed;
  z-index: 10;
  --color-button-font: #fff;
  transition: all 30ms linear;

  button {
    position: relative;
    -webkit-appearance: none;
    display: inline-flex;
    justify-content: center;
    width: 100%;
    color: #b6b6b4;
    font-weight: 400;
    border: none;
    text-align: center;
    padding: 5.5px 16px;
    line-height: 1;
    border-radius: 6px;
    transition: all 80ms linear;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Fira Sans, Ubuntu,
      Oxygen, Oxygen Sans, Cantarell, Droid Sans, Apple Color Emoji, Segoe UI Emoji, Segoe UI Emoji, Segoe UI Symbol,
      Lucida Grande, Helvetica, Arial, sans-serif !important;
    background-color: transparent;

    &:hover,
    &:active {
      color: #878784;
    }

    &.active {
      color: var(--color-button-font);
      background-color: var(--color-button-primary) !important;
      cursor: not-allowed;
    }

    &.active:after {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      width: 16px;
      height: 16px;
      border: 2px solid #fff;
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }
  }

  &.hide {
    opacity: 0.25;
    pointer-events: none;
  }

  &.disabled {
    display: none;
  }

  &.processing {
    button {
      color: #5eb607;
    }
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
