import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as swaggerStats from 'swagger-stats';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  // Disable protection for development environment (for graphql playground)
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.use(compression());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Tuiter')
    .setDescription('API for Tuiter app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.use(
    swaggerStats.getMiddleware({
      swaggerSpec: document,
      uriPath: '/api-monitoring',
    }),
  );
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`);
}

bootstrap();
