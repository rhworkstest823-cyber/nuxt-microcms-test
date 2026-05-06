<script setup lang="ts">
import MainContainer from '~/components/layouts/MainContainer.vue';
import ContentsContainer from '~/components/layouts/ContentsContainer.vue';
import PageCont from '~/components/layouts/PageCont.vue';
import PageBottom from '~/components/layouts/PageBottom.vue';
import HeadingLv2 from '~/components/parts/HeadingLv2.vue';
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
          <div class="p-businessDetail__kvInner">
            <ul class="p-businessDetail__kv-imgList">
              <li v-for="(image, index) in businessDetailRef?.keyVisual || []" :key="index" class="p-businessDetail__kv-imgItem">
                <img :src="image.url" :alt="image.alt || `KV画像${index + 1}`" class="p-businessDetail__kv-img" />
              </li>
            </ul>
            <div class="p-businessDetail__kvCont">
              <p class="p-businessDetail__kvCopy">{{ businessDetailRef?.copyText }}</p>
              <p class="p-businessDetail__kvDescription">{{ businessDetailRef?.description }}</p>
              <ul class="p-businessDetail__linkList">
                <li v-for="link in businessDetailRef?.linkList || []" :key="link.url" class="p-businessDetail__linkItem">
                  <ButtonDefault :text="link.label" element="nuxt-link" :to="link.url" class="p-businessDetail__link" target="_blank" rel="noopener noreferrer"></ButtonDefault>
                </li>
              </ul>
            </div>
          </div>
        </ContentsContainer>
      </div>
      <div class="p-businessDetail__body">
        <ContentsContainer>
          <PageCont col="col-2" customClass="p-businessDetail__section">
            <template #side>
              <div>
                <HeadingLv2 :level="2" text="POINT" />
              </div>
            </template>
            <template #main>
              <ul class="p-businessDetail__pointList">
                <li v-for="point in businessDetailRef?.pointList || []" :key="point.text" class="p-businessDetail__pointItem">{{ point.text }}</li>
              </ul>
            </template>
          </PageCont>
          <PageCont col="col-2" customClass="p-businessDetail__section">
            <template #side>
              <div>
                <HeadingLv2 :level="2" text="OUTLINE" />
              </div>
            </template>
            <template #main>
              <dl class="p-businessDetail__outlineList">
                <div v-for="outline in businessDetailRef?.outlineList || []" :key="outline.outlineTitle" class="p-businessDetail__outlineItem">
                  <dt class="p-businessDetail__outlineTtl">{{ outline.outlineTitle }}</dt>
                  <dd class="p-businessDetail__outlineDesc">{{ outline.outlineDescription }}</dd>
                </div>
              </dl>
            </template>
          </PageCont>
          <PageCont col="col-2" customClass="p-businessDetail__section">
            <template #side>
              <div>
                <HeadingLv2 :level="2" text="MAP" />
              </div>
            </template>
            <template #main>
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
            </template>
          </PageCont>
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

.p-businessDetail__kv {
  margin-bottom: rem(60);
  @include breakpoint-up(md) {
    margin-bottom: rem(72);
  }
}

.p-businessDetail__kvInner {
  @include breakpoint-up(md) {
    display: flex;
    column-gap: min(calc(60 / 1120 * 100%), 60px);
  }
}

.p-businessDetail__kv-imgList {
  @include breakpoint-up(md) {
    flex-shrink: 0;
    width: min(calc(560 / 1120 * 100%), 560px);
  }
}

.p-businessDetail__kvCopy {
  margin-bottom: rem(15);
  font-size: rem(25);
  line-height: 1.45;
  @include breakpoint-up(xmd) {
    margin-bottom: rem(10);
    font-size: rem(28);
    line-height: 1.6;
  }
}

.p-businessDetail__kvDescription {
  margin-bottom: rem(32);
  line-height: 1.8;
  @include breakpoint-up(xmd) {
    margin-bottom: rem(25);
    line-height: 2;
  }
}

.p-businessDetail__linkList {
  display: flex;
  gap: 0 rem(5);

  @include breakpoint-up(md) {
    margin-top: auto;
  }

  &.--grid-col3-md {
    @include breakpoint-down(md) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: rem(8) rem(5);
      margin-top: rem(34);
    }

    .kv__btn-wrap {
      @include breakpoint-up(md) {
        min-width: calc((100% - 0.3125rem * 2) / 3);
      }
    }

    .kv__btn-wrap {
      &:nth-of-type(2) {
        grid-area: 2 / 1 / 2 / 1;
      }

      &:nth-of-type(3) {
        grid-area: 2 / 2 / 2 / 2;
      }

      @include breakpoint-down(md) {
        margin-top: 0;
      }
    }
  }
}

.p-businessDetail__section {
  & + & {
    margin-top: rem(32);
    @include breakpoint-up(md) {
      margin-top: rem(50);
    }
  }
}

.p-businessDetail__pointList {
  font-size: rem(19);
  @include breakpoint-up(md) {
    font-size: rem(22);
  }

  > li {
    padding-left: 1em;
    text-indent: -1em;

    @include breakpoint-down(xsm) {
      line-height: 1.4;
    }

    &::before {
      content: "・";
    }

    + .c-textBullet {
      margin-top: 0.5em;
    }
  }
}

.p-businessDetail__outlineList {
  border-top: 3px solid clr.$color-black;
  border-bottom: 3px solid clr.$color-black;
  @include breakpoint-down(xsm) {
    font-size: rem(14);
    line-height: 1.4;
  }
}

.p-businessDetail__outlineItem {
  display: flex;

  & + & {
    border-top: 1px solid clr.$color-black;
  }
}

.p-businessDetail__outlineTtl {
  padding: rem(10);
  width: calc(90 / 329 * 100%);
  min-width: rem(85);
  line-height: 1.3;
  @include breakpoint-down(xsm) {
    max-width: rem(101);
  }
  @include breakpoint-up(md) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: rem(16) calc(20 / 959 * 100%);
    width: calc(159 / 959 * 100%);
    min-width: rem(100);
  }

  &.--en {
    font-family: $base-font-family-en;
    font-size: 1.1em;
    font-weight: 600;

    &.--num {
      letter-spacing: 0.1em;
      @include breakpoint-up(md) {
        letter-spacing: 0.2em;
      }
    }
  }
}

.p-businessDetail__outlineDesc {
  flex: 1;
  padding: rem(10);
  @include breakpoint-up(md) {
    padding: rem(16) calc(20 / 959 * 100%);
  }
}

.p-businessDetail__googleMap {
  aspect-ratio: 16 / 9;
  width: 100%;
  iframe {
    width: 100%;
  }
}
</style>
