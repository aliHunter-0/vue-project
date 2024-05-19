<script setup lang="ts">
import { RouterView } from 'vue-router';
import SideBar from './components/SideBar.vue';
</script>

<template>
  <SideBar />
  <div class="container mx-auto px-32">
    <RouterView />
  </div>
</template>

<style scoped></style>
