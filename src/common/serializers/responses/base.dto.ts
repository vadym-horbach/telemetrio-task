import { ApiProperty } from '@nestjs/swagger'
import {
  IsIn,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator'
import { Type } from 'class-transformer'

export abstract class BaseDto {}

export class StatusDto extends BaseDto {
  @ApiProperty({ example: 'ok' })
  status!: string
}

export class IDDto extends BaseDto {
  @ApiProperty({ example: '63c99b0acd8b079de6675355' })
  @IsMongoId()
  @IsNotEmpty()
  id!: string
}

export class BasePaginatedFiltersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  skip?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(100)
  @Type(() => Number)
  limit: number = 100

  @ApiProperty({ required: false })
  @IsOptional()
  @IsIn(['id', 'createdAt', 'updatedAt'])
  @IsString()
  orderBy: string = 'id'

  @ApiProperty({ required: false })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  @IsString()
  order: string = 'desc'
}

export abstract class BasePaginatedDto extends BaseDto {
  @ApiProperty({ example: 1000 })
  total!: number

  @ApiProperty({ example: 10 })
  count!: number

  abstract data: any[]
}
