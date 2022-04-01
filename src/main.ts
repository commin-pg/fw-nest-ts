import { NestFactory } from '@nestjs/core';
import { setupSwagger } from 'src/configs/swagger';
import { AppModule } from './app.module';

import * as config from 'config'
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const serverConfig = config.get('server');
  app.enableCors();
  setupSwagger(app);
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalInterceptors(new LoggingInterceptor())
  
  await app.listen(serverConfig.port);
}
bootstrap();
