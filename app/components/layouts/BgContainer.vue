<script setup lang="ts"></script>

<template>
  <div class="l-bgLine">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.l-bgLine {
  display: block;
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  height: 100vh;
  background-image: linear-gradient(to right, clr.$color-white 25.06vw, clr.$color-gray-200 $bg-border-width);
  background-repeat: repeat;
  background-position: center left -1 * $bg-border-width;
  background-size: calc(25.06vw + $bg-border-width) auto;

  @include breakpoint-down(sm) {
    backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
  }

  @include breakpoint-up(md) {
    background-image: linear-gradient(to right, clr.$color-white $grid-width-md, clr.$color-gray-200 $bg-border-width);
    background-size: calc($grid-width-md + $bg-border-width) auto;
  }
}
</style>
