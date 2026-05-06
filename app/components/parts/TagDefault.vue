<script setup lang="ts">
type TagProps = {
  text: string
}
const { text } = defineProps<TagProps>();
</script>

<template>
  <span class="c-tag">{{ text }}</span>
</template>

<style lang="scss" scoped>
.c-tag {
  display: inline-grid;
  place-items: center;
  position: relative;
  padding: rem(2) rem(8) rem(2.5) rem(9);
  border: $border-width solid clr.$color-black;
  border-radius: 9999px;
  min-width: rem(56);
  min-height: rem(24);
  background-color: clr.$color-white;
  font-size: rem(10);
  line-height: 1.1;
  text-box: trim-both text text;

  @include breakpoint-up(md) {
    padding: rem(3.5) rem(11) rem(4);
    font-size: rem(13);
  }
}
</style>
