<template>
  <div class="auth-bg">
    <div class="auth-container">
      <div class="split-card" :class="{ 'is-register': tab === 'register' }">
        <aside class="panel-left">
          <div class="brand">
            <span class="brand-logo">🍱</span>
          </div>
          <Transition name="fade-slide" mode="out-in">
            <div v-if="tab === 'login'" key="left-login">
              <h2 class="right-title">Sign In</h2>
              <form @submit.prevent="handleSubmit" class="form">
                <div class="input-row">
                  <span class="icon">@</span>
                  <input
                    type="email"
                    id="email-left"
                    v-model="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div class="input-row">
                  <span class="icon">🔒</span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password-left"
                    v-model="password"
                    placeholder="Password"
                    required
                    autocomplete="current-password"
                  />
                  <button
                    type="button"
                    class="reveal-btn"
                    :aria-pressed="showPassword ? 'true' : 'false'"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword"
                  >
                    {{ showPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
                <div v-if="error" class="error-message">{{ error }}</div>
                <button class="submit-btn" type="submit" :disabled="isLoading">
                  {{ isLoading ? 'Procesando...' : 'SIGN IN' }}
                </button>
              </form>
              <div class="switch-row">
                <button class="ghost" @click="tab = 'register'">Create account</button>
              </div>
            </div>
            <div v-else key="left-welcome">
              <h2 class="left-title">Welcome Back!</h2>
              <p class="left-text">
                To keep connected with us please login with your personal info
              </p>
              <button class="left-cta" @click="tab = 'login'">SIGN IN</button>
            </div>
          </Transition>
        </aside>
        <section class="panel-right">
          <Transition name="fade-slide" mode="out-in">
            <div v-if="tab === 'register'" key="right-register">
              <h2 class="right-title">Create Account</h2>
              <p class="right-helper">or use your email for registration:</p>
              <form @submit.prevent="handleSubmit" class="form">
                <div class="input-row">
                  <span class="icon">👤</span>
                  <input
                    type="text"
                    id="username-right"
                    v-model="username"
                    placeholder="Name"
                    required
                  />
                </div>
                <div class="input-row">
                  <span class="icon">🏢</span>
                  <input
                    type="text"
                    id="business-right"
                    v-model="business"
                    placeholder="Business (optional)"
                  />
                </div>
                <div class="input-row">
                  <span class="icon">@</span>
                  <input
                    type="email"
                    id="email-right"
                    v-model="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div class="input-row">
                  <span class="icon">🔒</span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password-right"
                    v-model="password"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    class="reveal-btn"
                    :aria-pressed="showPassword ? 'true' : 'false'"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword"
                  >
                    {{ showPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
                <div v-if="error" class="error-message">{{ error }}</div>
                <button class="submit-btn" type="submit" :disabled="isLoading">
                  {{ isLoading ? 'Procesando...' : 'SIGN UP' }}
                </button>
              </form>
              <div class="switch-row">
                <button class="ghost" @click="tab = 'login'">I already have an account</button>
              </div>
            </div>
            <div v-else key="right-hello">
              <h2 class="left-title">Hello, friend</h2>
              <p class="left-text">Enter your personal details and start journey with us</p>
              <button class="left-cta" @click="tab = 'register'">SIGN UP</button>
            </div>
          </Transition>
        </section>
        <div class="switch-overlay" aria-hidden="true"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const tab = ref<'login' | 'register'>('login')
const username = ref('')
const email = ref('')
const password = ref('')
const business = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

async function handleSubmit() {
  if (!email.value || !password.value) {
    error.value = 'Email y contraseña son requeridos'
    return
  }

  if (tab.value === 'register' && !username.value) {
    error.value = 'Nombre es requerido para registrarse'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    let result
    if (tab.value === 'login') {
      result = await auth.login(email.value, password.value)
      if (result.success) {
        router.push('/dashboard')
      } else {
        error.value = result.error || 'Error desconocido'
      }
    } else {
      result = await auth.register(email.value, password.value, username.value, business.value)
      if (result.success) {
        // Mostrar mensaje de éxito y cambiar a Sign In
        error.value = '¡Registro exitoso! Ahora puedes iniciar sesión.'
        tab.value = 'login'
        // Limpiar formulario
        username.value = ''
        business.value = ''
        email.value = ''
        password.value = ''
      } else {
        error.value = result.error || 'Error desconocido'
      }
    }
  } catch {
    error.value = 'Error de conexión'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-bg {
  min-height: 100vh;
  background:
    radial-gradient(1400px 800px at -10% -20%, rgba(72, 149, 239, 0.3), rgba(0, 0, 0, 0)),
    radial-gradient(1200px 700px at 110% 10%, rgba(159, 66, 245, 0.25), rgba(0, 0, 0, 0)),
    linear-gradient(160deg, #0b0f14 0%, #0e141a 60%, #0a0e13 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
/* Split layout + transition */
.auth-container {
  width: min(1120px, 96vw);
}
.split-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #0e141a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  box-shadow:
    0 40px 100px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  overflow: hidden;
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9; /* rectangular layout */
  min-height: 520px;
  backdrop-filter: saturate(120%) blur(2px);
}
.panel-left {
  background: linear-gradient(135deg, #1fb4a3 0%, #17a19a 45%, #10938d 90%);
  color: #e8fffa;
  padding: 1.4rem 1.3rem;
  position: relative;
  transition: background 280ms ease;
  display: grid;
  grid-auto-rows: min-content;
  row-gap: 0.9rem;
  align-content: center;
  justify-items: center;
  text-align: center;
}
.brand {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
}
.left-title {
  font-size: 2rem;
  margin: 0.7rem 0 0.45rem 0;
  font-weight: 700;
  text-align: center;
  width: 100%;
}
.left-text {
  opacity: 0.95;
  max-width: 360px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.05rem;
  line-height: 1.55;
}
.left-cta {
  margin-top: 1.1rem;
  background: transparent;
  color: #e8fffa;
  border: 2px solid #e8fffa;
  border-radius: 999px;
  padding: 0.7rem 1.35rem;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
}
.left-cta {
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
}
.left-cta {
  transition:
    transform 160ms ease,
    box-shadow 200ms ease,
    background 200ms ease,
    color 200ms ease;
}
.left-cta:hover {
  transform: translateY(-1px);
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.35),
    0 0 0 3px rgba(232, 255, 250, 0.15) inset;
  background: rgba(232, 255, 250, 0.1);
}
.panel-right {
  padding: 1.4rem 1.3rem;
  display: grid;
  grid-auto-rows: min-content;
  row-gap: 0.9rem;
  align-content: center;
  justify-items: center;
  background: transparent;
  transition: background 280ms ease;
  text-align: center;
}

/* Swap brand color side when switching states */
/* Swap brand color side when switching states */
.split-card.is-register .panel-left {
  background: linear-gradient(135deg, #1fb4a3 0%, #17a19a 45%, #10938d 90%);
}
.split-card.is-register .panel-right {
  background: transparent;
}
.right-title {
  font-size: 2rem;
  font-weight: 700;
  color: #19d3c5;
  text-shadow: 0 0 10px rgba(25, 211, 197, 0.22);
  letter-spacing: 0.2px;
  margin: 0 0 0.8rem 0;
}
/* Ensure strong contrast for the Sign In title on the turquoise panel */
.panel-left .right-title {
  color: #e8fffa;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
}
.right-helper {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0.25rem 0 0.6rem 0;
}
.panel-right .form .input-row {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 0, 0, 0.06);
}
.panel-right .form .input-row input {
  color: #2a2f35;
}
.panel-right .submit-btn {
  background: linear-gradient(135deg, #1fb4a3 0%, #17a19a 45%);
  color: #0b0f14;
  border: none;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
}
.panel-right .submit-btn:hover {
  filter: brightness(1.05);
}
.form {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-top: 0.6rem;
  align-self: center;
}
.input-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(8, 12, 16, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 0.75rem 0.8rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
  transition:
    border-color 140ms ease,
    box-shadow 180ms ease,
    background 180ms ease;
}
.input-row:hover {
  border-color: rgba(25, 211, 197, 0.35);
}
.input-row input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
}
.input-row:focus-within {
  box-shadow:
    0 0 0 2px rgba(25, 211, 197, 0.32),
    0 10px 24px rgba(0, 0, 0, 0.35);
  border-color: rgba(25, 211, 197, 0.55);
}
.reveal-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0 0.2rem 0 0.4rem;
  transition:
    transform 120ms ease,
    color 160ms ease;
}
.reveal-btn:hover {
  color: #19d3c5;
  transform: translateY(-1px);
}
.submit-btn {
  width: 100%;
  padding: 0.85rem;
  background: #0e0e10;
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.8rem;
  transition:
    transform 140ms ease,
    box-shadow 200ms ease,
    background 200ms ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
.submit-btn:hover {
  background: linear-gradient(90deg, rgba(25, 211, 197, 0.18), rgba(155, 92, 255, 0.18));
  transform: translateY(-1px);
  box-shadow:
    0 16px 28px rgba(0, 0, 0, 0.45),
    0 0 0 3px rgba(25, 211, 197, 0.18) inset;
}
.ghost {
  background: transparent;
  border: none;
  color: var(--neon-cyan);
  cursor: pointer;
  margin-top: 0.7rem;
  justify-self: center;
  font-size: 0.95rem;
}
.switch-overlay {
  display: none;
}
.is-register .switch-overlay {
  display: none;
}
@media (max-width: 900px) {
  .auth-container {
    width: 98vw;
  }
  .split-card {
    display: block;
  }
}

/* Transition: fade & slide */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 260ms ease,
    transform 260ms ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.error-message {
  color: #ff3fb4;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
  background: rgba(255, 63, 180, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 63, 180, 0.3);
}
</style>
