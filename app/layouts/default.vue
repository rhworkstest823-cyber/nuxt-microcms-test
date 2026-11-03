<script setup lang="ts">
import BgContainer from "~/components/layouts/BgContainer.vue";
import Header from "~/components/layouts/Header.vue";
</script>

<template>
  <Header />
  <slot />
  <BgContainer />
</template>
