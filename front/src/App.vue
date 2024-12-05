<script setup lang="ts">
import { ref } from 'vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Home from './components/Home.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="app-container">
    <div v-if="!authStore.isAuthenticated" class="auth-container">
      <TabView>
        <TabPanel header="Login">
          <Login />
        </TabPanel>
        <TabPanel header="Register">
          <Register />
        </TabPanel>
      </TabView>
    </div>

    <div v-else>
      <Home />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.app-container {
  @apply flex justify-center items-center min-h-screen p-8;
  background: linear-gradient(135deg, theme('colors.background'), theme('colors.surface'));
}

.auth-container {
  @apply w-full max-w-md;
}

:deep(.p-tabview) {
  @apply bg-transparent;
}

:deep(.p-tabview-panels) {
  @apply p-0 mt-4;
}

:deep(.p-tabview-nav) {
  @apply flex gap-2 mb-6 border-none;
}

:deep(.p-tabview-nav-link) {
  @apply px-6 py-3 rounded-lg text-text-secondary font-medium
         transition-all duration-200 bg-white/50 backdrop-blur-sm
         hover:text-primary hover:bg-white/80;
}

:deep(.p-tabview-selected .p-tabview-nav-link) {
  @apply text-primary bg-white shadow-md;
  background: linear-gradient(135deg, theme('colors.primary'), theme('colors.accent'));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
