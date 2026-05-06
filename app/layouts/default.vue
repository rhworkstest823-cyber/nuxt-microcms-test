<script setup lang="ts">
import Header from '~/components/layouts/Header.vue';
import BgContainer from '~/components/layouts/BgContainer.vue';
</script>

<template>
  <Header />
  <slot />
  <BgContainer />
</template>
