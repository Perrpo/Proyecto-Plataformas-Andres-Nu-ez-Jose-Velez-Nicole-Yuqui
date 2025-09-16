<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import AuthForm from './components/AuthForm.vue'

const auth = useAuthStore()
</script>

<template>
  <div v-if="!auth.isAuthenticated">
    <AuthForm />
  </div>
  <div v-else class="layout">
    <Sidebar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
}
.main-content {
  margin-left: 220px;
  padding: 2rem;
  width: 100%;
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(19, 26, 34, 0.85), rgba(19, 26, 34, 0.8)),
    radial-gradient(600px 300px at 10% 0%, rgba(33, 230, 255, 0.06), rgba(0, 0, 0, 0)),
    radial-gradient(600px 300px at 90% 0%, rgba(255, 63, 180, 0.05), rgba(0, 0, 0, 0));
  backdrop-filter: saturate(120%) blur(2px);
  border-left: 1px solid var(--border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}
</style>
