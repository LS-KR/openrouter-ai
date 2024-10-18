<script lang="ts">
import { Icon } from '@iconify/vue'
import { Component, Vue } from 'vue-facing-decorator'

@Component({ components: { Icon } })
export default class GlobalButton extends Vue {
  top() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: Add smooth scrolling effect
    });
  }
}
</script>

<template>
  <div class="global-buttons">
    <div class="button clickable" v-on:click="top()">
      <Icon icon="mynaui:chevron-up" class="iconify"/>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/css/latte';

.global-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: auto;

  position: fixed;
  bottom: 20px;
  right: 20px;

  gap: 10px;

  .clickable {
    &:hover {
      cursor: pointer;
    }

    &:active {
      cursor: cell;
    }
  }

  .button {
    display: block;
    height: 36px;
    width: 36px;
    border-radius: 36px;
    background-color: $crust;
    border: 1px solid $blue;
    transition: all 0.5s ease-in-out;

    &:hover {
      transform: translateY(-5px);
      filter: drop-shadow(0px 5px 3px $blue);
    }

    .iconify {
      width: 36px;
      height: 36px;
      color: $teal;
    }
  }
}
</style>
