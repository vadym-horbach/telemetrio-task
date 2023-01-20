import { NestFactory } from '@nestjs/core'
import { ValidationPipe, VERSION_NEUTRAL, VersioningType } from '@nestjs/common'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import helmet from '@fastify/helmet'
import { AppModule } from './app.module'
import { setupSwagger } from './setup-swagger'
import { AppConfigService, AppLoggerService, ClusterService } from './core'
import { exceptionFactory } from './common/serializers/exceptions'
import { AppInterceptor } from './common/interceptors'
import { AppClassSerializerInterceptor } from './common/serializers/responses'

async function bootstrap(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true, ignoreTrailingSlash: true }),
    { bufferLogs: true },
  )
  const config = app.get(AppConfigService)
  void app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  })

  app.enableCors({
    origin: config.corsOrigins,
    methods: ['HEAD', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    maxAge: 86400, // 24 hours
    credentials: false,
  })

  app.useLogger(await app.resolve(AppLoggerService))

  app
    .enableVersioning({ type: VersioningType.URI, defaultVersion: VERSION_NEUTRAL })
    .useGlobalInterceptors(app.get(AppInterceptor), app.get(AppClassSerializerInterceptor))
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidUnknownValues: true,
        validationError: { target: true, value: true },
        stopAtFirstError: true,
        exceptionFactory,
        enableDebugMessages: config.isDevelopment,
      }),
    )
  if (!config.isProduction) setupSwagger(app)

  await app.listen(config.port, '0.0.0.0')

  return app
}

void ClusterService.getInstance().register(bootstrap)
