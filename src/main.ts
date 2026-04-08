import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Rodnik')
    .setDescription('The Rodnik API description')
    .setVersion('1.0')
    .addTag('tutors')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableCors({ origin: '*', credentials: true });

  SwaggerModule.setup('api', app, documentFactory);

  app.register(fastifyCookie);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
