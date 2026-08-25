import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { randomUUID } from 'crypto';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const requiredServiceUrl = (name: string) => {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is required`);
    return value;
  };

  app.use((req, res, next) => {
    const traceId = req.header('x-trace-id') || randomUUID();
    req.headers['x-trace-id'] = traceId;
    res.setHeader('x-trace-id', traceId);
    console.log(
      JSON.stringify({
        level: 'info',
        service: 'api-gateway',
        event: 'request',
        traceId,
        method: req.method,
        path: req.originalUrl,
      }),
    );
    next();
  });

  // CORS - Only allow specific origins
  app.enableCors({
    origin: [
      'http://localhost',
      'http://localhost:80',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-trace-id'],
  });

  // Serve ảnh đã upload — truy cập qua http://localhost:8000/uploads/<tên file>
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  const userServiceUrl = requiredServiceUrl('USER_SERVICE_URL');
  const ticketServiceUrl = requiredServiceUrl('TICKET_SERVICE_URL');
  const revenueServiceUrl = requiredServiceUrl('REVENUE_SERVICE_URL');
  const promotionServiceUrl = requiredServiceUrl('PROMOTION_SERVICE_URL');
  const gameServiceUrl = requiredServiceUrl('GAME_SERVICE_URL');
  const eventServiceUrl = requiredServiceUrl('EVENT_SERVICE_URL');

  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: userServiceUrl,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req) =>
          proxyReq.setHeader(
            'x-trace-id',
            req.headers['x-trace-id'] || randomUUID(),
          ),
      },
      pathRewrite: { '^/': '/auth/' },
    }),
  );

  app.use(
    '/api/users',
    createProxyMiddleware({
      target: userServiceUrl,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req) =>
          proxyReq.setHeader(
            'x-trace-id',
            req.headers['x-trace-id'] || randomUUID(),
          ),
      },
      pathRewrite: { '^/': '/users/' },
    }),
  );

  app.use(
    '/api/tickets',
    createProxyMiddleware({
      target: ticketServiceUrl,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req) =>
          proxyReq.setHeader(
            'x-trace-id',
            req.headers['x-trace-id'] || randomUUID(),
          ),
      },
      pathRewrite: { '^/': '/tickets/' },
    }),
  );

  app.use(
    '/api/revenue',
    createProxyMiddleware({
      target: revenueServiceUrl,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req) =>
          proxyReq.setHeader(
            'x-trace-id',
            req.headers['x-trace-id'] || randomUUID(),
          ),
      },
      pathRewrite: { '^/': '/revenue/' },
    }),
  );

  app.use(
    '/api/promotions',
    createProxyMiddleware({
      target: promotionServiceUrl,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req) =>
          proxyReq.setHeader(
            'x-trace-id',
            req.headers['x-trace-id'] || randomUUID(),
          ),
      },
      pathRewrite: { '^/': '/promotions/' },
    }),
  );

  app.use(
    '/api/games',
    createProxyMiddleware({
      target: gameServiceUrl,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req) =>
          proxyReq.setHeader(
            'x-trace-id',
            req.headers['x-trace-id'] || randomUUID(),
          ),
      },
      pathRewrite: { '^/': '/games/' },
    }),
  );

  app.use(
    '/api/events',
    createProxyMiddleware({
      target: eventServiceUrl,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req) =>
          proxyReq.setHeader(
            'x-trace-id',
            req.headers['x-trace-id'] || randomUUID(),
          ),
      },
      pathRewrite: { '^/': '/events/' },
    }),
  );

  // Route upload ảnh — KHÔNG proxy, xử lý ngay tại gateway
  // Không cần khai báo app.use('/api/upload', ...) vì UploadController
  // đã tự đăng ký route '/upload' thông qua @Controller('upload')

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`API Gateway đang chạy ở port ${port}`);
}
bootstrap();
