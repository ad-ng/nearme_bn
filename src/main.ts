import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard, RolesGuard } from './auth/guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);

  const config = new DocumentBuilder()
    .setTitle('Everything Near Me')
    .setDescription(
      'Near Me is a location-based backend API that helps travelers and locals discover nearby services, attractions, and businesses. It offers features like location search, service filtering, user reviews, and real-time suggestions—similar to Google Maps or TripAdvisor. Built for speed, accuracy, and scalability.',
    )
    .setVersion('1.0')
    .setContact(
      'NGOGA Adolphe',
      'https://github.com/ad-ng',
      'adolphengoga@gmail.com',
    )
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, documentFactory);

  app.use(helmet());
  app.enableCors({ origin: '*' });
  app.useGlobalGuards(
    new AuthGuard(jwtService, reflector),
    new RolesGuard(reflector),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
