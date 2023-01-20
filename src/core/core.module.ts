import { Global, Module } from '@nestjs/common'
import { AppInterceptor } from '../common/interceptors'
import { AppClassSerializerInterceptor } from '../common/serializers/responses'
import { AsyncStorageModule } from './async-storage/async-storage.module'
import { AppConfigModule } from './config/config.module'
import { LoggerModule } from './logger/logger.module'

@Global()
@Module({
  imports: [LoggerModule, AsyncStorageModule, AppConfigModule],
  providers: [AppInterceptor, AppClassSerializerInterceptor],
  exports: [LoggerModule, AsyncStorageModule, AppConfigModule, AppClassSerializerInterceptor],
})
export class CoreModule {}
