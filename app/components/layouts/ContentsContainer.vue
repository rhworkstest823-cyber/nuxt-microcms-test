<script setup lang="ts">
interface ContentsContainerProps {
  size?: 'small' | 'large';
  isPcOnly?: boolean;
};

const props = defineProps<ContentsContainerProps>();

const containerClass = computed(() => {
  switch (props.size) {
    case 'small':
      return '--mw800';
    case 'large':
      return '--mw1200';
    default:
      return '';
  }
});
</script>

<template>
  <div :class="['l-cont__inner', containerClass, { '--isPcOnly': props.isPcOnly }]">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.l-cont__inner {
  padding-inline: $content-padding-left-sm $content-padding-right-sm;
  width: 100%;
  margin-inline: auto;

  @include breakpoint-up(md) {
    padding-inline: $content-padding-md;
    max-width: calc($content-max-width + $content-padding-md * 2);
  }

  &.--mw800 {
    @include breakpoint-up(md) {
      max-width: calc($content-max-width-800 + $content-padding-md * 2);
    }
  }

  &.--mw1200 {
    @include breakpoint-up(md) {
      max-width: calc($content-max-width-1200 + $content-padding-md * 2);
    }
  }

  &.--isPcOnly {
    @include breakpoint-down(sm) {
      padding-inline: 0;
    }
  }
}
</style>
