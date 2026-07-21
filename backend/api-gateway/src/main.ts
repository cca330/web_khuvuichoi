import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  // Serve ảnh đã upload — truy cập qua http://localhost:8000/uploads/<tên file>
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  const userServiceUrl =
    process.env.USER_SERVICE_URL || 'http://localhost:3001';
  const ticketServiceUrl =
    process.env.TICKET_SERVICE_URL || 'http://localhost:3002';
  const revenueServiceUrl =
    process.env.REVENUE_SERVICE_URL || 'http://localhost:3003';
  const promotionServiceUrl =
    process.env.PROMOTION_SERVICE_URL || 'http://localhost:3004';
  const gameServiceUrl =
    process.env.GAME_SERVICE_URL || 'http://localhost:3005';
  const eventServiceUrl =
    process.env.EVENT_SERVICE_URL || 'http://localhost:3006';

  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: userServiceUrl,
      changeOrigin: true,
      pathRewrite: { '^/': '/auth/' },
    }),
  );

  app.use(
    '/api/users',
    createProxyMiddleware({
      target: userServiceUrl,
      changeOrigin: true,
      pathRewrite: { '^/': '/users/' },
    }),
  );

  app.use(
    '/api/tickets',
    createProxyMiddleware({
      target: ticketServiceUrl,
      changeOrigin: true,
      pathRewrite: { '^/': '/tickets/' },
    }),
  );

  app.use(
    '/api/revenue',
    createProxyMiddleware({
      target: revenueServiceUrl,
      changeOrigin: true,
      pathRewrite: { '^/': '/revenue/' },
    }),
  );

  app.use(
    '/api/promotions',
    createProxyMiddleware({
      target: promotionServiceUrl,
      changeOrigin: true,
      pathRewrite: { '^/': '/promotions/' },
    }),
  );

  app.use(
    '/api/games',
    createProxyMiddleware({
      target: gameServiceUrl,
      changeOrigin: true,
      pathRewrite: { '^/': '/games/' },
    }),
  );

  app.use(
    '/api/events',
    createProxyMiddleware({
      target: eventServiceUrl,
      changeOrigin: true,
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
