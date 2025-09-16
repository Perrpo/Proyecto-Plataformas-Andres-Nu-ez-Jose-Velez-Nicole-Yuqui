<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1 class="main-title">Dashboard de Productos</h1>
        <p class="subtitle">Gestiona tus productos próximos a vencer</p>
      </div>
      <div class="user-info">
        <div>
          <b>EcoSave Market</b>
          <div class="email">demo@ecosave.com</div>
        </div>
        <button class="logout">Salir</button>
      </div>
    </div>
    <div class="stats-row">
      <div class="stat-box">
        <span class="stat-icon stat-cube">🧊</span>
        <div>
          <div class="stat-title">Total Productos</div>
          <div class="stat-value">{{ totalProducts }}</div>
        </div>
      </div>
      <div class="stat-box">
        <span class="stat-icon stat-alert">⚠️</span>
        <div>
          <div class="stat-title">Expiran Pronto</div>
          <div class="stat-value">{{ urgentProducts }}</div>
        </div>
      </div>
      <div class="stat-box">
        <span class="stat-icon stat-heart">💖</span>
        <div>
          <div class="stat-title">Donados</div>
          <div class="stat-value">{{ donatedProducts }}</div>
        </div>
      </div>
      <div class="stat-box">
        <span class="stat-icon stat-percent">%</span>
        <div>
          <div class="stat-title">Con Descuento</div>
          <div class="stat-value">{{ discountProducts }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="main-title">Productos Próximos a Vencer</h2>
      <p class="subtitle">Productos que requieren acción inmediata</p>
      <div class="product-list">
        <div v-if="isLoading" class="loading-message">Cargando productos...</div>
        <div v-else-if="products.length === 0" class="no-products">
          <div class="no-products-icon">📦</div>
          <p>No hay productos registrados</p>
          <p class="no-products-desc">Agrega productos para comenzar a gestionar tu inventario</p>
        </div>
        <div v-else class="product" v-for="p in products" :key="p.id">
          <div class="product-info">
            <span class="dot" :class="p.color"></span>
            <span class="product-name">{{ p.nombre }}</span>
            <span class="badge" :class="p.estado">{{ p.estado }}</span>
            <div class="desc">{{ p.categoria }} • {{ p.unidades }} unidades</div>
            <div class="desc">
              <span class="calendar-icon">📅</span>
              Vence: {{ p.vencimiento }}
            </div>
          </div>
          <div class="actions">
            <button class="donar"><span>♡</span> Donar</button>
            <button class="descuento"><span>%</span> Descuento</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const products = ref<any[]>([])
const isLoading = ref(false)

// Datos de ejemplo para cuando no hay productos
const exampleProducts = [
  {
    id: 1,
    nombre: 'Pan integral',
    estado: 'Urgente',
    categoria: 'Panadería',
    unidades: 25,
    vencimiento: '2025-01-20 (HOY)',
    color: 'rojo',
  },
  {
    id: 2,
    nombre: 'Yogur natural',
    estado: 'Advertencia',
    categoria: 'Lácteos',
    unidades: 12,
    vencimiento: '2025-01-22 (2 días)',
    color: 'amarillo',
  },
  {
    id: 3,
    nombre: 'Manzanas',
    estado: 'Urgente',
    categoria: 'Frutas',
    unidades: 8,
    vencimiento: '2025-01-21 (1 día)',
    color: 'rojo',
  },
  {
    id: 4,
    nombre: 'Pollo fresco',
    estado: 'Urgente',
    categoria: 'Carnes',
    unidades: 5,
    vencimiento: '2025-01-19 (VENCIDO)',
    color: 'rojo',
  },
  {
    id: 5,
    nombre: 'Leche entera',
    estado: 'Advertencia',
    categoria: 'Lácteos',
    unidades: 15,
    vencimiento: '2025-01-25 (5 días)',
    color: 'amarillo',
  },
  {
    id: 6,
    nombre: 'Queso fresco',
    estado: 'Urgente',
    categoria: 'Lácteos',
    unidades: 3,
    vencimiento: '2025-01-20 (HOY)',
    color: 'rojo',
  },
  {
    id: 7,
    nombre: 'Tomates',
    estado: 'Advertencia',
    categoria: 'Verduras',
    unidades: 10,
    vencimiento: '2025-01-23 (3 días)',
    color: 'amarillo',
  },
]

// Cargar productos - VERSIÓN SIMPLE QUE FUNCIONA
function loadProducts() {
  console.log('Cargando productos...', exampleProducts.length)
  isLoading.value = true

  // Siempre usar datos de ejemplo por ahora
  products.value = exampleProducts

  console.log('Productos cargados:', products.value.length)
  isLoading.value = false
}

// Cargar productos al montar el componente
onMounted(() => {
  loadProducts()
})

// Estadísticas dinámicas
const totalProducts = computed(() => products.value.length)

const urgentProducts = computed(() => {
  return products.value.filter(
    (p) =>
      p.estado === 'Urgente' ||
      p.vencimiento.includes('HOY') ||
      p.vencimiento.includes('VENCIDO') ||
      p.vencimiento.includes('1 día'),
  ).length
})

const donatedProducts = computed(() => {
  return products.value.filter((p) => p.estado === 'Donado').length
})

const discountProducts = computed(() => {
  return products.value.filter((p) => p.estado === 'Descuento').length
})
</script>

<style scoped>
.main-title,
h1,
h2 {
  color: var(--text-primary) !important;
}
.dashboard-header h1.main-title {
  background: var(--grad-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 14px rgba(33, 230, 255, 0.12));
}
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}
.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}
.dashboard-header .subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.user-info .email {
  color: var(--text-secondary);
  font-size: 0.95rem;
}
.logout {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--text-primary);
  transition:
    background 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
}
.logout:hover {
  background: linear-gradient(90deg, rgba(33, 230, 255, 0.12), rgba(155, 92, 255, 0.12));
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
}
.stats-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}
.stat-box {
  background: var(--surface-1);
  border-radius: 14px;
  box-shadow: var(--elevation-1);
  border: 1px solid var(--border);
  padding: 1.2rem 2rem;
  display: flex;
  align-items: center;
  min-width: 180px;
  gap: 1rem;
}
.stat-icon {
  font-size: 2rem;
  margin-right: 0.5rem;
}
.stat-title {
  color: var(--text-secondary);
  font-size: 1rem;
}
.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}
.stat-cube {
  color: var(--neon-cyan);
}
.stat-alert {
  color: var(--neon-magenta);
}
.stat-heart {
  color: var(--neon-purple);
}
.stat-percent {
  color: var(--neon-yellow);
}
.charts-section {
  margin: 2rem 0;
}
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.points-section {
  margin: 2rem 0;
}
.card {
  background: var(--surface-1);
  border-radius: 14px;
  box-shadow: var(--elevation-1);
  border: 1px solid var(--border);
  backdrop-filter: blur(6px) saturate(130%);
  padding: 2rem;
  margin-top: 1rem;
}
.card h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}
.card .subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 1.2rem;
}
.product-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.product {
  background: var(--surface-1);
  border-radius: 12px;
  box-shadow: var(--elevation-1);
  border: 1px solid var(--border);
  padding: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.loading-message {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
}
.no-products {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
}
.no-products-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.no-products p {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}
.no-products-desc {
  font-size: 1rem;
  color: var(--text-secondary);
}
.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.product-name {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.1rem;
  display: inline-block;
}
.dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
}
.dot.rojo {
  background: var(--neon-magenta);
}
.dot.amarillo {
  background: var(--neon-yellow);
}
.dot.verde {
  background: var(--neon-cyan);
}
.badge {
  margin-left: 8px;
  padding: 2px 10px;
  border-radius: 8px;
  font-size: 0.95rem;
  background: var(--surface-2);
  color: var(--text-primary);
  font-weight: 500;
  border: 1px solid var(--border);
  display: inline-block;
}
.desc {
  color: var(--text-secondary);
  font-size: 0.98rem;
  margin-top: 2px;
}
.calendar-icon {
  margin-right: 4px;
}
.actions {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.donar,
.descuento {
  background: var(--surface-1);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.donar:hover,
.descuento:hover {
  background: linear-gradient(90deg, rgba(33, 230, 255, 0.12), rgba(155, 92, 255, 0.12));
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
}
@media (max-width: 900px) {
  .stats-row {
    flex-direction: column;
    gap: 1rem;
  }
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
  }
  .card {
    padding: 1rem;
  }
}
</style>
