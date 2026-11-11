import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CORS_OPTIONS } from './cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors(CORS_OPTIONS);

  const config = new DocumentBuilder()
    .setTitle('Mynted API')
    .setDescription('Documentación de la API del backend de Mynted')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  process.on('uncaughtException', (error) => {
    console.error('CRASH INESPERADO (uncaughtException):', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('RECHAZO NO MANEJADO (unhandledRejection):', promise, 'razón:', reason);
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

}
bootstrap();
