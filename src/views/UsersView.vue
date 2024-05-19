<script setup lang="ts">
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  getFirestore
} from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { computed } from 'vue';
import { getUser } from '../utils/localstorage';

// Initialize Firestore
const db = getFirestore();

const user = getUser();

const userEmail = computed(() => user?.email);
const isRoot = computed(() => user?.isRoot);

// Local states
const name = ref('');
const email = ref('');
const phoneNumber = ref('');
const address = ref('');
const users = ref<
  {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    permissions: { [key: string]: boolean };
  }[]
>([]);
const isUpdateModalOpen = ref(false);
const selectedUserId = ref('');
const isAdding = ref(true);

// Permissions state
const permissions = ref({
  addUser: false,
  readUserList: false,
  updateUser: false,
  deleteUser: false,
  addJobToUser: false,
  updateUserJob: false
});

// Fetch users from Firestore
const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  users.value.length = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    users.value.push({
      id: doc.id,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber || '',
      address: data.address || '',
      permissions: data.permissions || {}
    });
  });
};

// Add or update user in Firestore
const addUser = async () => {
  if (isAdding.value) {
    await addDoc(collection(db, 'users'), {
      name: name.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      address: address.value,
      permissions: permissions.value
    });

    // TODO: Register in the authentication
  } else {
    await updateDoc(doc(db, 'users', selectedUserId.value), {
      name: name.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      address: address.value,
      permissions: permissions.value
    });
  }

  closeModal();
  await getUsers();
};

// Delete user from Firestore
const deleteUser = async (userId: string) => {
  await deleteDoc(doc(db, 'users', userId));
  await getUsers();
};

// Open the update modal and populate form with user data
const openUpdateModal = (user: any) => {
  selectedUserId.value = user.id;
  name.value = user.name;
  email.value = user.email;
  phoneNumber.value = user.phoneNumber;
  address.value = user.address;
  permissions.value = user.permissions;
  isAdding.value = false;
  isUpdateModalOpen.value = true;
};

// Open the add user modal
const openAddModal = () => {
  selectedUserId.value = '';
  name.value = '';
  email.value = '';
  phoneNumber.value = '';
  address.value = '';
  permissions.value = {
    addUser: false,
    readUserList: false,
    updateUser: false,
    deleteUser: false,
    addJobToUser: false,
    updateUserJob: false
  };
  isAdding.value = true;
  isUpdateModalOpen.value = true;
};

// Close the modal
const closeModal = () => {
  isUpdateModalOpen.value = false;
};

// Lifecycle hook to fetch users on component mount
onMounted(async () => {
  await getUsers();
});
</script>
<template>
  <div class="container mx-auto p-4">
    <button
      @click="openAddModal"
      class="mb-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Add new user
    </button>

    <div
      v-if="permissions.readUserList || isRoot"
      class="overflow-x-auto mt-6"
    >
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">ID</th>
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Phone Number</th>
            <th scope="col" class="px-6 py-3">Address</th>
            <th scope="col" class="px-6 py-3">Permissions</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          >
            <td class="px-6 py-4">{{ user.id }}</td>
            <td class="px-6 py-4">{{ user.name }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">{{ user.phoneNumber }}</td>
            <td class="px-6 py-4">{{ user.address }}</td>
            <td class="px-6 py-4">
              <ul>
                <li v-if="user.permissions.addUser">Add user</li>
                <li v-if="user.permissions.readUserList">Read user list</li>
                <li v-if="user.permissions.updateUser">Update user</li>
                <li v-if="user.permissions.deleteUser">Delete user</li>
                <li v-if="user.permissions.addJobToUser">Add job to user</li>
                <li v-if="user.permissions.updateUserJob">Update user job</li>
              </ul>
            </td>
            <td class="px-6 py-4">
              <button @click="openUpdateModal(user)" class="text-blue-600 hover:text-blue-900">
                Update
              </button>
              <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900 ml-4">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Display message if user does not have readUserList permission -->
    <div v-else class="text-center mt-6">
      <p class="text-red-600">You don't have permission to view users.</p>
    </div>

    <!-- Update User Modal -->
    <div
      v-if="isUpdateModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg w-full">
        <form @submit.prevent="addUser">
          <div class="mb-4">
            <input
              placeholder="Name"
              v-model="name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div class="mb-4">
            <input
              placeholder="Email"
              v-model="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div class="mb-4">
            <input
              placeholder="Phone Number"
              v-model="phoneNumber"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div class="mb-4">
            <input
              placeholder="Address"
              v-model="address"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div class="mb-4">
            <label class="inline-flex items-center mb-2">
              <input
                type="checkbox"
                v-model="permissions.addUser"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2 text-gray-700">Add user permission</span>
            </label>
            <label class="inline-flex items-center mb-2">
              <input
                type="checkbox"
                v-model="permissions.readUserList"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2 text-gray-700">Read user list permission</span>
            </label>
            <label class="inline-flex items-center mb-2">
              <input
                type="checkbox"
                v-model="permissions.updateUser"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2 text-gray-700">Update user permission</span>
            </label>
            <label class="inline-flex items-center mb-2">
              <input
                type="checkbox"
                v-model="permissions.deleteUser"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2 text-gray-700">Delete user permission</span>
            </label>
            <label class="inline-flex items-center mb-2">
              <input
                type="checkbox"
                v-model="permissions.addJobToUser"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2 text-gray-700">Add job to user permission</span>
            </label>
            <label class="inline-flex items-center mb-2">
              <input
                type="checkbox"
                v-model="permissions.updateUserJob"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2 text-gray-700">Update user job permission</span>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <button
              type="submit"
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {{ isAdding ? 'Add new user' : 'Update user' }}
            </button>
          </div>
          <div class="mt-4 text-center">
            <button @click="closeModal" type="button" class="text-red-600 hover:text-red-900">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

form {
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  border: 1px solid #e5e7eb;
}

th {
  background-color: #f3f4f6;
}
</style>
