<script setup lang="ts">

</script>

<template>
  <header class="l-header">
    <div class="l-header__inner">
      <a href="/" class="l-header__logo"></a>
      <nav class="l-header__nav" aria-label="グローバルナビゲーション">
        <ul class="l-header__navList">
          <li class="l-header__navItem">
            <NuxtLink to="/news" class="l-header__navLink">ニュース</NuxtLink>
          </li>
          <li class="l-header__navItem">
            <NuxtLink to="/business" class="l-header__navLink">事例紹介</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.l-header {
  --_header-height: #{rem(54)};
  overflow: hidden;

  position: fixed;
  z-index: zid.$stacking-fixed;
  top: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  padding: 0;
  width: 100%;
  pointer-events: none;
  transition: transform 0.3s ease.$easeOutQuad;

  @include breakpoint-up(md) {
    border-bottom: $border-width solid clr.$color-black;
    background-color: clr.$color-white;
    pointer-events: auto;
    --_header-height: #{rem(80)};
  }

  @include breakpoint-up(md) {
    padding: 0 20px;
    height: var(--_header-height);
  }

  // &.is-menuOpen {
  //   pointer-events: auto;
  // }

  // &.is-expand {
  //   @include breakpoint-down(xsm) {
  //     transform: translate3d(0, -41px, 0);
  //     transition: transform $duration-ul-on $easeOutQuart;
  //   }
  // }
}
</style>
