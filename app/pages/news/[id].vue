<script setup lang="ts">
import MainContainer from '~/components/layouts/MainContainer.vue';
import ContentsContainer from '~/components/layouts/ContentsContainer.vue';
import PageBottom from '~/components/layouts/PageBottom.vue';
import ButtonDefault from '~/components/parts/ButtonDefault.vue';

const route = useRoute();
const id = route.params.id as string;

const { data: newsDetail, error } = await useAsyncData(
  `news-detail-${id}`, // 必ず一意のキーを指定
  () => {
    const { getNewsDetail } = useMicrocms();
    return getNewsDetail(id);
  },
  {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  }
);

if (error.value) {
   throw createError({ statusCode: 404 })
}

usePageSeoMeta(
  newsDetail.value?.title || 'ニュース詳細',
  newsDetail.value?.content || 'ニュースの詳細ページです。',
);

const formattedDate = computed(() => {
  if (!newsDetail.value?.datetime) return '';
  const date = new Date(newsDetail.value.datetime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}.${month}.${day}`;
});
</script>

<template>
  <MainContainer>
    <article class="p-newsDetail">
      <div class="p-newsDetail__header">
        <ContentsContainer size="small">
          <div class="p-newsDetail__headerInfo">
            <time class="p-newsDetail__date" :datetime="newsDetail?.datetime">{{ formattedDate }}</time>
            <p class="p-newsDetail__tag"></p>
          </div>
          <h1 class="p-newsDetail__ttl">{{ newsDetail?.title }}</h1>
        </ContentsContainer>
      </div>
      <div class="p-newsDetail__kv">
        <ContentsContainer size="small" :isPcOnly="true">
          <ul class="p-newsDetail__kv-imgList">
            <li v-for="image in newsDetail?.keyVisual || []" :key="image.url" class="p-newsDetail__kv-imgItem">
              <img :src="image.url" :alt="image.alt || ''" :width="image.width || ''" :height="image.height || ''" class="p-newsDetail__kv-img" />
            </li>
          </ul>
        </ContentsContainer>
      </div>
      <div class="p-newsDetail__body">
        <ContentsContainer size="small">
          <div v-html="newsDetail?.content" class="p-newsDetail__content c-editorBlock"></div>
        </ContentsContainer>
      </div>
      <ContentsContainer size="small">
        <PageBottom>
          <ButtonDefault text="ニュース一覧に戻る" element="nuxt-link" to="/news" :back="true" />
        </PageBottom>
      </ContentsContainer>
    </article>
  </MainContainer>
</template>

<style lang="scss" scoped>
.p-newsDetail {
  padding-bottom: rem(80);
  @include breakpoint-up(md) {
    padding-bottom: rem(96);
  }
}

.p-newsDetail__header {
  padding: rem(40) 0;
  @include breakpoint-up(md) {
    padding: rem(52) 0 rem(60);
  }
}
</style>
