# 🍱 FoodSave - Setup Completo con Base de Datos

## 📋 Resumen del Proyecto

**FoodSave** es una plataforma anti-desperdicio que conecta comercios con ONGs y consumidores para donar productos próximos a vencer. El proyecto incluye:

- **Frontend**: Vue 3 + TypeScript + Vite
- **Backend**: Express + TypeScript + Prisma + MySQL
- **Base de Datos**: MySQL con esquemas completos
- **Autenticación**: JWT + bcryptjs
- **Funcionalidades**: CRUD de productos, notificaciones automáticas, mapa interactivo

## 🗄️ Estructura de la Base de Datos

### Modelos Principales

1. **User** - Usuarios del sistema
2. **UserProfile** - Perfiles de usuario (nombre, negocio, contacto)
3. **Product** - Productos con fechas de vencimiento
4. **Location** - Ubicaciones de ONGs y consumidores
5. **Notification** - Sistema de notificaciones automáticas

### Relaciones

- User 1:1 UserProfile
- User 1:N Product
- User 1:N Notification
- Product → Notification (cuando vence pronto)

## 🚀 Instalación y Configuración

### 1. Prerrequisitos

- Node.js 20+
- MySQL 8.0+
- npm 9+

### 2. Instalar Dependencias

```bash
# Instalar dependencias del monorepo
npm install

# Instalar dependencias específicas del backend
npm -w @repo/backend install
```

### 3. Configurar MySQL

#### Opción A: MySQL Workbench

1. Abrir MySQL Workbench
2. Conectar a tu servidor MySQL
3. Ejecutar estos comandos SQL:

```sql
CREATE DATABASE trabajo1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'trabajo1_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON trabajo1.* TO 'trabajo1_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Opción B: Línea de Comandos

```bash
mysql -u root -p
# Luego ejecutar los comandos SQL de arriba
```

### 4. Configurar Variables de Entorno

Crear archivo `backend/.env`:

```env
DATABASE_URL="mysql://trabajo1_user:password123@localhost:3306/trabajo1"
JWT_SECRET="tu-clave-secreta-super-segura"
```

### 5. Configurar Google Maps (Frontend)

Crear archivo `apps/web/.env`:

```env
VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps
```

### 6. Inicializar Base de Datos

```bash
# Generar cliente Prisma
npm -w @repo/backend run prisma:generate

# Crear migraciones y tablas
npm -w @repo/backend run prisma:migrate -- --name init

# Poblar con datos de ejemplo
npm -w @repo/backend run seed
```

### 7. Ejecutar el Proyecto

```bash
# Desarrollo (frontend + backend simultáneamente)
npm run dev

# Solo frontend
npm -w @repo/web run dev

# Solo backend
npm -w @repo/backend run dev
```

## 🔗 Endpoints de la API

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse

### Productos

- `GET /api/products` - Listar productos del usuario
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto (estado, descuento)
- `DELETE /api/products/:id` - Eliminar producto

### Ubicaciones

- `GET /api/locations` - Listar ubicaciones
- `POST /api/locations` - Crear ubicación
- `DELETE /api/locations/:id` - Eliminar ubicación

### Notificaciones

- `GET /api/notifications` - Listar notificaciones del usuario
- `PUT /api/notifications/:id/read` - Marcar como leída
- `PUT /api/notifications/read-all` - Marcar todas como leídas

### Dashboard

- `GET /api/dashboard/stats` - Estadísticas del dashboard

## 🎯 Funcionalidades Implementadas

### ✅ Autenticación Completa

- Registro con perfil de usuario
- Login con JWT
- Persistencia de sesión
- Logout seguro

### ✅ Gestión de Productos

- CRUD completo de productos
- Fechas de vencimiento
- Estados: Disponible, Donado, Descuento, Vendido
- Categorías y precios

### ✅ Sistema de Notificaciones

- Notificaciones automáticas por vencimiento
- Notificaciones de donación
- Notificaciones de inventario bajo
- Notificaciones de nuevos socios

### ✅ Dashboard Interactivo

- Estadísticas en tiempo real
- Lista de productos próximos a vencer
- Acciones de donación y descuento

### ✅ Mapa Interactivo

- Carga ubicaciones desde BD
- Guardar marcadores en BD
- Integración con Google Maps

### ✅ Responsive Design

- Diseño adaptativo
- Transiciones suaves
- UI moderna con gradientes

## 🔧 Comandos Útiles

```bash
# Ver base de datos en Prisma Studio
npm -w @repo/backend run prisma:studio

# Resetear base de datos
npm -w @repo/backend run prisma:migrate reset

# Compilar para producción
npm run build

# Linter
npm run lint
```

## 🐛 Solución de Problemas

### Error: "Environment variable not found: DATABASE_URL"

- Verificar que el archivo `backend/.env` existe
- Verificar que la URL de conexión es correcta

### Error: "Can't connect to MySQL"

- Verificar que MySQL está corriendo
- Verificar credenciales en `DATABASE_URL`
- Verificar que la base de datos `trabajo1` existe

### Error: "Google Maps not loading"

- Verificar que `VITE_GOOGLE_MAPS_API_KEY` está configurada
- Verificar que la API key tiene permisos para Maps JavaScript API

## 📊 Datos de Prueba

El seed incluye:

- Usuario demo: `demo@comercio.com` / `admin123`
- 4 ubicaciones de ONGs/consumidores
- 5 productos con diferentes fechas de vencimiento
- 5 notificaciones de ejemplo

## 🚀 Próximos Pasos

1. **Configurar base de datos MySQL**
2. **Crear archivos .env**
3. **Ejecutar migraciones y seed**
4. **Iniciar el proyecto con `npm run dev`**
5. **Probar con usuario demo: demo@comercio.com / admin123**

¡El proyecto está listo para usar con integración completa de base de datos! 🎉
