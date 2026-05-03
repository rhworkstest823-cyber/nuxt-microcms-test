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
</script>

<template>
  <ul class="c-news__list">
    <li v-for="news in displayedNews" :key="news.id" class="c-news__item">
      <NuxtLink :to="`/news/${news.id}`" class="c-news__inner">
        {{ news.title }}
      </NuxtLink>
    </li>
  </ul>
</template>
