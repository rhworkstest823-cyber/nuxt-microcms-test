<script setup lang="ts">
import type { News, NewsListResponse } from '#shared/types/microcms';

interface NewsListProps {
  response: NewsListResponse;
  limit?: number;
}

const { response, limit } = defineProps<NewsListProps>();

const maxCount = computed(() => {
  return limit || response.totalCount;
});
const displayedNews = computed(() => {
  return [...response.contents].slice(0, maxCount.value);
});

const formatedDate = computed(() => {
  return (datetime: string) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}.${month}.${day}`;
  };
});
</script>

<template>
  <ul class="c-news__list">
    <li v-for="news in displayedNews" :key="news.id" class="c-news__item">
      <NuxtLink :to="`/news/${news.id}`" class="c-news__inner">
        <span v-if="news.category" class="c-news__itemTag">{{ news.category?.name }}</span>
        <span class="c-news__itemText">{{ news.title }}</span>
        <span class="c-news__itemDate"><time :datetime="news.datetime">{{ formatedDate(news.datetime) }}</time></span>
      </NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.c-news__item {
  position: relative;
  border-top: $border-width solid clr.$color-black;

  &:last-of-type {
    border-top: $border-width solid clr.$color-black;
    border-bottom: $border-width solid clr.$color-black;
  }
}

.c-news__inner {
  display: inline-grid;
  padding: rem(18) rem(22) rem(18) rem(23);

  @include breakpoint-down(xsm) {
    grid-template-areas:
      "area1 area3"
      "area2 area2";
    grid-template-columns: max-content 1fr;
    gap: rem(10) rem(8);
  }

  @include breakpoint-up(md) {
    display: inline-flex;
    align-items: center;
    padding: rem(16) rem(20);
    width: 100%;
  }

  &.--disabled {
    pointer-events: none;

    .c-news__itemText {
      &::after {
        content: none;
      }
    }
  }
}

.c-news__itemTag {
  display: inline-grid;
  place-items: center;
  position: relative;
  padding: rem(2) rem(8) rem(2.5) rem(9);
  border: $border-width solid clr.$color-black;
  border-radius: 9999px;
  background-color: clr.$color-white;
  font-size: rem(10);
  line-height: 1.1;
  @include trimHalfLeading(1.1);
  z-index: 2;

  @include breakpoint-down(xsm) {
    grid-area: area1;
    align-self: center;
  }

  @include breakpoint-up(md) {
    flex-shrink: 0;
    align-self: center;
    margin-right: rem(15);
    padding: rem(3.5) rem(11) rem(4);
    font-size: rem(13);
    vertical-align: middle;
  }
}

.c-news__itemText {
  display: inline-block;
  position: relative;
  z-index: 2;
  vertical-align: middle;
  font-size: rem(14);

  @include breakpoint-down(xsm) {
    grid-area: area2;
  }

  @include breakpoint-up(md) {
    margin-right: rem(10);
  }

  &::after {
    content: "";
    display: inline-block;
    clip-path: polygon(0 0, 0% 100%, 100% 50%);
    position: relative;
    z-index: 2;
    margin-left: rem(8);
    width: rem(11);
    height: rem(6);
    background-color: clr.$color-black;
    margin-bottom: rem(2);
  }

  .c-news__inner[target="_blank"] & {
    &::after {
      content: "";
      display: inline-block;
      clip-path: none;
      flex-shrink: 0;
      position: relative;
      z-index: 2;
      width: rem(11);
      height: rem(9);
      background: url(#{$path-img-common}icon_blank.svg) no-repeat center / 100% auto;
      background-color: transparent;
      margin-bottom: 0;
    }
  }
}

.c-news__itemDate {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: center;
  z-index: 2;
  mix-blend-mode: difference;
  vertical-align: middle;
  color: clr.$color-gray-600;

  @include breakpoint-down(xsm) {
    grid-area: area3;
  }

  @include breakpoint-up(md) {
    flex-shrink: 0;
    margin-left: auto;
  }

  > time {
    display: inline-block;
    vertical-align: middle;
    font-size: rem(10);

    @include breakpoint-up(md) {
      font-size: rem(12);
    }
  }
}
</style>
