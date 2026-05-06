<script setup lang="ts">
import type { MicroCMSImage } from 'microcms-js-sdk';
import { Splide, SplideTrack, SplideSlide } from '@splidejs/vue-splide';
import type { PaginationData } from '@splidejs/splide';
import '@splidejs/vue-splide/css/core';
import { createWebGLTransition } from '~/utils/splide-webgl-transition';

type HomeKeyVisualProps = {
  keyVisual: MicroCMSImage[]; // KV画像は複数枚想定
};

const { keyVisual } = defineProps<HomeKeyVisualProps>();

const isMountSplide = computed(() => keyVisual.length > 1);

const kvSlideOptions = ref({
  type: 'fade',
  autoplay: true,
  autoWidth: true,
  rewind: true,
  speed: 0,
  interval: 5500,
  pagination: true,
  arrows: false,
  classes: {
    page: 'splide__pagination__page p-kvCarousel__pager',
  },
  drag: false,
  pauseOnHover: false,
  pauseOnFocus: false,
  breakpoints: {
    767: {},
  },
});

const kvExtensions = {
  webglTransition: createWebGLTransition({
    effect: 'glass',
    preset: 'Default',
    duration: 2.4,
  }),
};

const kvCarousel = ref(); // Splideインスタンスへの参照

const calcCircleOffset = (circle: SVGCircleElement) => {
  const radius = circle.getAttribute('r');
  return radius ? parseFloat(radius) * 2 * Math.PI : 0;
};

const onMountedPagination = (paginationData: PaginationData) => {
  const pagerElement = `
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="17" cy="17" r="16" stroke="#d9d9d9" stroke-width="1"/>
    <circle cx="17" cy="17" r="16" stroke="#000000" stroke-width="1" class="--progress"/>
    <text dx="17" dy="17" text-anchor="middle" dominant-baseline="central" fill="black" transform="rotate(90,17,17)" class="kvCarousel__slideNumber"></text>
  </svg>
  `;

  paginationData.items.forEach((item, index) => {
    const pager = item['button'];
    pager.insertAdjacentHTML('afterbegin', pagerElement);

    const pagerNumber = pager.querySelector('.kvCarousel__slideNumber') as HTMLElement;
    pagerNumber.innerHTML = `0${index + 1}`;

    const pagerCircleProgress = pager.querySelector('circle.--progress') as SVGCircleElement;
    const circleOffset = calcCircleOffset(pagerCircleProgress);
    pagerCircleProgress.setAttribute('stroke-dasharray', `${circleOffset}`);
    pagerCircleProgress.setAttribute('stroke-dashoffset', `${circleOffset}`);
  });
};

const animatePager = (rate: number) => {
  const root = kvCarousel.value?.splide?.root as HTMLElement;
  if (!root) return;

  const activePager = root.querySelector('.p-kvCarousel__pager.is-active') as HTMLElement;
  if (!activePager) return;

  const activePagerCircle = activePager.querySelector('circle.--progress') as SVGCircleElement;
  if (!activePagerCircle) return;

  const progress = rate * 100;
  const circleOffset = calcCircleOffset(activePagerCircle);
  const dashOffset = circleOffset * (1 - progress / 100);

  activePagerCircle.setAttribute('stroke-dasharray', `${circleOffset}`);
  activePagerCircle.setAttribute('stroke-dashoffset', `${dashOffset}`);
};
</script>

<template>
  <div class="p-kv">
    <div v-if="keyVisual.length > 0" class="p-kv__inner">
      <Splide
        v-if="isMountSplide"
        class="p-kvCarousel"
        :options="kvSlideOptions"
        :extensions="kvExtensions"
        :has-track="false"
        ref="kvCarousel"
        @splide:pagination:mounted="(_, data) => onMountedPagination(data)"
        @splide:autoplay:playing="(_, rate) => animatePager(rate)"
      >
        <SplideTrack class="p-kvCarousel__slide-track">
          <SplideSlide class="p-kvCarousel__slide" v-for="(image, index) in keyVisual" :key="index">
            <div class="p-kvCarousel__slide-img">
              <NuxtImg
                :src="image.url"
                alt=""
                :width="image.width || ''"
                :height="image.height || ''"
              />
            </div>
          </SplideSlide>
        </SplideTrack>

        <ul class="p-kvCarousel__pagination splide__pagination splide__pagination--ltr"></ul>
      </Splide>
      <div class="p-kvCarousel__slide" v-else>
        <div class="p-kvCarousel__slide-img">
          <NuxtImg
            :src="keyVisual?.at(0)?.url"
            alt=""
            :width="keyVisual?.at(0)?.width || ''"
            :height="keyVisual?.at(0)?.height || ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.p-kv__inner {
  width: 100%;
  margin-inline: auto;

  @include breakpoint-up(md) {
    padding-inline: $content-padding-md;
    max-width: calc(1920px + $content-padding-md * 2);
  }
}

.p-kvCarousel__slide {
  position: relative;
  width: 100%;
}

.p-kvCarousel__slide-img {
  overflow: hidden;
  aspect-ratio: 1120 / 600;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.p-kvCarousel__pagination {
  display: flex;
  gap: 0 14px;
  justify-content: center;
  margin-top: 26px;

  @include breakpoint-up(md) {
    gap: 0 18px;
    justify-content: flex-end;
    margin-top: 29px;
  }
}

.p-kvCarousel__pager {
  display: block;
  place-items: center;
  transform: rotate(-90deg);
  transform-origin: center center;
  padding: 0 !important;
  width: rem(32);
  height: rem(32);

  > svg {
    display: block;
    position: relative;
    width: rem(32);
    height: rem(32);

    circle {
      display: block;
    }
  }
}

.p-kvCarousel__slideNumber {
  display: inline-block;
  font-family: $base-font-family-en;
  font-size: rem(14);
  font-weight: 600;
}
</style>
