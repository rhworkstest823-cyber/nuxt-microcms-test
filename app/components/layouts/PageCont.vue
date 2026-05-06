<script setup lang="ts">
interface PageContProps {
  col?: 'default' | 'col-2';
  customClass?: string;
}

const { col, customClass = '' } = defineProps<PageContProps>();
const slots = useSlots();
</script>

<template>
  <div :class="['l-pageCont', col === 'col-2' ? '--col2' : '', customClass]">
    <slot v-if="slots.side" name="side" />
    <slot name="main" />
  </div>
</template>

<style lang="scss" scoped>
@use "sass:math";

.l-pageCont {
  @include breakpoint-up(md) {
    display: flex;
  }

  &.--col2 {
    @include breakpoint-up(md) {
      display: grid;
      grid-template-columns: $grid-width-md 1fr;
      gap: 0 math.div($bg-border-width, 2);
    }
  }
}
</style>
