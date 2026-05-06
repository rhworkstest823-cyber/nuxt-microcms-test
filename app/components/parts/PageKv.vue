<script setup lang="ts">
import { z } from "zod";

type PageKvProps = {
  title: string;
  titleEn: string;
};

const props = defineProps<PageKvProps>();

const PageKvPropsSchema = z.object({
  title: z.string(),
  titleEn: z.string().regex(/^[A-Za-z\s]+$/, "英字（全角半角）とスペースのみ"),
});
PageKvPropsSchema.parse(props); // propsのバリデーションを実行
</script>

<template>
  <div class="c-kv">
    <div class="c-kv__inner">
      <div class="c-kv__cont">
        <h2 class="c-kv__heading">
          <span class="c-kv__heading-main" aria-hidden="true">{{ props.titleEn }}</span>
          <span class="c-kv__heading-sub" aria-hidden="true">{{ props.title }}</span>
          <span class="u-visuallyhidden">{{ props.titleEn }} {{ props.title }}</span>
        </h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.c-kv {
  padding: rem(94) 0 0 $content-padding-left-sm;
  width: 100%;
  margin-inline: auto;

  @include breakpoint-up(md) {
    padding: rem(129) 0 0 $content-padding-md;
    max-width: calc(1200px + $content-padding-md);
  }
}

.c-kv__cont {
  padding-right: $content-padding-right-sm;

  @include breakpoint-up(md) {
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: -0.3em;
    padding-right: 0;
    width: min(vw(580, 1280), 580px);
  }
}

.c-kv__heading {
  display: inline-block;
  margin-bottom: 93px;

  @include breakpoint-up(md) {
    margin-bottom: 91px;
    margin-left: -1 * $bg-border-width;
  }
}

.c-kv__heading-main {
  display: block;
  // visibility: hidden;
  // opacity: 0;
  letter-spacing: ls(-2);
  font-family: $base-font-family-en;
  font-size: rem(41);
  font-weight: 800;
  line-height: 1.3;
  @include trimHalfLeading(1.3);
  text-transform: uppercase;

  @include breakpoint-up(md) {
    letter-spacing: ls(10);
    font-size: rem(57);
  }
}

.c-kv__heading-sub {
  display: block;
  // visibility: hidden;
  // opacity: 0;
  margin-top: rem(1);
  font-family: $base-font-family;
  font-size: rem(20);
  font-weight: 600;
  line-height: 1.4;
  @include trimHalfLeading(1.4);

  @include breakpoint-up(md) {
    font-size: rem(24);
  }
}
</style>
