<script setup lang="ts">
import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

let auth: any;
const isLoggedIn = ref(false);
const user = ref<User | null>();

onMounted(() => {
  auth = getAuth();

  onAuthStateChanged(auth, (_user) => {
    user.value = _user;

    if (_user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push('/login');
  });
};
</script>

<template>
  <div class="bg-white border border-gray-300 p-6 mt-8 rounded shadow-md max-w-md mx-auto">
    <div class="flex items-center space-x-4 mb-4">
      <img
        v-if="user?.photoURL"
        :src="user.photoURL"
        alt="User Avatar"
        class="w-16 h-16 rounded-full"
      />
      <div v-else class="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
        <span class="text-xl text-gray-500">{{ user?.email ? user.email.charAt(0).toUpperCase() : '?' }}</span>
      </div>
      <div>
        <h2 class="text-xl font-semibold text-gray-900">{{ user?.email || 'Unknown User' }}</h2>
        <p class="text-gray-500">{{ user?.phoneNumber || 'Phone number not provided' }}</p>
      </div>
    </div>

    <button
      type="button"
      @click="handleSignOut"
      class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 focus:outline-none"
    >
      Logout
    </button>
  </div>
</template>

