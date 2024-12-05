<script setup lang="ts">
import { ref } from 'vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Home from './components/Home.vue';
import Header from './components/Header.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { useAuthStore } from './stores/auth';
import Toast from 'primevue/toast';

const authStore = useAuthStore();
</script>

<template>
  <div class="app-wrapper">
    <Header />
    <Toast />
    <main class="main-content">
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
    </main>
  </div>
</template>

<style lang="postcss" scoped>
.app-wrapper {
  @apply min-h-screen;
  background: linear-gradient(135deg, theme('colors.background'), theme('colors.surface'));
}

.main-content {
  @apply container mx-auto pt-24 px-4 flex justify-center items-center min-h-screen;
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

:deep(.p-toast) {
  @apply opacity-95;
}

:deep(.p-toast-message) {
  @apply rounded-xl shadow-lg border-none;
}

:deep(.p-toast-message-success) {
  @apply bg-green-50 text-green-800;
}

:deep(.p-toast-message-error) {
  @apply bg-red-50 text-red-800;
}

:deep(.p-toast-icon-close) {
  @apply opacity-50 hover:opacity-100 transition-opacity;
}
</style>
