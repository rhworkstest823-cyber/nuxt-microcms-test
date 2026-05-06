<script setup lang="ts">

</script>

<template>
  <header class="l-header">
    <div class="l-header__inner">
      <NuxtLink to="/" class="l-header__logo"><NuxtImg src="/assets/images/common/logo.svg" alt="Company Logo" /></NuxtLink>
      <nav class="l-header__nav" aria-label="グローバルナビゲーション">
        <ul class="l-header__navList">
          <li class="l-header__navItem">
            <NuxtLink to="/news" class="l-header__navLink">
              <span class="l-header__navLink-txtEn">News</span>
              <span class="l-header__navLink-txt">ニュース</span>
            </NuxtLink>
          </li>
          <li class="l-header__navItem">
            <NuxtLink to="/business" class="l-header__navLink">
              <span class="l-header__navLink-txtEn">Business</span>
              <span class="l-header__navLink-txt">事例</span>
            </NuxtLink>
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
    --_header-height: #{rem(72)};
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

.l-header__inner {
  height: 100%;

  @include breakpoint-up(md) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.l-header__logo {
  flex-shrink: 0;
  width: rem(60);
  font-family: $base-font-family-en;
  font-weight: 800;

  img {
    width: 100%;
    height: auto;
  }
}

.l-header__nav {
  @include breakpoint-up(md) {
    padding-inline: rem(16);
  }
}

.l-header__navList {
  display: flex;

  @include breakpoint-up(md) {
    column-gap: rem(32);
  }
}

.l-header__navLink {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.l-header__navLink-txtEn {
  text-transform: uppercase;
  @include breakpoint-up(md) {
    font-family: $base-font-family-en;
    font-size: rem(18);
    font-weight: 800;
    line-height: 1.4;
  }
}

.l-header__navLink-txt {
  @include breakpoint-up(md) {
    font-size: rem(12);
    font-weight: 400;
    line-height: 1;
  }
}
</style>
