<script setup lang="ts">
import MainContainer from '~/components/layouts/MainContainer.vue';
import ContentsContainer from '~/components/layouts/ContentsContainer.vue';
import PageKv from '~/components/parts/PageKv.vue';
import PageCont from '~/components/layouts/PageCont.vue';
import NewsListContainer from '~/components/containers/NewsListContainer.vue';

definePageMeta({
  layout: 'default',
});

usePageSeoMeta('ニュースページ', 'これはニュースページの説明文です。これはニュースページの説明文です。これはニュースページの説明文です。これはニュースページの説明文です。');
</script>

<template>
  <MainContainer>
    <PageKv title="お知らせ" titleEn="news" />
    <ContentsContainer>
      <PageCont col="col-2">
        <template #side>
          <div></div>
        </template>
        <template #main>
          <NewsListContainer />
        </template>
      </PageCont>
    </ContentsContainer>
  </MainContainer>
</template>
