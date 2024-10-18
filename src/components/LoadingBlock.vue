<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'

@Component({})
export default class LoadingBlock extends Vue {}
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect
      fill="#FAA0B9"
      stroke="#FAA0B9"
      stroke-width="13"
      width="30"
      height="30"
      x="25"
      y="50"
    >
      <animate
        attributeName="y"
        calcMode="spline"
        dur="2"
        values="50;120;50;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="-.4"
      ></animate>
    </rect>
    <rect
      fill="#DDD"
      stroke="#DDD"
      stroke-width="13"
      width="30"
      height="30"
      x="85"
      y="50"
    >
      <animate
        attributeName="y"
        calcMode="spline"
        dur="2"
        values="50;120;50;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="-.2"
      ></animate>
    </rect>
    <rect
      fill="#BFEBFD"
      stroke="#BFEBFD"
      stroke-width="13"
      width="30"
      height="30"
      x="145"
      y="50"
    >
      <animate
        attributeName="y"
        calcMode="spline"
        dur="2"
        values="50;120;50;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="0"
      ></animate>
    </rect>
  </svg>
</template>

<style scoped lang="scss"></style>
