<template>
  <div class="map-dashboard">
    <div class="dashboard-header">
      <h1 class="main-title">Mapa de Puntos de Recolección</h1>
      <div class="user-info">
        <div>
          <b>EcoSave Market</b>
          <div class="email">demo@ecosave.com</div>
        </div>
        <button class="logout">Salir</button>
      </div>
    </div>
    <p class="subtitle">Encuentra ONGs y consumidores cercanos para tus donaciones</p>
    <div class="search-row">
      <input class="search" placeholder="Buscar por nombre o dirección..." v-model="query" />
      <div class="filters">
        <button class="filter active">Todos</button>
        <button class="filter">ONGs</button>
        <button class="filter">Consumidores</button>
        <button class="filter" @click="handleSearch" :disabled="isLoading">Buscar</button>
        <button class="filter" @click="clearSearch" :disabled="isLoading">Limpiar</button>
        <button class="filter" @click="handleMyLocation" :disabled="isLoading">Mi ubicación</button>
      </div>
    </div>
    <div class="card">
      <h2 class="main-title">Mapa de Puntos de Recolección</h2>
      <p class="subtitle">ONGs y consumidores cercanos para donaciones</p>

      <!-- Mapa interactivo -->
      <div class="map-container">
        <div id="map" ref="mapRef" class="google-map">
          <div class="map-fallback">
            <div class="map-icon">🗺️</div>
            <div class="map-text">Mapa de Ubicaciones</div>
            <div class="map-desc">ONGs y Consumidores en Medellín</div>
            <div class="map-coords">
              <div v-for="loc in locations" :key="loc.id" class="location-pin">
                <div class="pin-icon" :class="loc.tipo === 'ONG' ? 'ong' : 'consumer'">
                  {{ loc.tipo === 'ONG' ? '🏢' : '👤' }}
                </div>
                <div class="pin-info">
                  <strong>{{ loc.nombre }}</strong>
                  <div class="pin-address">{{ loc.direccion }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="filters" style="margin-top: 1rem">
        <button class="filter" @click="addNewLocation">Agregar ubicación</button>
        <button class="filter" @click="refreshLocations">Actualizar lista</button>
      </div>
      <p v-if="message" class="desc" style="margin-top: 0.5rem">{{ message }}</p>
      <div class="locations">
        <h3 class="main-title" style="margin-top: 2rem">Ubicaciones Cercanas</h3>
        <div class="location" v-for="loc in locations" :key="loc.id">
          <div>
            <b>{{ loc.nombre }}</b>
            <span class="badge">{{ loc.tipo }}</span>
            <div class="desc">{{ loc.direccion }}</div>
            <div class="desc">Especialidades: {{ loc.especialidades.join(', ') }}</div>
          </div>
          <div class="actions">
            <button @click="openRouteToAddress(loc.direccion)">Ruta</button>
            <button>Contactar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'

// Declarar tipos de Google Maps
declare global {
  interface Window {
    google: typeof google
  }
}

const query = ref('')
const isLoading = ref(false)
const message = ref('')
const mapRef = ref<HTMLDivElement>()
let map: google.maps.Map | null = null
let markers: google.maps.Marker[] = []

interface Location {
  id: number
  nombre: string
  tipo: string
  direccion: string
  especialidades: string[]
  lat?: number
  lng?: number
}

// Ubicaciones con coordenadas para Google Maps
const locations = ref<Location[]>([
  {
    id: 1,
    nombre: 'Banco de Alimentos Central',
    tipo: 'ONG',
    direccion: 'Calle 50 #25-30, Medellín',
    especialidades: ['Alimentos frescos', 'Productos no perecederos'],
    lat: 6.2442,
    lng: -75.5812,
  },
  {
    id: 2,
    nombre: 'Fundación Esperanza',
    tipo: 'ONG',
    direccion: 'Carrera 43 #25-15, Medellín',
    especialidades: ['Frutas', 'Verduras', 'Panadería'],
    lat: 6.2088,
    lng: -75.5707,
  },
  {
    id: 3,
    nombre: 'María González',
    tipo: 'Consumidor',
    direccion: 'Calle 30 #45-20, Medellín',
    especialidades: ['Productos orgánicos'],
    lat: 6.2673,
    lng: -75.5681,
  },
  {
    id: 4,
    nombre: 'Comedor Comunitario San José',
    tipo: 'ONG',
    direccion: 'Calle 80 #45-20, Medellín',
    especialidades: ['Comidas preparadas', 'Alimentos básicos'],
    lat: 6.2308,
    lng: -75.5906,
  },
  {
    id: 5,
    nombre: 'Carlos Mendoza',
    tipo: 'Consumidor',
    direccion: 'Carrera 70 #30-15, Medellín',
    especialidades: ['Productos frescos'],
    lat: 6.2518,
    lng: -75.5636,
  },
])

// Agregar nueva ubicación
async function addNewLocation() {
  const nombre = prompt('Nombre de la ubicación:')
  if (!nombre) return

  const tipo = prompt('Tipo (ONG/Consumidor):', 'ONG')
  if (!tipo) return

  const direccion = prompt('Dirección:')
  if (!direccion) return

  const especialidadesInput = prompt('Especialidades (separadas por comas):', '')
  const especialidades = especialidadesInput
    ? especialidadesInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s)
    : []

  const body = {
    nombre,
    tipo,
    direccion,
    especialidades,
  }

  try {
    const res = await fetch('http://localhost:3000/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const created = await res.json()
      locations.value.push(created)
      message.value = 'Ubicación agregada exitosamente.'
    } else {
      message.value = 'Error al agregar la ubicación.'
    }
  } catch {
    message.value = 'Error de conexión.'
  }
}

