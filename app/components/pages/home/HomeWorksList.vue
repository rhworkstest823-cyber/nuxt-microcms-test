<script setup lang="ts">
import type { Business, BusinessListResponse } from '#shared/types/microcms';
import { Splide, SplideTrack, SplideSlide } from '@splidejs/vue-splide';
import SplideCarouselArrows from '~/components/parts/SplideCarouselArrows.vue';
import TagDefault from '~/components/parts/TagDefault.vue';

type HomeWorksListProps = {
  response: Business[]
}
const { response } = defineProps<HomeWorksListProps>();

const worksSlideOptions = ref({
  speed: 1200,
  autoWidth: true,
  gap: 1,
  focus: 0,
  omitEnd: true,
  ease: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  pagination: false,
  arrows: true,
});
</script>

<template>
  <Splide class="p-worksCarousel" :has-track="false" :options="worksSlideOptions" aria-label="">
    <div class="p-worksCarousel__track-wrapper">

      <SplideTrack class="p-worksCarousel__track">
        <SplideSlide class="p-worksCarousel__slide" v-for="item in response" :key="item.id">
          <NuxtLink :to="`/business/${item.id}`" class="p-worksCarousel__slide-inner">
            <div v-if="item.keyVisual && item.keyVisual.length > 0" class="p-worksCarousel__slide-img">
              <NuxtImg
                :src="item.keyVisual?.at(0)?.url"
                :alt="item.keyVisual?.at(0)?.alt || ''"
                :width="item.keyVisual?.at(0)?.width || ''"
                :height="item.keyVisual?.at(0)?.height || ''"
                class="p-worksCarousel__slide-imgItem"
              />
            </div>
            <div class="p-worksCarousel__slide-cont">
              <ul class="p-worksCarousel__slide-tagList">
                <li class="p-worksCarousel__slide-tagItem" v-for="tag in item.tag" :key="tag"><TagDefault :text="tag" /></li>
              </ul>
              <div class="p-worksCarousel__slide-bottom">
                <p class="p-worksCarousel__slide-name">{{ item.title }}</p>
              </div>
            </div>
          </NuxtLink>
        </SplideSlide>
      </SplideTrack>
    </div>

    <div class="p-worksCarousel__controller">
      <SplideCarouselArrows customCarouselClass="p-worksCarousel" />
    </div>
  </Splide>
</template>

<style lang="scss" scoped>
.p-worksCarousel {
  position: relative;
}

.p-worksCarousel__slide {
  width: vw(258);

  @include breakpoint-up(md) {
    width: rem(479);
  }

  > a {
    display: flex;
    flex-direction: column;
    gap: 16px 0;
    width: 100%;
    height: 100%;

    //interaction
    .p-worksCarousel__slide-img {
      overflow: hidden;

      img {
        backface-visibility: hidden;
        transform: translate3d(0, 0, 0);
        transition: transform 0.3s ease.$easeOutQuart;
      }
    }

    @include hover {
      .p-worksCarousel__slide-img {
        img {
          transform: scale(1.06) translate3d(0, 0, 0);
          transition: transform 0.5s ease.$easeOutQuart;
        }
      }

      .p-worksCarousel__slide-name {
        text-decoration: underline;
      }
    }
  }

  &.splide__slide--clone {
    visibility: hidden;
    opacity: 0;
  }
}

.p-worksCarousel__list {
  display: flex;
}

.p-worksCarousel__slide-img {
  aspect-ratio: 480 / 360;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.p-worksCarousel__slide-tagList {
  display: flex;
  flex-wrap: wrap;
  gap: rem(4) rem(3);

  @include breakpoint-up(md) {
    gap: rem(8) rem(8);
  }
}

.p-worksCarousel__slide-name {
  display: inline-block;
  margin-top: rem(3);
  vertical-align: middle;
  text-decoration: none;
  font-size: rem(18);
  font-weight: 400;
  line-height: 1.4;

  @include breakpoint-up(md) {
    margin-top: rem(8);
    font-size: rem(22);
  }

  .p-worksCarousel__slide > a[target="_blank"] & {
    &::after {
      content: "";
      display: inline-block;
      position: relative;
      z-index: 3;
      margin-left: rem(10);
      width: rem(16);
      height: rem(16);
      mask: url(#{$path-img-common}icon_blank.svg) no-repeat center / 100% auto;
      background-color: currentColor;
    }
  }
}

.p-worksCarousel__controller {
  display: inline-flex;
  position: absolute;
  top: -25px;
  right: 0;
  transform: translate(0, -100%);

  @include breakpoint-up(md) {
    top: 186px;
    right: auto;
    left: -71px;
    transform: translate(-100%, 0);
  }
}
</style>
