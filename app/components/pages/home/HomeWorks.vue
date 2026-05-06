<script setup lang="ts">
import ContentsContainer from '~/components/layouts/ContentsContainer.vue';
import PageCont from '~/components/layouts/PageCont.vue';
import HeadingLv2 from '~/components/parts/HeadingLv2.vue';
import WorksListContainer from '~/components/containers/WorksListContainer.vue';

</script>

<template>
  <div class="p-works">
    <ContentsContainer>
      <PageCont col="col-2">
        <template #side>
          <div>
            <HeadingLv2 :level="3" text="WORKS" />
          </div>
        </template>
        <template #main>
          <WorksListContainer />
        </template>
      </PageCont>
    </ContentsContainer>
  </div>
</template>

<style lang="scss" scoped>
.p-works {
  padding-top: 91px;
  width: 100%;

  @include breakpoint-up(md) {
    padding-top: 109px;
  }
}
</style>
