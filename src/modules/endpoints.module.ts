import { Module } from '@nestjs/common'
import { RootModule } from './root/root.module'
import { ConfigModule } from './config/config.module'

@Module({
  imports: [RootModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class EndpointsModule {}
