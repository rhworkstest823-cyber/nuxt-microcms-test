<script setup lang="ts">
import MainContainer from '~/components/layouts/MainContainer.vue';
import ContentsContainer from '~/components/layouts/ContentsContainer.vue';
import ButtonDefault from '~/components/parts/ButtonDefault.vue';

definePageMeta({
  layout: 'default',
});

usePageSeoMeta('トップページ', 'これは事例ページの説明文です。これは事例ページの説明文です。これは事例ページの説明文です。これは事例ページの説明文です。');

const { data: businessCategoryList, error: businessCategoryError } = await useAsyncData(
  'business-category-list',
  () => {
    const { getBusinessCategoryList} = useMicrocms();
    return getBusinessCategoryList();
  },
  {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  }
);

const { data: businessList, error: businessListError } = await useAsyncData(
  'business-list',
  () => {
    const { getBusinessList } = useMicrocms();
    return getBusinessList({
      limit: 100,
      orders: '-publishedAt', // 新着順
      fields: ['id', 'category', 'title', 'outlineList'], // 通信量削減のため一覧ページは必要フィールドのみ
    });
  },
  {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  }
);

if (businessCategoryError.value || businessListError.value) {
   throw createError({ statusCode: 500, message: '事例が取得できませんでした。' })
}

const businessListRef = ref(structuredClone(businessList.value?.contents));
</script>

<template>
  <MainContainer>
    <ContentsContainer>
      <div class="p-businessCategory">
        <h2 class="p-businessCategory__ttl">事例一覧</h2>
        <ul class="p-businessCategory__list">
          <li v-for="business in businessListRef" :key="business.id" class="p-businessCategory__item">
            <p class="p-businessCategory__name">{{ business.title }}</p>
            <dl v-if="business.outlineList.length > 0" class="p-businessCategory__outlineList">
              <div v-for="outline in business.outlineList" :key="outline.outlineTitle" class="p-businessCategory__outlineItem">
                <dt>{{ outline.outlineTitle }}</dt>
                <dd>{{ outline.outlineDescription }}</dd>
              </div>
            </dl>
            <ButtonDefault :to="`/business/${business.id}`" element="nuxt-link" text="詳しく見る"></ButtonDefault>
          </li>
        </ul>
      </div>
    </ContentsContainer>
  </MainContainer>
</template>

<style lang="scss" scoped>

</style>
