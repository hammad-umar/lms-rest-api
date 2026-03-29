import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ConfigType } from './config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<ConfigType>>(
    ConfigService<ConfigType>,
  );

  const port = configService.get('app.port', { infer: true })!;
  await app.listen(port);
}

void bootstrap();
