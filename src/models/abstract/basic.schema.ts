import { Exclude, Expose, Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { ApiHideProperty } from '@nestjs/swagger'
import { Prop } from '@nestjs/mongoose'
import { SchemaTypes, Types } from 'mongoose'

export abstract class BaseSchema {
  /** @deprecated Use id */
  @ApiHideProperty()
  @Exclude()
  @IsOptional()
  _id!: Types.ObjectId

  @Expose()
  @IsOptional()
  id!: string

  @ApiHideProperty()
  @Exclude()
  @IsOptional()
  __v?: any
}

export abstract class BasicSchema extends BaseSchema {
  @Expose()
  @IsOptional()
  @Type(() => Date)
  @Prop({ type: SchemaTypes.Date, default: Date.now })
  createdAt!: Date

  @Expose()
  @IsOptional()
  @Type(() => Date)
  @Prop({ type: SchemaTypes.Date, default: Date.now })
  updatedAt!: Date
}
