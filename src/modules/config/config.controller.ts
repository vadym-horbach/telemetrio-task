import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { QueryOptions } from 'mongoose'
import { CreateDto } from './dto/create.dto'
import { TrackingConfigRepository } from '../../models/tracking-config/tracking-config.repository'
import { TrackingConfig } from '../../models/tracking-config/tracking-config.schema'
import { UpdateDto } from './dto/update.dto'
import { IDDto } from '../../common/serializers/responses'
import { ListFiltersDto } from './dto/list.dto'

@ApiTags('Config')
@Controller('config')
export class ConfigController {
  constructor(private readonly trackingConfigRepository: TrackingConfigRepository) {}

  @ApiOperation({ summary: 'Create tracking configuration' })
  @Post()
  async create(@Body() body: CreateDto): Promise<TrackingConfig> {
    return this.trackingConfigRepository.create(body)
  }

  @ApiOperation({ summary: 'Get a list of tracking configurations' })
  @Get()
  async list(@Query() query: ListFiltersDto): Promise<TrackingConfig[]> {
    const options: QueryOptions = {
      limit: query.limit,
      sort: { [query.orderBy]: query.order },
    }

    if (query.skip) {
      options.skip = query.skip
    }

    return this.trackingConfigRepository.findMany(query.state && { state: query.state }, options)
  }

  @ApiOperation({ summary: 'Update tracking configuration' })
  @Patch(':id')
  async update(@Param() { id }: IDDto, @Body() body: UpdateDto) {
    const updated = await this.trackingConfigRepository.updateById(id, body)

    if (!updated) {
      throw new NotFoundException('Tracking configuration not found.')
    }

    return updated
  }

  @ApiOperation({ summary: 'Delete tracking configuration' })
  @Delete(':id')
  async delete(@Param() { id }: IDDto): Promise<TrackingConfig> {
    const removed = await this.trackingConfigRepository.deleteById(id)

    if (!removed) {
      throw new NotFoundException('Tracking configuration not found.')
    }

    return removed
  }
}
