import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { setupSwagger } from './configs/swagger';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

const serverConfig = config.get('server');

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))

  app.useGlobalFilters(new HttpExceptionFilter())

  setupSwagger(app);

  await app.listen(serverConfig.port);
  logger.log(`Application running on port ${serverConfig.port}`);
}
bootstrap();
