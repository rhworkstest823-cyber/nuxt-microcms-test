<script setup lang="ts">
import { z } from "zod";

type HeadingProps = {
  level?: number;
  text: string;
  textEn?: string;
};
const { level = 2, ...props } = defineProps<HeadingProps>();

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
    <span class="c-heading-icon">
      <svg fill="none" height="20" viewBox="0 0 21 20" width="21" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#000" stroke-width="1"><path d="m10.5 0v20"/><path d="m.5 10h20"/></g>
      </svg>
    </span>
    <span class="c-heading-main">{{ props.textEn }}</span>
    <span class="c-heading-sub">{{ props.text }}</span>
  </component>
</template>

<style lang="scss" scoped>
.c-heading {
  display: inline-flex;
  flex-direction: column;
  position: relative;

  @include breakpoint-up(md) {
    margin-top: -0.35em;
    margin-left: -1 * $bg-border-width;
  }
}

.c-heading-icon {
  display: grid;
  place-items: center;
  position: absolute;
  top: rem(-45);
  transform: translate(calc(-50% + 1px), 0);
  width: rem(20);
  height: rem(20);

  > svg {
    display: grid;
    place-items: center;
    width: 100%;
  }
}

.c-heading-main {
  letter-spacing: ls(-2);
  font-family: $base-font-family-en;
  font-size: rem(35);
  font-weight: 800;
  line-height: 1.2;
  @include trimHalfLeading(1.2);
  text-transform: uppercase;

  @include breakpoint-up(md) {
    letter-spacing: ls(-7);
    font-size: rem(35);
  }

  &.--jp {
    font-family: $base-font-family;
    font-size: rem(26);
    font-weight: 900;
  }

  &.--jp-02 {
    font-family: $base-font-family;
    font-size: rem(32);
    font-weight: 700;

    @include breakpoint-up(md) {
      font-size: rem(35);
    }
  }
}

.c-heading-sub {
  font-size: rem(14);
  font-weight: 400;

  @include breakpoint-up(md) {
    margin-top: rem(2);
    font-size: rem(13);
  }
}
</style>
