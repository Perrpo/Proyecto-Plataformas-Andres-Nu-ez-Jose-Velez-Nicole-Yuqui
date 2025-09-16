<template>
  <div class="about">
    <h1 class="main-title">Acerca de esta plataforma</h1>
    <p class="subtitle">Tecnología para reducir el desperdicio de alimentos</p>
    <div class="card">
      <p>
        Este proyecto conecta comercios con ONGs y consumidores para dar una segunda vida a
        productos próximos a vencer. Diseño inspirado en un estilo futurista minimalista.
      </p>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
  }
}
.main-title {
  background: var(--grad-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.subtitle {
  color: var(--text-secondary);
}
.card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--elevation-1);
  padding: 1.2rem 1.5rem;
  max-width: 720px;
}
</style>
