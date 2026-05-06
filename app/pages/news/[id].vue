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
            <p class="p-newsDetail__tag">{{ newsDetail?.category?.name }}</p>
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

.p-newsDetail__headerInfo {
  display: flex;
  gap: rem(8);
  justify-content: flex-start;
  align-items: center;
  margin-bottom: rem(8);

  @include breakpoint-up(md) {
    margin-bottom: rem(12);
  }

  .p-news__date {
    margin-left: 0;
  }
}

.p-newsDetail__date {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: center;
  z-index: 2;
  mix-blend-mode: difference;
  vertical-align: middle;
  color: clr.$color-gray-600;

  @include breakpoint-down(xsm) {
    grid-area: area3;
  }

  @include breakpoint-up(md) {
    flex-shrink: 0;
  }

  > time {
    display: inline-block;
    vertical-align: middle;
    font-size: rem(10);

    @include breakpoint-up(md) {
      font-size: rem(12);
    }
  }
}

.p-newsDetail__tag {
  display: inline-grid;
  place-items: center;
  position: relative;
  padding: rem(2) rem(8) rem(2.5) rem(9);
  border: $border-width solid clr.$color-black;
  border-radius: 9999px;
  background-color: clr.$color-white;
  font-size: rem(10);
  line-height: 1.1;
  @include trimHalfLeading(1.1);
  z-index: 2;

  @include breakpoint-down(xsm) {
    grid-area: area1;
    align-self: center;
  }

  @include breakpoint-up(md) {
    flex-shrink: 0;
    align-self: center;
    margin-right: rem(15);
    padding: rem(3.5) rem(11) rem(4);
    font-size: rem(13);
    vertical-align: middle;
  }
}

.p-newsDetail__ttl {
  padding-bottom: rem(20);
  border-bottom: 2px solid clr.$color-black;
  font-size: rem(30);
  @include breakpoint-up(md) {
    font-size: rem(36);
  }

  small {
    font-size: 0.5em;
    font-weight: 400;
  }

  &.--en {
    font-family: $base-font-family-en;
    font-weight: 800;
    line-height: 1.3;

    @include breakpoint-up(md) {
      font-size: rem(40);
    }
  }
}

.p-newsDetail__kv-imgList {
  width: 100%;
}

.p-newsDetail__kv-imgItem {
  overflow: hidden;
  width: 100%;
  aspect-ratio: 800 / 450;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.p-newsDetail__body {
  &:is(.p-newsDetail__kv + *) {
    padding-top: rem(35);

    @include breakpoint-up(md) {
      padding-top: rem(55);
    }
  }
}
</style>
