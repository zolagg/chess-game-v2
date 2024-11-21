<script setup lang="ts">
import { ref } from 'vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Chessboard from './components/Chessboard.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

const isAuthenticated = ref(false);

const handleLoginSuccess = () => {
  isAuthenticated.value = true;
};

const onSquareClicked = (square: string) => {
  // Handle the square click event
  console.log('Square clicked:', square);
};
</script>

<template>
  <div class="container">
    <div v-if="!isAuthenticated" class="auth-container">
      <TabView>
        <TabPanel header="Login" value="login">
          <Login @login-success="handleLoginSuccess" />
        </TabPanel>
        <TabPanel header="Register" value="register">
          <Register @register-success="handleLoginSuccess" />
        </TabPanel>
      </TabView>
    </div>

    <div v-else class="game-container">
      <Chessboard @square-clicked="onSquareClicked" />
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

.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
