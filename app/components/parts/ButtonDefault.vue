<script setup lang="ts">
type ButtonDefaultProps = {
  element?: 'button' | 'anchor-link' | 'nuxt-link';
  text?: string;
  type?: string;
  href?: string;
  target?: string;
  to?: string;
  disabled?: boolean;
  ariaLabel?: string;
  back?: boolean;
};

const { element = 'button', text = '', type = 'button', href = '', target = '', to = '', disabled = false, ariaLabel = '', back = false } = defineProps<ButtonDefaultProps>();

const emit = defineEmits<{
  (e: "onClick"): void;
}>();

const onClick = () => {
  emit("onClick");
};

// ボタンの場合
const buttonProps = {
  type,
  onClick,
  disabled,
  'aria-label': ariaLabel,
};

// アンカーリンクの場合
const anchorProps = {
  href,
  target,
  'aria-label': ariaLabel,
};

// NuxtLinkの場合
const nuxtLinkProps = {
  to,
  'aria-label': ariaLabel,
};

const NuxtLink = resolveComponent('NuxtLink');

const component = computed(() => {
  switch (element) {
    case "button":
      return {
        tag: 'button',
        props: buttonProps,
      };
    case "anchor-link":
      return {
        tag: 'a',
        props: anchorProps,
      };
    case "nuxt-link":
      return {
        tag: NuxtLink,
        props: nuxtLinkProps,
      };
    default:
      return {
        tag: 'button',
        props: buttonProps,
      };
  }
});
</script>

<template>
  <component :is="component.tag" v-bind="{ ...component.props }" :class="['c-btn', { 'c-btn__back': back }]">
    <span class="c-btnTxt">{{ text }}</span>
    <span class="c-btnIcon"></span>
  </component>
</template>

<style lang="scss" scoped>
.c-btn {
  display: inline-flex;
  column-gap: rem(8);
  justify-content: center;
  align-items: center;
  position: relative;
  border: $border-width solid clr.$color-black;
  padding: rem(6) rem(12);
  min-width: 165px;
  min-height: 44px;
  background-color: clr.$color-white;
  color: clr.$color-black;
  font-size: rem(13);
  cursor: pointer;
  z-index: zid.$stacking-base;

  @include breakpoint-up(md) {
    column-gap: rem(12);
    min-width: $grid-width-md;
    font-size: rem(15);
  }

  &::before {
    content: "";
    position: absolute;
    inset: $border-width;
    background-color: clr.$color-black;
    opacity: 0;
    z-index: 1;
  }

  &.c-btn__back {
    flex-direction: row-reverse;
    min-width: 314px;
  }

  &:hover {
    &::before {
      opacity: 1;
      transition: opacity 0.3s ease.$easeOutQuad;
    }
  }
}

.c-btnTxt {
  position: relative;
  color: clr.$color-white;
  z-index: 2;
  mix-blend-mode: difference;
}

.c-btnIcon {
  clip-path: polygon(0 0, 0% 100%, 100% 50%);
  position: relative;
  z-index: 2;
  width: rem(11);
  height: rem(6);
  background-color: clr.$color-white;
  mix-blend-mode: difference;

  .c-btn__back & {
    transform: scale(-1, 1);
  }
}
</style>
