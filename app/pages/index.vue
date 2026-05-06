<script setup lang="ts">
import HomeKeyVisualContainer from '~/components/containers/HomeKeyVisualContainer.vue';
import MainContainer from '~/components/layouts/MainContainer.vue';
import HomeNews from '~/components/pages/home/HomeNews.vue';
import HomeWorks from '~/components/pages/home/HomeWorks.vue';

definePageMeta({
  layout: 'default',
});

usePageSeoMeta('トップページ', 'これはトップページの説明文です。これはトップページの説明文です。これはトップページの説明文です。これはトップページの説明文です。');
</script>

<template>
  <MainContainer>
    <div class="p-top">
      <HomeKeyVisualContainer />
      <HomeNews />
      <HomeWorks />
    </div>
  </MainContainer>
</template>

<style lang="scss" scoped>
.p-top {
  padding-bottom: 100px;
  @include breakpoint-up(md) {
    padding-bottom: 140px;
  }
}
</style>
