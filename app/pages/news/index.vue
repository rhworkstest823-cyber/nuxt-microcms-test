<script setup lang="ts">
import MainContainer from '~/components/layouts/MainContainer.vue';
import ContentsContainer from '~/components/layouts/ContentsContainer.vue';
import NewsList from '~/components/ui/NewsList.vue';

definePageMeta({
  layout: 'default',
});

usePageSeoMeta('ニュースページ', 'これはニュースページの説明文です。これはニュースページの説明文です。これはニュースページの説明文です。これはニュースページの説明文です。');

const { data: newsList, error } = await useAsyncData(
  'news-list',
  () => {
    const { getNewsList } = useMicrocms();
    return getNewsList({
      limit: 100,
      orders: '-publishedAt', // 新着順
      fields: ['id', 'title', 'datetime'], // 通信量削減のため一覧ページは必要フィールドのみ
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
  <MainContainer>
    <ContentsContainer>
      <NewsList v-if="newsList" :response="newsList" />
    </ContentsContainer>
  </MainContainer>
</template>
