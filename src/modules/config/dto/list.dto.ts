import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { BasePaginatedFiltersDto } from '../../../common/serializers/responses'
import { TrackingConfigStateEnum } from '../../../models/tracking-config/constants'

export class ListFiltersDto extends BasePaginatedFiltersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsIn(['createdAt'])
  @IsString()
  orderBy: string = 'createdAt'

  @IsEnum(TrackingConfigStateEnum)
  @IsOptional()
  state?: TrackingConfigStateEnum
}
