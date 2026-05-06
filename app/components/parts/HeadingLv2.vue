<script setup lang="ts">
import { z } from "zod";

type HeadingLv2Props = {
  level?: number;
  text: string;
};
const { level = 3, ...props } = defineProps<HeadingLv2Props>();

const HeadingPropsSchema = z.object({
  level: z.number().int().min(2).max(6),
  text: z.string(),
  textEn: z.string().regex(/^[A-Za-z\s]+$/, "英字（全角半角）とスペースのみ").optional(),
});
HeadingPropsSchema.parse({ level, ...props }); // propsのバリデーションを実行

const headingElement = computed(() => `h${level}`);
</script>

<template>
  <component :is="headingElement" class="c-heading">
    <span class="c-headingTxt">{{ props.text }}</span>
  </component>
</template>

<style lang="scss" scoped>
.c-heading {
  font-family: $base-font-family-en;
  font-size: rem(24);
  font-weight: 800;
  line-height: 1.4;
  @include trimHalfLeading(1.4);

  @include breakpoint-up(md) {
    font-size: rem(24);
  }
}
</style>
