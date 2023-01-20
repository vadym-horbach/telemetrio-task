import { Module } from '@nestjs/common'
import { ConfigController } from './config.controller'

@Module({
  imports: [],
  providers: [],
  controllers: [ConfigController],
})
export class ConfigModule {}
