import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { randomUUID } from 'crypto';
import { runWithTraceId } from './common/trace-context';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    const traceId = req.header('x-trace-id') || randomUUID();
    req.headers['x-trace-id'] = traceId;
    res.setHeader('x-trace-id', traceId);
    console.log(
      JSON.stringify({
        level: 'info',
        service: 'revenue-service',
        traceId,
        method: req.method,
        path: req.originalUrl,
      }),
    );
    runWithTraceId(traceId, next);
  });
  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
