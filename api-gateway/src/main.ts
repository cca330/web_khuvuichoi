import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // cho phép frontend gọi vào

  const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';

  // Mọi request có path bắt đầu bằng /api/auth hoặc /api/users
  // sẽ được chuyển tiếp nguyên xi sang user-service
  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: userServiceUrl,
      changeOrigin: true,
      pathRewrite: { '^/api/auth': '/auth' }, // bỏ tiền tố /api khi gửi sang service thật
    }),
  );

  app.use(
    '/api/users',
    createProxyMiddleware({
      target: userServiceUrl,
      changeOrigin: true,
      pathRewrite: { '^/api/users': '/users' },
    }),
  );

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`API Gateway đang chạy ở port ${port}`);
}
bootstrap();