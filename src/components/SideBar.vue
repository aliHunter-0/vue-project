<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { IconHome, IconLogin, IconUser, IconUsers, IconListCheck, IconShieldLock } from '@tabler/icons-vue';
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();
const isLoggedIn = ref(false);
const route = useRoute();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});
</script>

<template>
  <div class="flex">
    <nav v-if="isLoggedIn" class="flex flex-col gap-4 bg-gray-100 rounded p-4 w-64 h-screen border border-gray-300">
      <RouterLink
        to="/"
        class="flex items-center p-2 rounded transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': route.path === '/', 'hover:bg-gray-200': route.path !== '/' }"
      >
        <IconHome :size="36" :stroke-width="1.5" class="text-gray-700" />
        <span class="ml-2">Home</span>
      </RouterLink>

      <RouterLink
        to="/users"
        class="flex items-center p-2 rounded transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': route.path === '/users', 'hover:bg-gray-200': route.path !== '/users' }"
      >
        <IconUsers :size="36" :stroke-width="1.5" class="text-gray-700" />
        <span class="ml-2">Users</span>
      </RouterLink>

      <RouterLink
        to="/tasks"
        class="flex items-center p-2 rounded transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': route.path === '/tasks', 'hover:bg-gray-200': route.path !== '/tasks' }"
      >
        <IconListCheck :size="36" :stroke-width="1.5" class="text-gray-700" />
        <span class="ml-2">Jobs</span>
      </RouterLink>

     

      <RouterLink
        to="/profile"
        class="flex items-center p-2 mt-auto rounded transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': route.path === '/profile', 'hover:bg-gray-200': route.path !== '/profile' }"
      >
        <IconUser :size="36" :stroke-width="1.5" class="text-gray-700" />
        <span class="ml-2">Profile</span>
      </RouterLink>
    </nav>

    <nav v-else class="flex flex-col gap-4 bg-gray-100 rounded p-4 w-64 h-screen border border-gray-300">
      <RouterLink
        to="/login"
        class="flex items-center p-2 rounded transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': route.path === '/login', 'hover:bg-gray-200': route.path !== '/login' }"
      >
        <IconLogin :size="36" :stroke-width="1.5" class="text-gray-700" />
        <span class="ml-2">Login</span>
      </RouterLink>
    </nav>

   
    <div class="flex-1 p-4">
      <router-view />
    </div>
  </div>
</template>


