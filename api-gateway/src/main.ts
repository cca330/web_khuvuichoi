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
    pathRewrite: { '^/': '/auth/' }, // thêm lại "/auth/" vào trước phần path còn sót lại
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

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`API Gateway đang chạy ở port ${port}`);
}
bootstrap();