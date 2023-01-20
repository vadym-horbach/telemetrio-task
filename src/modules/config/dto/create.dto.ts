import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator'
import { TrackingConfigStateEnum } from '../../../models/tracking-config/constants'

class WhereFind {
  @IsBoolean()
  @IsNotEmpty()
  chats!: boolean

  @IsBoolean()
  @IsNotEmpty()
  channels!: boolean
}

export class CreateDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  keyword!: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WhereFind)
  whereFind!: WhereFind

  @IsEnum(TrackingConfigStateEnum)
  @IsNotEmpty()
  state!: TrackingConfigStateEnum
}
