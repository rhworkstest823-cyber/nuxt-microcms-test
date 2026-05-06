<script setup lang="ts">
import ContentsContainer from '~/components/layouts/ContentsContainer.vue';
import PageCont from '~/components/layouts/PageCont.vue';
import Heading from '~/components/parts/Heading.vue';
import NewsListContainer from '~/components/containers/NewsListContainer.vue';

</script>

<template>
  <div class="p-news">
    <ContentsContainer>
      <PageCont col="col-2">
        <template #side>
          <div>
            <Heading :level="2" text="ニュース" textEn="news"/>
          </div>
        </template>
        <template #main>
          <NewsListContainer :limit="5" />
        </template>
      </PageCont>
    </ContentsContainer>
  </div>
</template>

<style lang="scss" scoped>
.p-news {
  position: relative;
  margin-top: 62px;
  padding-top: 80px;

  @include breakpoint-up(md) {
    padding-top: 70px;
  }
}
</style>
