import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { updateGlobalConfig } from 'nestjs-paginate';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  })

  app.use(cookieParser());

  updateGlobalConfig({
    defaultLimit: 10,
  })

  // Swagger init config
  const config = new DocumentBuilder()
    .setTitle('Wongnok API')
    .setDescription('The Wongnok API: Food Recipe for you')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'accessToken',
    )
    .addSecurityRequirements('accessToken')
    .build();
    
  // Swagger setup
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config), {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
