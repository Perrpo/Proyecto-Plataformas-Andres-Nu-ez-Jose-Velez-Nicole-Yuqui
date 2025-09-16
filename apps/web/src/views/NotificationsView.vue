<template>
  <div class="notifications-dashboard">
    <div class="dashboard-header">
      <h1 class="main-title">Panel de Notificaciones</h1>
      <div class="user-info">
        <div>
          <b>EcoSave Market</b>
          <div class="email">demo@ecosave.com</div>
        </div>
        <button class="logout">Salir</button>
      </div>
    </div>
    <p class="subtitle">Alertas automáticas sobre inventarios y actividades</p>
    <div class="actions-row">
      <span class="badge-unread">{{ unreadCount }} sin leer</span>
      <button class="mark-read" @click="markAllAsRead" :disabled="unreadCount === 0">
        Marcar todas como leídas
      </button>
    </div>
    <div class="card config-card">
      <h2 class="main-title"><span class="icon">⚙️</span> Configuración de Alertas</h2>
      <p class="subtitle">Personaliza qué notificaciones quieres recibir</p>
      <div class="alert-list">
        <div class="alert-item">
          <span>Alertas de vencimiento</span>
          <label class="switch">
            <input type="checkbox" checked />
            <span class="slider"></span>
          </label>
        </div>
        <div class="alert-item">
          <span>Confirmaciones de donación</span>
          <label class="switch">
            <input type="checkbox" checked />
            <span class="slider"></span>
          </label>
        </div>
        <div class="alert-item">
          <span>Alertas de inventario bajo</span>
          <label class="switch">
            <input type="checkbox" checked />
            <span class="slider"></span>
          </label>
        </div>
        <div class="alert-item">
          <span>Nuevos socios en área</span>
          <label class="switch">
            <input type="checkbox" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
    <div class="card">
      <h2 class="main-title">Notificaciones Recientes</h2>
      <p class="subtitle">Historial de alertas y actividades del sistema</p>
      <div class="notification-list">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification', notification.type]"
        >
          <div class="notification-header">
            <span class="icon">
              {{
                notification.type === 'urgent'
                  ? '⚠️'
                  : notification.type === 'warning'
                    ? '⏰'
                    : notification.type === 'success'
                      ? '✅'
                      : '🔔'
              }}
            </span>
            <b>{{ notification.text.split(' - ')[0] }}</b>
            <span :class="['badge', notification.type]">
              {{
                notification.type === 'urgent'
                  ? 'Urgente'
                  : notification.type === 'warning'
                    ? 'Advertencia'
                    : notification.type === 'success'
                      ? 'Éxito'
                      : 'Info'
              }}
            </span>
            <span v-if="!notification.isRead" class="dot blue"></span>
            <div class="actions-icons">
              <button
                v-if="!notification.isRead"
                class="icon-btn"
                title="Marcar como leído"
                @click="markAsRead(notification.id)"
              >
                ✔️
              </button>
              <button
                class="icon-btn"
                title="Eliminar"
                @click="deleteNotification(notification.id)"
              >
                🗑️
              </button>
            </div>
          </div>
          <div class="notification-body">
            {{ notification.text.split(' - ')[1] || notification.text }}
          </div>
          <div class="notification-footer">
            <span>{{ notification.timestamp }}</span>
          </div>
        </div>
        <div v-if="notifications.length === 0" class="no-notifications">
          <span class="icon">📭</span>
          <p>No hay notificaciones para mostrar</p>
        </div>
      </div>
    </div>
    <div class="summary-row">
      <div class="summary-card">
        <span class="icon summary-alert">⚠️</span>
        <span class="summary-title">Alertas Urgentes</span>
        <span class="summary-value">{{
          notifications.filter((n) => n.type === 'urgent').length
        }}</span>
      </div>
      <div class="summary-card">
        <span class="icon summary-warning">⏰</span>
        <span class="summary-title">Advertencias</span>
        <span class="summary-value">{{
          notifications.filter((n) => n.type === 'warning').length
        }}</span>
      </div>
      <div class="summary-card">
        <span class="icon summary-success">✅</span>
        <span class="summary-title">Acciones Completadas</span>
        <span class="summary-value">{{
          notifications.filter((n) => n.type === 'success').length
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

// Notificaciones - VERSIÓN SIMPLE QUE FUNCIONA
const notifications = ref([
  {
    id: 1,
    text: 'Producto vence hoy - Pollo fresco (5 unidades)',
    type: 'urgent',
    isRead: false,
    timestamp: 'Hace 2 min',
  },
  {
    id: 2,
    text: 'Vencimiento en 2 días - Pan integral (25 unidades)',
    type: 'warning',
    isRead: false,
    timestamp: 'Hace 1 hora',
  },
  {
    id: 3,
    text: 'Donación completada - Leche entera a Banco de Alimentos Central',
    type: 'success',
    isRead: true,
    timestamp: 'Hace 3 horas',
  },
  {
    id: 4,
    text: 'Nueva ONG registrada - Fundación Esperanza en tu área',
    type: 'info',
    isRead: true,
    timestamp: 'Hace 1 día',
  },
  {
    id: 5,
    text: 'Inventario bajo - Quedan pocas unidades de productos en categoría Frutas',
    type: 'warning',
    isRead: true,
    timestamp: 'Hace 2 días',
  },
])

const isLoading = ref(false)

// Cargar notificaciones al montar el componente
onMounted(() => {
  // Las notificaciones ya están cargadas en el ref
})

// Contador de notificaciones sin leer
const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.isRead).length
})

