<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const navigateToHome = () => {
  router.push('/');
};
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="logo" @click="navigateToHome">
        <span class="logo-text">Chess Game</span>
      </div>

      <nav v-if="authStore.isAuthenticated" class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/chessboard" class="nav-link">Play</router-link>
      </nav>

      <div class="auth-actions">
        <template v-if="authStore.isAuthenticated">
          <span class="username">{{ authStore.username }}</span>
          <button @click="handleLogout" class="logout-btn">
            <i class="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<style lang="postcss" scoped>
.header {
  @apply fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg shadow-md;
}

.header-content {
  @apply container mx-auto px-4 h-16 flex items-center justify-between;
}

.logo {
  @apply flex items-center gap-3 cursor-pointer;
}

.logo-img {
  @apply h-8 w-8;
}

.logo-text {
  @apply text-xl font-bold;
  background: linear-gradient(135deg, theme('colors.primary'), theme('colors.accent'));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  @apply flex items-center gap-6;
}

.nav-link {
  @apply text-text-secondary hover:text-primary transition-colors duration-200 font-medium;
}

.nav-link.router-link-active {
  @apply text-primary font-semibold;
}

.auth-actions {
  @apply flex items-center gap-4;
}

.username {
  @apply text-text-secondary font-medium;
}

.logout-btn {
  @apply px-4 py-2 rounded-lg bg-red-500 text-white font-medium
         flex items-center gap-2 hover:bg-red-600 transition-all duration-200;
}
</style> 