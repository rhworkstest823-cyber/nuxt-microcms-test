<script setup lang="ts"></script>

<template>
  <div class="l-main">
    <div class="l-container">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.l-main {
  position: relative;
  overflow: clip;
  padding-top: rem(60);
  @include breakpoint-up(md) {
    padding-top: rem(72);
  }
}

.l-container {
  position: relative;
}
</style>
