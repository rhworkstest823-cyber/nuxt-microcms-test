<script setup lang="ts">
interface PageBottomProps {
  align?: 'left' | 'center' | 'right';
};

const { align = 'center' } = defineProps<PageBottomProps>();
</script>

<template>
  <div class="l-pageBottom" :class="`l-pageBottom__${align}`">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.l-pageBottom {
  display: flex;
  flex-direction: column;
  margin-block: rem(60) 0;
  @include breakpoint-up(md) {
    margin-block: rem(80) 0;
  }

  &__center {
    align-items: center;
  }

  &__right {
    align-items: flex-end;
  }
}
</style>
