import { Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { SharedModule } from './shared/shared.module'
import { EndpointsModule } from './modules/endpoints.module'
import { DatabaseModule } from './models/database.module'

@Module({
  imports: [CoreModule, DatabaseModule, SharedModule, EndpointsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
