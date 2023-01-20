import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { StatusDto } from '../../common/serializers/responses'

@ApiTags('Root')
@Controller()
export class RootController {
  @Get()
  async health(): Promise<StatusDto> {
    return { status: 'ok' }
  }
}
