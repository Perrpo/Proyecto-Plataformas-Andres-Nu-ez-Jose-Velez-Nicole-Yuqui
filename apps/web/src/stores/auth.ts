import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref<any>(null)
  const token = ref<string | null>(null)

  // Inicializar sin autenticación por defecto
  // La autenticación se establecerá solo después de un login exitoso
  localStorage.removeItem('token')

  async function login(email: string, password: string) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      const data = await response.json()
      token.value = data.token
      user.value = data.user
      isAuthenticated.value = true
      localStorage.setItem('token', data.token)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error de conexión' }
    }
  }

  async function register(email: string, password: string, name: string, business?: string) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, business }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      // Solo retornar éxito, NO establecer autenticación automáticamente
      // El usuario debe hacer login después del registro
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error de conexión' }
    }
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  function getAuthHeaders() {
    return {
      Authorization: `Bearer ${token.value}`,
      'Content-Type': 'application/json',
    }
  }

  return {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    getAuthHeaders,
  }
})
