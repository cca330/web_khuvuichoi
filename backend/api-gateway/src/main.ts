import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // cho phép frontend gọi vào

  const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';
  const ticketServiceUrl = process.env.TICKET_SERVICE_URL || 'http://localhost:3002';
  const revenueServiceUrl = process.env.REVENUE_SERVICE_URL || 'http://localhost:3003';
  const promotionServiceUrl = process.env.PROMOTION_SERVICE_URL || 'http://localhost:3004';
  const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:3005';
  const eventServiceUrl = process.env.EVENT_SERVICE_URL || 'http://localhost:3006'; 

  // Mọi request có path bắt đầu bằng /api/auth hoặc /api/users
  // sẽ được chuyển tiếp nguyên xi sang user-service
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

// Ticket service proxy
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

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`API Gateway đang chạy ở port ${port}`);
}
bootstrap();