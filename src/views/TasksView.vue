<script setup lang="ts">
import { addDoc, collection, getDocs, updateDoc, doc, getFirestore } from 'firebase/firestore';
import { onMounted, ref, computed } from 'vue';
import { getUser } from '../utils/localstorage';

// Initialize Firestore
const db = getFirestore();

// Fetch current user info
const user = getUser();
const userEmail = computed(() => user?.email);
const isRoot = computed(() => user?.isRoot);
const userPermissions = computed(() => user?.permissions || {});

// Local states
const jobTitle = ref('');
const jobDescription = ref('');
const selectedUser = ref('');
const users = ref<{ id: string; name: string; email: string; jobTitle?: string; jobDescription?: string }[]>([]);
const jobs = ref<{ userId: string; jobTitle: string; jobDescription: string }[]>([]);
const isModalOpen = ref(false);
const isUpdate = ref(false);

const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  users.value.length = 0;

  querySnapshot.forEach((doc) => {
    users.value.push({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email
    });
  });
};

const getJobs = async () => {
  const querySnapshot = await getDocs(collection(db, 'jobs'));
  jobs.value.length = 0;

  querySnapshot.forEach((doc) => {
    jobs.value.push({
      userId: doc.data().userId,
      jobTitle: doc.data().jobTitle,
      jobDescription: doc.data().jobDescription
    });
  });

  // Map jobs to users
  users.value.forEach(user => {
    const job = jobs.value.find(job => job.userId === user.id);
    user.jobTitle = job ? job.jobTitle : 'No job assigned';
    user.jobDescription = job ? job.jobDescription : 'No job description';
  });
};

const saveJob = async () => {
  if (isUpdate.value) {
    const job = jobs.value.find(job => job.userId === selectedUser.value);
    if (job) {
      await updateDoc(doc(db, 'jobs', job.userId), {
        jobTitle: jobTitle.value,
        jobDescription: jobDescription.value,
      });
    }
  } else {
    await addDoc(collection(db, 'jobs'), {
      jobTitle: jobTitle.value,
      jobDescription: jobDescription.value,
      userId: selectedUser.value
    });
  }
  isModalOpen.value = false;
  await getJobs(); // Refresh job data after adding/updating
};

const toggleModal = (userId: string) => {
  isModalOpen.value = !isModalOpen.value;
  selectedUser.value = userId;

  const job = jobs.value.find(job => job.userId === userId);
  if (job) {
    isUpdate.value = true;
    jobTitle.value = job.jobTitle;
    jobDescription.value = job.jobDescription;
  } else {
    isUpdate.value = false;
    jobTitle.value = '';
    jobDescription.value = '';
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

onMounted(async () => {
  await getUsers();
  await getJobs();
});
</script>

<template>
  <div class="p-4 border border-gray-300 mt-4 rounded bg-gray-50">
    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Job Title</th>
            <th scope="col" class="px-6 py-3">Job Description</th>
            <th scope="col" class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="px-6 py-4">{{ user.name }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">{{ user.jobTitle }}</td>
            <td class="px-6 py-4">{{ user.jobDescription }}</td>
            <td class="px-6 py-4">
              <button
                v-if="isRoot || userPermissions.addJobToUser || userPermissions.updateUserJob"
                @click="toggleModal(user.id)"
                class="block"
                :class="[
                  user.jobTitle !== 'No job assigned'
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-blue-700 hover:bg-blue-800',
                  'focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800 text-white'
                ]"
                type="button"
              >
                {{ user.jobTitle !== 'No job assigned' ? 'Update Job' : 'Assign Job' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg w-full z-50">
        <form @submit.prevent="saveJob">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ isUpdate ? 'Update Job' : 'Add Job' }}</h3>
          <div class="mb-4">
            <input
              v-model="jobTitle"
              placeholder="Job Title"
              class="input-field"
            />
          </div>
          <div class="mb-4">
            <textarea
              v-model="jobDescription"
              placeholder="Job Description"
              class="input-field"
            ></textarea>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="btn-primary">{{ isUpdate ? 'Update' : 'Add' }}</button>
            <button @click="closeModal" type="button" class="btn-secondary ml-4">Close</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-secondary {
  background-color: #ffffff;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  border: 1px solid #d1d5db;
}

.table th, .table td {
  padding: 12px;
  border: 1px solid #e5e7eb;
}

.table th {
  background-color: #f3f4f6;
}
</style>
