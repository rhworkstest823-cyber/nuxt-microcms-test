<script setup lang="ts">
import NewsListContainer from "~/components/containers/NewsListContainer.vue";
import ContentsContainer from "~/components/layouts/ContentsContainer.vue";
import MainContainer from "~/components/layouts/MainContainer.vue";
import PageCont from "~/components/layouts/PageCont.vue";
import PageKv from "~/components/parts/PageKv.vue";

definePageMeta({
  layout: "default",
});

usePageSeoMeta(
  "ニュースページ",
  "これはニュースページの説明文です。これはニュースページの説明文です。これはニュースページの説明文です。これはニュースページの説明文です。",
);
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
