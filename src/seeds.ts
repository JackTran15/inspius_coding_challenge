import { NestFactory } from '@nestjs/core';
import { SeedModule } from './modules/seeder-module/seed.module';
import { SeedService } from './modules/seeder-module/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(SeedModule);
  const seederService = await app.get(SeedService);
  await seederService.seed();
  app.close();
}
bootstrap();
