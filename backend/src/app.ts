import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Extender el tipo Request para incluir user
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number
    email: string
  }
}

// Middleware de autenticación
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' })
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Token inválido' })
    req.user = user
    next()
  })
}

// Healthcheck
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// Demo: listado de ubicaciones (mock)
app.get('/api/locations', async (_req: Request, res: Response) => {
  const locations = await prisma.location.findMany({ orderBy: { id: 'asc' } })
  res.json({ locations })
})

app.post('/api/locations', async (req: Request, res: Response) => {
  const { nombre, tipo, direccion, especialidades } = req.body as {
    nombre: string
    tipo: string
    direccion: string
    especialidades?: string[]
  }
  if (!nombre || !tipo || !direccion) {
    return res.status(400).json({ message: 'nombre, tipo y direccion son requeridos' })
  }
  const created = await prisma.location.create({
    data: {
      nombre,
      tipo,
      direccion,
      especialidades: especialidades ?? [],
    },
  })
  res.status(201).json(created)
})

app.delete('/api/locations/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) return res.status(400).json({ message: 'id inválido' })
  await prisma.location.delete({ where: { id } })
  res.status(204).send()
})

// Autenticación
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string }
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son requeridos' })
  }
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  })
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' })

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET)
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      profile: user.profile,
    },
  })
})

app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { email, password, name, business } = req.body as {
    email?: string
    password?: string
    name?: string
    business?: string
  }
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password y nombre son requeridos' })
  }
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return res.status(409).json({ message: 'Usuario ya existe' })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      profile: {
        create: {
          name,
          business: business || null,
        },
      },
    },
    include: { profile: true },
  })

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET)
  return res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      profile: user.profile,
    },
  })
})

// Productos
app.get('/api/products', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const products = await prisma.product.findMany({
    where: { userId: req.user!.userId },
    orderBy: { vencimiento: 'asc' },
  })
  res.json({ products })
})

app.post('/api/products', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { nombre, categoria, unidades, vencimiento, precio } = req.body
  if (!nombre || !categoria || !unidades || !vencimiento) {
    return res
      .status(400)
      .json({ message: 'Campos requeridos: nombre, categoria, unidades, vencimiento' })
  }

  const product = await prisma.product.create({
    data: {
      nombre,
      categoria,
      unidades: parseInt(unidades),
      vencimiento: new Date(vencimiento),
      precio: precio ? parseFloat(precio) : null,
      userId: req.user!.userId,
    },
  })

  // Crear notificación si vence pronto
  const daysUntilExpiry = Math.ceil(
    (new Date(vencimiento).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  )
  if (daysUntilExpiry <= 3) {
    await prisma.notification.create({
      data: {
        userId: req.user!.userId,
        type: 'expiration',
        title: 'Producto vence pronto',
        message: `${nombre} vence en ${daysUntilExpiry} días`,
        urgent: daysUntilExpiry <= 1,
        productId: product.id,
      },
    })
  }

  res.status(201).json(product)
})

app.put(
  '/api/products/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params
    const { estado, descuento } = req.body

    const product = await prisma.product.update({
      where: {
        id: parseInt(id),
        userId: req.user!.userId,
      },
      data: {
        estado: estado || undefined,
        descuento: descuento ? parseFloat(descuento) : undefined,
      },
    })

    // Crear notificación de donación
    if (estado === 'Donado') {
      await prisma.notification.create({
        data: {
          userId: req.user!.userId,
          type: 'donation',
          title: 'Producto donado',
          message: `${product.nombre} fue donado exitosamente`,
          productId: product.id,
        },
      })
    }

    res.json(product)
  },
)

app.delete(
  '/api/products/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params
    await prisma.product.delete({
      where: {
        id: parseInt(id),
        userId: req.user!.userId,
      },
    })
    res.status(204).send()
  },
)

// Notificaciones
app.get(
  '/api/notifications',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ notifications })
  },
)

app.put(
  '/api/notifications/:id/read',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params
    await prisma.notification.update({
      where: {
        id: parseInt(id),
        userId: req.user!.userId,
      },
      data: { isRead: true },
    })
    res.json({ success: true })
  },
)

app.put(
  '/api/notifications/read-all',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId },
      data: { isRead: true },
    })
    res.json({ success: true })
  },
)

// Estadísticas del dashboard
app.get(
  '/api/dashboard/stats',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId

    const [totalProducts, expiringSoon, donated, withDiscount] = await Promise.all([
      prisma.product.count({ where: { userId } }),
      prisma.product.count({
        where: {
          userId,
          vencimiento: { lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.product.count({ where: { userId, estado: 'Donado' } }),
      prisma.product.count({ where: { userId, descuento: { gt: 0 } } }),
    ])

    res.json({
      totalProducts,
      expiringSoon,
      donated,
      withDiscount,
    })
  },
)

// Raíz
app.get('/', (_req: Request, res: Response) => {
  res.send('API funcionando')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`)
})