// Actualizar lista de ubicaciones
async function refreshLocations() {
  isLoading.value = true
  try {
    // En esta versión, las ubicaciones ya están cargadas localmente
    // En una versión real, aquí harías fetch al backend
    message.value = 'Lista actualizada.'
  } catch {
    message.value = 'Error al actualizar la lista.'
  } finally {
    isLoading.value = false
  }
}

// Limpiar búsqueda y mostrar todas las ubicaciones
function clearSearch() {
  query.value = ''
  refreshLocations()
}

// Buscar ubicaciones
function handleSearch() {
  if (!query.value.trim()) {
    message.value = ''
    return
  }

  const filtered = locations.value.filter(
    (loc) =>
      loc.nombre.toLowerCase().includes(query.value.toLowerCase()) ||
      loc.direccion.toLowerCase().includes(query.value.toLowerCase()) ||
      loc.tipo.toLowerCase().includes(query.value.toLowerCase()),
  )

  if (filtered.length === 0) {
    message.value = 'No se encontraron ubicaciones con ese criterio.'
  } else {
    message.value = `Se encontraron ${filtered.length} ubicaciones.`
    // Mostrar solo las ubicaciones filtradas
    locations.value = filtered
  }
}

// Obtener ubicación del usuario
function handleMyLocation() {
  if (!navigator.geolocation) {
    message.value = 'Tu navegador no soporta geolocalización.'
    return
  }

  isLoading.value = true
  message.value = ''

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      isLoading.value = false
      const coords = `${pos.coords.latitude},${pos.coords.longitude}`
      message.value = `Tu ubicación: ${coords}`
    },
    () => {
      isLoading.value = false
      message.value = 'No se pudo obtener tu ubicación.'
    },
    { enableHighAccuracy: true, timeout: 10000 },
  )
}

// Abrir ruta en Google Maps
function openRouteToAddress(destinationAddress: string) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationAddress)}`
  window.open(url, '_blank')
}

// Inicializar Google Maps
async function initMap() {
  if (!mapRef.value) return

  // Cargar el script de Google Maps si no está cargado
  if (!window.google) {
    await loadGoogleMapsScript()
  }

  // Crear el mapa
  map = new google.maps.Map(mapRef.value, {
    center: { lat: 6.2442, lng: -75.5812 }, // Medellín
    zoom: 12,
    styles: [
      {
        featureType: 'all',
        elementType: 'geometry.fill',
        stylers: [{ color: '#1a1a1a' }],
      },
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#ffffff' }],
      },
    ],
  })

  // Agregar marcadores
  addMarkersToMap()
}

// Función global de callback para Google Maps
declare global {
  function initGoogleMaps(): void
}

// Cargar el script de Google Maps
function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve()
      return
    }

    // Crear función global de callback
    window.initGoogleMaps = () => {
      resolve()
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&loading=async&callback=initGoogleMaps`
    script.async = true
    script.defer = true
    script.onerror = () => reject(new Error('Error loading Google Maps'))
    document.head.appendChild(script)
  })
}

