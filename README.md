## 🧩 Integración Low-Code (Frontend y Backend)

### Frontend: Formularios Low-Code con FormKit

Se implementó un formulario de autenticación low-code en el componente `AuthForm.vue` usando la librería [FormKit](https://formkit.com/). Ahora los formularios de login y registro se generan de manera declarativa, permitiendo modificar los campos fácilmente desde el template, sin lógica manual para cada input.

- **Ventajas:**
  - Menos código repetitivo para formularios.
  - Validaciones y estilos centralizados.
  - Fácil de extender o modificar campos.
- **Ubicación:** `apps/web/src/components/AuthForm.vue`
- **Cómo funciona:**
  - Cada campo del formulario se define como un componente `<FormKit />` con sus props (tipo, validación, placeholder, etc).
  - El formulario completo se maneja con un objeto reactivo (`loginForm` o `registerForm`).
  - Al enviar, los datos se pasan automáticamente a la función de autenticación.

### Backend: Motor de Reglas Low-Code con json-rules-engine

Se integró la librería [json-rules-engine](https://github.com/CacheControl/json-rules-engine) en el backend para permitir lógica de negocio configurable mediante reglas JSON. Esto habilita que ciertas validaciones, alertas o flujos puedan ser definidos sin modificar el código fuente, solo cambiando las reglas.

- **Ventajas:**
  - Permite lógica condicional dinámica y personalizable.
  - Facilita la adaptación de reglas de negocio sin redeploy.
  - Útil para validaciones, promociones, alertas, etc.
- **Ubicación:** `backend/src/controllers/productsController.ts` (ejemplo de integración en endpoint existente)
- **Cómo funciona:**
  - Se define un conjunto de reglas en formato JSON.
  - El endpoint procesa los datos recibidos y ejecuta las reglas usando `json-rules-engine`.
  - El resultado de las reglas puede modificar la respuesta, lanzar alertas, o condicionar el flujo.

#### Ejemplo de uso en backend

```ts
import { Engine } from 'json-rules-engine'

const rules = [
  {
    conditions: {
      all: [{ fact: 'stock', operator: 'lessThan', value: 10 }],
    },
    event: { type: 'lowStock', params: { message: 'Stock bajo' } },
  },
]

const engine = new Engine(rules)
const facts = { stock: 5 }
engine.run(facts).then(({ events }) => {
  // Si stock < 10, se dispara el evento 'lowStock'
})
```

---

# 🍱 EcoSave Market - Plataforma Anti-Desperdicio de Alimentos

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.18-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19.2-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.18.0-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)

> **Plataforma digital para reducir el desperdicio de alimentos conectando empresas, ONGs y consumidores en Colombia.**

## 📋 Tabla de Contenidos

- [🎯 Descripción del Proyecto](#-descripción-del-proyecto)
- [✨ Características](#-características)
- [🏗️ Arquitectura](#️-arquitectura)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [💻 Uso](#-uso)
- [🛠️ Tecnologías](#️-tecnologías)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔧 Scripts Disponibles](#-scripts-disponibles)
- [🌐 Variables de Entorno](#-variables-de-entorno)
- [📊 Base de Datos](#-base-de-datos)
- [🤝 Contribuir](#-contribuir)
- [📄 Licencia](#-licencia)

## 🎯 Descripción del Proyecto

**EcoSave Market** es una plataforma web innovadora diseñada para combatir el desperdicio de alimentos en Colombia. La aplicación conecta a supermercados, restaurantes y consumidores con ONGs y bancos de alimentos, facilitando la donación y redistribución de productos próximos a vencer.

### 🎯 Objetivos

- **Reducir el desperdicio alimentario** en Colombia
- **Conectar la cadena de suministro** con organizaciones benéficas
- **Optimizar la gestión de inventarios** con alertas inteligentes
- **Crear impacto social** ayudando a poblaciones vulnerables
- **Mejorar la sostenibilidad** ambiental y económica

## ✨ Características

### 🔐 **Autenticación Segura**

- Registro e inicio de sesión con JWT
- Perfiles de usuario (ONGs, Consumidores, Empresas)
- Validación de datos y seguridad robusta

### 📊 **Dashboard Inteligente**

- Vista general de productos próximos a vencer
- Estadísticas en tiempo real
- Alertas de vencimiento automáticas
- Gestión de inventario simplificada

### 🗺️ **Mapa Interactivo**

- Visualización de puntos de recolección
- Diferenciación entre ONGs y consumidores
- Información detallada de ubicaciones
- Integración con servicios de geolocalización

### 🔔 **Sistema de Notificaciones**

- Alertas de productos próximos a vencer
- Notificaciones de donaciones exitosas
- Panel de gestión de notificaciones
- Contador de notificaciones no leídas

### 📱 **Interfaz Responsiva**

- Diseño moderno y atractivo
- Compatible con dispositivos móviles
- Tema oscuro optimizado
- Experiencia de usuario fluida

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de       │
│   (Vue.js 3)    │◄──►│   (Express.js)  │◄──►│   Datos         │
│                 │    │                 │    │   (MySQL)       │
│ • Dashboard     │    │ • API REST      │    │                 │
│ • Mapa          │    │ • Autenticación │    │ • Usuarios      │
│ • Notificaciones│    │ • Prisma ORM    │    │ • Productos     │
│ • Auth          │    │ • JWT Security  │    │ • Ubicaciones   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos

- **Node.js** 20+ (recomendado 22+)
- **npm** 9+
- **MySQL** 8.0+
- **Git**

### 🔧 Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/Perrpo/Proyecto-Plataformas.git
   cd Proyecto-Plataformas
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar la base de datos**

   ```bash
   # Crear base de datos MySQL
   mysql -u root -p
   CREATE DATABASE trabajo1;
   CREATE USER 'demo'@'localhost' IDENTIFIED BY 'admin123';
   GRANT ALL PRIVILEGES ON trabajo1.* TO 'demo'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Configurar variables de entorno**

   ```bash
   # Crear archivo .env en backend/
   cp backend/.env.example backend/.env
   ```

5. **Configurar Prisma**

   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```

6. **Iniciar la aplicación**

   ```bash
   # Desarrollo (frontend + backend)
   npm run dev

   # O por separado:
   npm -w @repo/web run dev      # Frontend (puerto 5173)
   npm -w @repo/backend run dev  # Backend (puerto 3000)
   ```

## 💻 Uso

### 🌐 Acceso a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555

### 👤 Cuentas de Prueba

```
Email: demo@ecosave.com
Password: admin123
```

### 📱 Funcionalidades Principales

1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Dashboard**: Visualiza productos próximos a vencer
3. **Mapa**: Explora ubicaciones de ONGs y consumidores
4. **Notificaciones**: Gestiona alertas y notificaciones
5. **Gestión de Productos**: Agrega y administra inventario

## 🛠️ Tecnologías

### Frontend

- **Vue.js 3** - Framework progresivo
- **TypeScript** - Tipado estático
- **Pinia** - Gestión de estado
- **Vue Router** - Enrutamiento
- **Vite** - Herramienta de construcción

### Backend

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **Prisma** - ORM moderno
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

### Base de Datos

- **MySQL 8.0** - Base de datos relacional
- **Prisma Client** - Cliente de base de datos

### Herramientas de Desarrollo

- **ESLint** - Linter de código
- **Prettier** - Formateador de código
- **Concurrently** - Ejecución paralela
- **Nodemon** - Recarga automática

## 📁 Estructura del Proyecto

```
Proyecto-Plataformas/
├── apps/
│   └── web/                    # Frontend Vue.js
│       ├── src/
│       │   ├── components/     # Componentes Vue
│       │   ├── views/          # Vistas de la aplicación
│       │   ├── stores/         # Estado global (Pinia)
│       │   └── router/         # Configuración de rutas
│       ├── package.json
│       └── vite.config.ts
├── backend/                    # Backend Express.js
│   ├── src/
│   │   └── app.ts             # Servidor principal
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema de base de datos
│   │   └── seed.ts            # Datos de prueba
│   └── package.json
├── package.json               # Configuración del monorepo
└── README.md
```

## 🔧 Scripts Disponibles

### 🚀 Desarrollo

```bash
npm run dev                    # Inicia frontend + backend
npm -w @repo/web run dev      # Solo frontend
npm -w @repo/backend run dev  # Solo backend
```

### 🏗️ Construcción

```bash
npm run build                  # Construye ambos proyectos
npm -w @repo/web run build    # Solo frontend
npm -w @repo/backend run build # Solo backend
```

### 🔍 Calidad de Código

```bash
npm run lint                   # Linter para ambos proyectos
npm run type-check            # Verificación de tipos
```

### 🗄️ Base de Datos

```bash
npm -w @repo/backend run prisma:generate  # Genera cliente Prisma
npm -w @repo/backend run prisma:migrate   # Ejecuta migraciones
npm -w @repo/backend run prisma:studio    # Abre Prisma Studio
npm -w @repo/backend run seed             # Pobla la base de datos
```

## 🌐 Variables de Entorno

### Backend (.env)

```env
DATABASE_URL="mysql://demo:admin123@localhost:3306/trabajo1"
JWT_SECRET="tu-jwt-secret-super-seguro-2024"
PORT=3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps
```

## 📊 Base de Datos

### 🗃️ Esquema Principal

- **Users** - Usuarios del sistema
- **UserProfiles** - Perfiles detallados
- **Products** - Productos e inventario
- **Locations** - Ubicaciones de recolección
- **Notifications** - Sistema de alertas
- **PointHistory** - Historial de puntos (futuro)

### 🔄 Migraciones

```bash
# Crear nueva migración
npm -w @repo/backend run prisma:migrate dev --name nombre_migracion

# Aplicar migraciones
npm -w @repo/backend run prisma:migrate deploy

# Resetear base de datos
npm -w @repo/backend run prisma:migrate reset
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### 📝 Guías de Contribución

- Sigue las convenciones de código establecidas
- Añade tests para nuevas funcionalidades
- Actualiza la documentación cuando sea necesario
- Usa commits descriptivos y claros

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📞 Contacto

**GitHub**: [@Perrpo](https://github.com/Perrpo)

---

<div align="center">

**🍱 EcoSave Market - Reduciendo el desperdicio alimentario, una donación a la vez**

[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red?style=flat)](https://github.com/Perrpo/Proyecto-Plataformas)

</div>
