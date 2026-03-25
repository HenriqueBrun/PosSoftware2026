import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedApp: any

async function bootstrapServer() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api/v1')

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })

  if (process.env.VERCEL) {
    await app.init()
    cachedApp = app.getHttpAdapter().getInstance()
    return cachedApp
  }

  const port = Number.parseInt(process.env.PORT ?? '3001', 10)
  await app.listen(port, '0.0.0.0')
  console.log(`[pills-backend] Running on port ${port}`)
}

if (!process.env.VERCEL) {
  bootstrapServer()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (req: any, res: any) => {
  if (!cachedApp) {
    await bootstrapServer()
  }
  return cachedApp(req, res)
}
