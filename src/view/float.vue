<template>
  <div class="c-float">
    <div v-for="float in floats" :key="float.id" :class="['c-float__item', float.klass]">Copied</div>
  </div>
</template>

<script>
import { customAlphabet } from "nanoid";
import anime from "animejs/lib/anime.es.js";

const nanoid = customAlphabet("1234567890abcdef", 10);

export default {
  data: function () {
    return {
      floats: [],
    };
  },

  methods: {
    addFloat: function () {
      const id = `float-${nanoid()}`;
      const klass = id;

      this.floats.push({
        id,
        klass,
        status: "inactive",
      });

      this.$nextTick(() => {
        anime({
          targets: `.${klass}`,
          keyframes: [
            {
              easing: "easeOutCubic",
              translateY: -6,
              opacity: [0, 1],
              duration: 600,
            },
            {
              easing: "linear",
              opacity: 0,
              duration: 300,
            },
          ],

          easing: "easeOutCubic",

          complete: (anim) => {
            this.floats = this.floats.filter((item) => {
              return item.id !== id;
            });
          },
        });
      });
    },
  },
};
</script>

<style lang="scss">
.c-float {
  position: absolute;
  top: -6px;
  left: 6px;

  &__item {
    position: absolute;
    top: 0;
    left: 0;
    color: #8f8f8f;
    font-size: 12px;
  }
}
</style>
