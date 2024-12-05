<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <router-link :to="{ name: 'Home' }" class="home-link">
      Return to Home
    </router-link>
  </div>
</template>

<style scoped>
.not-found {
  @apply flex flex-col items-center justify-center min-h-[60vh] text-center;
}

h1 {
  @apply text-3xl font-bold mb-4 text-primary;
}

p {
  @apply text-lg mb-6 text-text-secondary;
}

.home-link {
  @apply px-6 py-2 bg-primary text-white rounded-lg 
         hover:bg-primary/90 transition-colors duration-200;
}
</style> 