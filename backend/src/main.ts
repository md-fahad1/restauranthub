import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Without this, the browser blocks every request from your Next.js
  // frontend (localhost:3000) to this API (localhost:4000) — that's
  // exactly the "Failed to fetch" error you're seeing.
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  const port = process.env.PORT ?? 7000;
  await app.listen(port);
  console.log(`RestaurantHub API running on http://localhost:${port}/graphql`);
}
bootstrap();