// Agregar marcadores al mapa
function addMarkersToMap() {
  if (!map) return

  // Limpiar marcadores existentes
  markers.forEach((marker) => marker.setMap(null))
  markers = []

  locations.value.forEach((location) => {
    if (location.lat && location.lng) {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.nombre,
        icon: {
          url:
            location.tipo === 'ONG'
              ? 'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#00E6FF" stroke="#fff" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" fill="#000" font-size="12" font-weight="bold">ONG</text>
              </svg>
            `)
              : 'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#9B5CFF" stroke="#fff" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">USER</text>
              </svg>
            `),
        },
      })

      // Crear info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #000; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; color: #333;">${location.nombre}</h3>
            <p style="margin: 0 0 4px 0; font-size: 14px;"><strong>Tipo:</strong> ${location.tipo}</p>
            <p style="margin: 0 0 4px 0; font-size: 14px;"><strong>Dirección:</strong> ${location.direccion}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Especialidades:</strong> ${location.especialidades.join(', ')}</p>
          </div>
        `,
      })

      // Agregar evento click al marcador
      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      markers.push(marker)
    }
  })
}

// Cargar ubicaciones al montar el componente
onMounted(async () => {
  await refreshLocations()
  await nextTick()
  // initMap() - Comentado para usar versión alternativa
})
</script>

<style scoped>
.map-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}
.main-title,
h1,
h2,
h3 {
  color: var(--text-primary) !important;
  font-weight: 700;
}
.dashboard-header h1 {
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
  line-height: 1.3;
  font-weight: 600;
}
.dashboard-header .subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 0.5rem;
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
.search-row {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}
.search {
  flex: 1;
  padding: 0.7rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface-1);
  color: var(--text-primary);
  font-size: 1rem;
}
.filters {
  display: flex;
  gap: 0.5rem;
}
.filter {
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
.filter.active {
  background: linear-gradient(90deg, rgba(33, 230, 255, 0.2), rgba(155, 92, 255, 0.2));
  color: var(--text-primary);
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
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  line-height: 1.4;
  color: var(--text-primary);
}
.map-container {
  background: var(--surface-2);
  border-radius: 12px;
  margin-top: 1.2rem;
  border: 1px solid var(--border);
  overflow: hidden;
  min-height: 400px;
}
.google-map {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  position: relative;
}
.map-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, var(--surface-2) 0%, var(--surface-1) 100%);
}
.map-icon {
  font-size: 3rem;
  color: var(--neon-cyan);
  margin-bottom: 1rem;
}
.map-text {
  font-size: 1.5rem;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.map-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}
.map-coords {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.2rem;
  width: 100%;
  max-width: 900px;
}
.location-pin {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: var(--surface-1);
  padding: 1.2rem;
  border-radius: 14px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.location-pin:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.pin-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}
.pin-icon.ong {
  background: linear-gradient(135deg, #00e6ff, #0099cc);
  color: #000;
}
.pin-icon.consumer {
  background: linear-gradient(135deg, #9b5cff, #7b2cbf);
  color: #fff;
}
.pin-info {
  flex: 1;
  text-align: left;
}
.pin-info strong {
  color: var(--text-primary);
  font-size: 1.1rem;
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
  line-height: 1.3;
}
.pin-address {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.4;
}
.locations {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.location {
  background: var(--surface-1);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: var(--elevation-1);
  border: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.badge {
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.85rem;
  background: var(--neon-cyan);
  color: #020409;
}
.desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
}
.actions button {
  margin-left: 8px;
  background: var(--surface-1);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition:
    background 160ms ease,
    box-shadow 160ms ease,
    color 160ms ease;
}
.actions button:hover {
  background: linear-gradient(90deg, rgba(33, 230, 255, 0.12), rgba(155, 92, 255, 0.12));
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
}
@media (max-width: 900px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
  }
  .card {
    padding: 1rem;
  }
  .search-row {
    flex-direction: column;
    gap: 0.7rem;
  }
}
</style>
