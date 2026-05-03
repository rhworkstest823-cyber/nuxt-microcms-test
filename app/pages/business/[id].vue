<script setup lang="ts">
import MainContainer from '~/components/layouts/MainContainer.vue';
import ContentsContainer from '~/components/layouts/ContentsContainer.vue';
import PageBottom from '~/components/layouts/PageBottom.vue';
import ButtonDefault from '~/components/parts/ButtonDefault.vue';

const route = useRoute();
const id = route.params.id as string;

const { data: businessDetail, error } = await useAsyncData(
  `business-detail-${id}`, // 必ず一意のキーを指定
  () => {
    const { getBusinessDetail } = useMicrocms();
    return getBusinessDetail(id);
  },
  {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  },
);

if (error.value) {
   throw createError({ statusCode: 404 })
}

usePageSeoMeta(
  businessDetail.value?.title || '事例詳細',
  businessDetail.value?.copyText || '事例の詳細ページです。',
);

const businessDetailRef = ref(structuredClone(businessDetail.value));
</script>

<template>
  <MainContainer>
    <article class="p-businessDetail">
      <div class="p-businessDetail__header">
        <ContentsContainer>
          <h1 class="p-businessDetail__ttl">{{ businessDetailRef?.title }}</h1>
        </ContentsContainer>
      </div>
      <div class="p-businessDetail__kv">
        <ContentsContainer :isPcOnly="true">
          <ul class="p-businessDetail__kv-imgList"></ul>
          <div class="p-businessDetail__kvCont">
            <p class="p-businessDetail__kvCopy">{{ businessDetailRef?.copyText }}</p>
            <p class="p-businessDetail__kvDescription">{{ businessDetailRef?.description }}</p>
            <ul class="p-businessDetail__linkList">
              <li v-for="link in businessDetailRef?.linkList || []" :key="link.url" class="p-businessDetail__linkItem">
                <a :href="link.url" class="p-businessDetail__link" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
              </li>
            </ul>
          </div>
        </ContentsContainer>
      </div>
      <div class="p-businessDetail__body">
        <ContentsContainer>
          <dl class="p-businessDetail__outlineList">
            <div v-for="outline in businessDetailRef?.outlineList || []" :key="outline.outlineTitle" class="p-businessDetail__outlineItem">
              <dt class="p-businessDetail__outlineTtl">{{ outline.outlineTitle }}</dt>
              <dd class="p-businessDetail__outlineDesc">{{ outline.outlineDescription }}</dd>
            </div>
          </dl>
          <div class="p-businessDetail__pointList">
            <ul class="p-businessDetail__pointItems">
              <li v-for="point in businessDetailRef?.pointList || []" :key="point.text" class="p-businessDetail__pointItem">{{ point.text }}</li>
            </ul>
          </div>
          <div class="p-businessDetail__googleMap">
            <iframe
              v-if="businessDetailRef?.googleMap?.mapEmbedUrl"
              :src="businessDetailRef.googleMap.mapEmbedUrl"
              width="600"
              height="450"
              style="border:0;"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            <ButtonDefault v-if="businessDetailRef?.googleMap?.mapLink" text="Google Map" element="nuxt-link" :to="businessDetailRef?.googleMap?.mapLink" :back="true" />
          </div>
        </ContentsContainer>
      </div>
      <ContentsContainer size="small">
        <PageBottom>
          <ButtonDefault text="事例一覧に戻る" element="nuxt-link" to="/business" :back="true" />
        </PageBottom>
      </ContentsContainer>
    </article>
  </MainContainer>
</template>

<style lang="scss" scoped>
.p-businessDetail {
  padding-bottom: rem(80);
  @include breakpoint-up(md) {
    padding-bottom: rem(96);
  }
}

.p-businessDetail__header {
  padding: rem(40) 0;
  @include breakpoint-up(md) {
    padding: rem(52) 0 rem(60);
  }
}
</style>