// Función para marcar todas como leídas - VERSIÓN SIMPLE
function markAllAsRead() {
  notifications.value.forEach((notification) => {
    notification.isRead = true
  })
}

// Función para marcar una notificación específica como leída - VERSIÓN SIMPLE
function markAsRead(id: number) {
  const notification = notifications.value.find((n) => n.id === id)
  if (notification) {
    notification.isRead = true
  }
}

// Función para eliminar una notificación (simulada por ahora)
function deleteNotification(id: number) {
  const index = notifications.value.findIndex((n) => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}
</script>

<style scoped>
.main-title,
h1,
h2 {
  color: var(--text-primary);
  font-weight: 700;
}
.dashboard-header h1.main-title {
  background: var(--grad-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 14px rgba(33, 230, 255, 0.12));
}
.notifications-dashboard {
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
  margin-bottom: 0.2rem;
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
.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
}
.actions-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
}
.badge-unread {
  background: var(--neon-magenta);
  color: #020409;
  border-radius: 12px;
  font-size: 0.95rem;
  padding: 6px 18px;
  font-weight: 500;
  box-shadow:
    0 0 0 1px rgba(255, 63, 180, 0.45),
    0 0 18px rgba(255, 63, 180, 0.35);
}
.mark-read {
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
.mark-read:hover:not(:disabled) {
  background: linear-gradient(90deg, rgba(33, 230, 255, 0.12), rgba(155, 92, 255, 0.12));
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
}
.mark-read:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
.config-card {
  margin-bottom: 1.5rem;
}
.icon {
  font-size: 1.3rem;
  margin-right: 0.5rem;
  vertical-align: middle;
}
.alert-list {
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.05rem;
  color: var(--text-primary);
}
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--surface-2);
  border-radius: 24px;
  transition: 0.4s;
}
.switch input:checked + .slider {
  background: linear-gradient(90deg, rgba(33, 230, 255, 0.4), rgba(155, 92, 255, 0.4));
}
.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: var(--mist);
  border-radius: 50%;
  transition: 0.4s;
}
.switch input:checked + .slider:before {
  transform: translateX(20px);
}
.notification-list {
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.notification {
  background: var(--surface-1);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 1.2rem;
  box-shadow: var(--elevation-1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}
.notification.urgent {
  border-color: rgba(255, 63, 180, 0.35);
  background: linear-gradient(180deg, rgba(255, 63, 180, 0.06), rgba(0, 0, 0, 0));
}
.notification.warning {
  border-color: rgba(247, 245, 74, 0.35);
  background: linear-gradient(180deg, rgba(247, 245, 74, 0.08), rgba(0, 0, 0, 0));
}
.notification.success {
  border-color: rgba(33, 230, 255, 0.35);
  background: linear-gradient(180deg, rgba(33, 230, 255, 0.06), rgba(0, 0, 0, 0));
}
.notification.info {
  border-color: rgba(155, 92, 255, 0.35);
  background: linear-gradient(180deg, rgba(155, 92, 255, 0.06), rgba(0, 0, 0, 0));
}
.notification-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.1rem;
}
.notification-header b {
  font-size: 1.1rem;
  color: var(--text-primary);
}
.badge {
  padding: 2px 10px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  margin-left: 8px;
}
.badge.urgent {
  background: var(--neon-magenta);
  color: #020409;
}
.badge.warning {
  background: var(--neon-yellow);
  color: #020409;
}
.badge.success {
  background: var(--neon-cyan);
  color: #020409;
}
.badge.info {
  background: var(--neon-purple);
  color: #020409;
}
.dot.blue {
  width: 10px;
  height: 10px;
  background: var(--neon-cyan);
  border-radius: 50%;
  display: inline-block;
  margin-left: 8px;
}
.actions-icons {
  margin-left: auto;
  display: flex;
  gap: 0.3rem;
}
.icon-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--text-primary);
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.2s;
}
.icon-btn:hover {
  background: linear-gradient(90deg, rgba(33, 230, 255, 0.12), rgba(155, 92, 255, 0.12));
}
.notification-body {
  color: var(--text-primary);
  font-size: 1rem;
  margin-left: 2.2rem;
}
.notification-footer {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-left: 2.2rem;
}
.summary-row {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
}
.summary-card {
  background: var(--surface-1);
  border-radius: 14px;
  box-shadow: var(--elevation-1);
  border: 1px solid var(--border);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 220px;
  font-size: 1.1rem;
}
.summary-title {
  color: var(--text-secondary);
  font-weight: 500;
}
.summary-value {
  font-size: 1.3rem;
  font-weight: 700;
  margin-left: auto;
  color: var(--text-primary);
}
.summary-alert {
  color: var(--neon-magenta);
}
.summary-warning {
  color: var(--neon-yellow);
}
.summary-success {
  color: var(--neon-cyan);
}
.no-notifications {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
}
.no-notifications .icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}
.no-notifications p {
  font-size: 1.1rem;
  margin: 0;
}
@media (max-width: 900px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
  }
  .card {
    padding: 1rem;
  }
  .summary-row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
