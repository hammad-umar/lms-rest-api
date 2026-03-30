import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigType } from './config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<ConfigType>>(
    ConfigService<ConfigType>,
  );

  const config = new DocumentBuilder()
    .setTitle('Learning Management System API')
    .setDescription('Rest API Docs')
    .setVersion('1.0')
    .build();

  const rawDocument = SwaggerModule.createDocument(app, config);
  const document = cleanupOpenApiDoc(rawDocument);

  SwaggerModule.setup('docs', app, document);

  const port = configService.get('app.port', { infer: true })!;
  await app.listen(port);
}

void bootstrap();
