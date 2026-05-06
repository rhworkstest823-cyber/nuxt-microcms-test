<script setup lang="ts">
interface SplideCarouselArrowsProps {
  customCarouselClass?: string;
}
const { customCarouselClass = '' } = defineProps<SplideCarouselArrowsProps>();
</script>

<template>
  <div :class="['splide__arrows splide__arrows--ltr c-pager__list', `${customCarouselClass}__arrows`]">
    <button type="button" :class="['c-pager c-pager--prev splide__arrow splide__arrow--prev', `${customCarouselClass}__arrow`, `${customCarouselClass}__arrow--prev`]">
      <span class="c-pager__arrow">
        <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 -1.74846e-07L5 15.4998M5 15.4998L9 11.0554M5 15.4998L1 11.0554" stroke="white"/>
        </svg>
      </span>
    </button>
    <button type="button" :class="['c-pager c-pager--next splide__arrow splide__arrow--next', `${customCarouselClass}__arrow`, `${customCarouselClass}__arrow--next`]">
      <span class="c-pager__arrow">
        <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 -1.74846e-07L5 15.4998M5 15.4998L9 11.0554M5 15.4998L1 11.0554" stroke="white"/>
        </svg>
      </span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.c-pager__list {
  display: flex;
  gap: 0 $bg-border-width;
}

.c-pager {
  display: grid;
  place-items: center;
  position: relative;
  z-index: zid.$stacking-base;
  width: 44px;
  height: 44px;
  background-color: clr.$color-black;

  &::before {
    content: "";
    position: absolute;
    z-index: 2;
    border: $border-width solid clr.$color-black;
    inset: 0;
    background-color: clr.$color-white;
  }

  // interaction
  &::before {
    opacity: 0;
    transition: opacity 0.3s ease.$easeOutQuart;
  }

  @include hover {
    &::before {
      opacity: 1;
      transform: translate3d(0, 0, 0);
      transition: opacity 0.5s ease.$easeOutQuart;
    }
  }

  &.--disabled {
    background-color: clr.$color-gray-600;
    pointer-events: none;
    user-select: none;

    .c-pager__arrow {
      mix-blend-mode: normal;
    }
  }
}

.c-pager__arrow {
  display: block;
  position: relative;
  z-index: 3;
  width: 8px;
  height: 15px;
  mix-blend-mode: difference;

  > svg {
    display: block;
    transform: rotate(-90deg);
    width: 100%;
  }

  .c-pager--prev & {
    > svg {
      transform: rotate(90deg);
    }
  }
}
</style>
