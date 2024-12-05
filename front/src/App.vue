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
  <div class="container">
    <div v-if="!authStore.isAuthenticated" class="auth-container">
      <TabView>
        <TabPanel header="Login" value="login">
          <Login />
        </TabPanel>
        <TabPanel header="Register" value="register">
          <Register />
        </TabPanel>
      </TabView>
    </div>

    <div v-else>
      <Home />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--surface-ground);
}

.auth-container {
  width: 100%;
  max-width: 450px;
}
</style>
