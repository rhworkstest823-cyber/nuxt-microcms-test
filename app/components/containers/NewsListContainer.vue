<script setup lang="ts">
// microCMSからお知らせ一覧を取得するコンテナ

import NewsList from '../ui/NewsList.vue';

const { data: newsList, error } = await useAsyncData(
  'news-list',
  () => {
    const { getNewsList } = useMicrocms();
    return getNewsList({
      limit: 100,
      orders: '-publishedAt', // 新着順
      fields: ['id', 'title', 'category', 'datetime'], // 通信量削減のため一覧ページは必要フィールドのみ
    });
  },
  {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  }
);

if (error.value) {
   throw createError({ statusCode: 500, message: 'お知らせが取得できませんでした。' })
}
</script>

<template>
  <NewsList v-bind="$attrs" v-if="newsList" :response="newsList" />
</template>
