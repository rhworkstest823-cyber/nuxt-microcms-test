<script setup lang="ts">
// microCMSからフロントページのWORKSデータを取得するためのコンテナ
import HomeWorksList from '../pages/home/HomeWorksList.vue';

const { data: frontPageDataWorks, error } = useAsyncData(
  'front-page-works-data',
  () => {
    const { getFrontPage } = useMicrocms();
    return getFrontPage({
      fields: ['business'], // 通信量削減のため必要フィールドのみ
    });
  },
  {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  }
);

if (error.value) {
   throw createError({ statusCode: 500, message: 'WORKSデータが取得できませんでした。' })
}
</script>

<template>
  <HomeWorksList v-bind="$attrs" v-if="frontPageDataWorks?.business" :response="frontPageDataWorks.business" />
</template>
