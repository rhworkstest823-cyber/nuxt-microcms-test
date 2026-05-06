<script setup lang="ts">
// microCMSからフロントページのKV画像データを取得するためのコンテナ
import HomeKeyVisual from '../pages/home/HomeKeyVisual.vue';

const { data: frontPageDataKv, error } = useAsyncData(
  'front-page-kv-data',
  () => {
    const { getFrontPage } = useMicrocms();
    return getFrontPage({
      fields: ['keyVisual'], // 通信量削減のため必要フィールドのみ
    });
  },
  {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  }
);

if (error.value) {
   throw createError({ statusCode: 500, message: 'KV画像データが取得できませんでした。' })
}
</script>

<template>
  <HomeKeyVisual v-bind="$attrs" v-if="frontPageDataKv?.keyVisual" :keyVisual="frontPageDataKv.keyVisual" />
</template>
