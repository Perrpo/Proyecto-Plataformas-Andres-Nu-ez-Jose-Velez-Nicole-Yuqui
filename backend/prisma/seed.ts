import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)

  // Crear usuario demo
  const user = await prisma.user.upsert({
    where: { email: 'demo@comercio.com' },
    create: {
      email: 'demo@comercio.com',
      passwordHash,
      profile: {
        create: {
          name: 'Comercio Demo',
          business: 'Supermercado Central',
          phone: '+57 300 123 4567',
          address: 'Calle 123 #45-67, Medellín',
        },
      },
    },
    update: {},
    include: { profile: true },
  })

  // Crear ubicaciones
  const locationsCount = await prisma.location.count()
  if (locationsCount === 0) {
    await prisma.location.createMany({
      data: [
        {
          nombre: 'Banco de Alimento Central',
          tipo: 'ONG',
          direccion: 'Av. Principal 123, Centro',
          especialidades: ['Productos frescos', 'Carnes', 'Lácteos'] as unknown as any,
          lat: 6.2442,
          lng: -75.5812,
        },
        {
          nombre: 'Fundación Comida para Todos',
          tipo: 'ONG',
          direccion: 'Calle Solidaridad 45, Norte',
          especialidades: ['Frutas', 'Verduras'] as unknown as any,
          lat: 6.26,
          lng: -75.59,
        },
        {
          nombre: 'Centro Comunitario San José',
          tipo: 'Consumidor',
          direccion: 'Plaza Mayor 4, Sur',
          especialidades: ['Productos locales', 'Orgánicos'] as unknown as any,
          lat: 6.23,
          lng: -75.6,
        },
        {
          nombre: 'Asociación Vecinos Unidos',
          tipo: 'Consumidor',
          direccion: 'Barrio Nuevo C2, Este',
          especialidades: ['Familias', 'Estudiantes'] as unknown as any,
          lat: 6.25,
          lng: -75.57,
        },
      ],
    })
  }

  // Crear productos demo
  const productsCount = await prisma.product.count()
  if (productsCount === 0) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const in2Days = new Date()
    in2Days.setDate(in2Days.getDate() + 2)

    const in3Days = new Date()
    in3Days.setDate(in3Days.getDate() + 3)

    const in5Days = new Date()
    in5Days.setDate(in5Days.getDate() + 5)

    const in7Days = new Date()
    in7Days.setDate(in7Days.getDate() + 7)

    await prisma.product.createMany({
      data: [
        {
          userId: user.id,
          nombre: 'Pan integral',
          categoria: 'Panadería',
          unidades: 25,
          vencimiento: in2Days,
          estado: 'Disponible',
          precio: 2500,
        },
        {
          userId: user.id,
          nombre: 'Yogur natural',
          categoria: 'Lácteos',
          unidades: 12,
          vencimiento: in5Days,
          estado: 'Disponible',
          precio: 3500,
        },
        {
          userId: user.id,
          nombre: 'Manzanas',
          categoria: 'Frutas',
          unidades: 8,
          vencimiento: in3Days,
          estado: 'Disponible',
          precio: 4000,
        },
        {
          userId: user.id,
          nombre: 'Pollo fresco',
          categoria: 'Carnes',
          unidades: 5,
          vencimiento: tomorrow,
          estado: 'Disponible',
          precio: 12000,
        },
        {
          userId: user.id,
          nombre: 'Leche entera',
          categoria: 'Lácteos',
          unidades: 15,
          vencimiento: in7Days,
          estado: 'Donado',
          precio: 3000,
        },
      ],
    })
  }

  // Crear notificaciones demo
  const notificationsCount = await prisma.notification.count()
  if (notificationsCount === 0) {
    await prisma.notification.createMany({
      data: [
        {
          userId: user.id,
          type: 'expiration',
          title: 'Producto vence hoy',
          message: 'El Pollo fresco (5 unidades) vence hoy. Se recomienda acción inmediata.',
          urgent: true,
          isRead: false,
        },
        {
          userId: user.id,
          type: 'expiration',
          title: 'Vencimiento en 2 días',
          message: 'Pan integral (25 unidades) vencerá en 2 días.',
          urgent: false,
          isRead: false,
        },
        {
          userId: user.id,
          type: 'donation',
          title: 'Donación completada',
          message: 'La donación de Leche entera a Banco de Alimentos Central fue confirmada.',
          urgent: false,
          isRead: true,
        },
        {
          userId: user.id,
          type: 'partner',
          title: 'Nueva ONG registrada',
          message: 'Fundación Esperanza se ha registrado en tu área y acepta productos lácteos.',
          urgent: false,
          isRead: true,
        },
        {
          userId: user.id,
          type: 'inventory',
          title: 'Inventario bajo',
          message: 'Quedan pocas unidades de productos en categoría Frutas.',
          urgent: false,
          isRead: true,
        },
      ],
    })
  }

  console.log('Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
