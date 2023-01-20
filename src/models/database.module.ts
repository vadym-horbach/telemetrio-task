import { Global, Module, OnModuleInit } from '@nestjs/common'
import util from 'util'
import { InjectConnection, MongooseModule } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { TrackingConfigRepository } from './tracking-config/tracking-config.repository'
import { TrackingConfig, TrackingConfigSchema } from './tracking-config/tracking-config.schema'
import { AppConfigService, AppLoggerService } from '../core'

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [AppConfigService, AppLoggerService],
      useFactory: (configService: AppConfigService, logger: AppLoggerService) => ({
        uri: configService.database.uri,
        autoIndex: false,
        connectionFactory: (connection: mongoose.Connection): any => {
          if (configService.isDevelopment) {
            mongoose.set(
              'debug',
              (collection: string, method: string, ...args: Record<string, any>[]) => {
                const replacedArgs = args
                  .map((arg) =>
                    util
                      .inspect(arg, false, 10, true)
                      .replace(/\n/g, '')
                      .replace(/\s{2,}/g, ' '),
                  )
                  .join(', ')
                if (method !== 'createIndex') {
                  logger.debug(
                    `\u001b[35m${collection}\u001b[0m.\u001b[36m${method}\u001b[34m(${replacedArgs})`,
                    'Mongoose',
                  )
                }
              },
            )
          }

          return connection
        },
      }),
    }),
    MongooseModule.forFeature([{ name: TrackingConfig.name, schema: TrackingConfigSchema }]),
  ],
  providers: [TrackingConfigRepository],
  exports: [TrackingConfigRepository],
})
export class DatabaseModule implements OnModuleInit {
  constructor(@InjectConnection() private connection: mongoose.Connection) {}

  async onModuleInit() {
    await this.connection.syncIndexes()
  }
}
