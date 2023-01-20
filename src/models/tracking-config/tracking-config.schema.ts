import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { BasicSchema } from '../abstract/basic.schema'
import { TrackingConfigStateEnum } from './constants'
import { WhereFind, WhereFindSchema } from './nested/where-find.schema'

type T_TrackingConfigDocument = HydratedDocument<TrackingConfig>

@Exclude()
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform: (doc, res) => plainToInstance(TrackingConfig, res),
  },
})
class TrackingConfig extends BasicSchema {
  @Expose()
  @Prop({ required: true, maxLength: 50 })
  keyword!: string

  @Expose()
  @ValidateNested()
  @Type(() => WhereFind)
  @Prop({ type: WhereFindSchema })
  whereFind!: WhereFind

  @Expose()
  @Prop({ required: true, enum: TrackingConfigStateEnum, default: TrackingConfigStateEnum.ACTIVE })
  state!: TrackingConfigStateEnum
}

const TrackingConfigSchema = SchemaFactory.createForClass(TrackingConfig)
TrackingConfigSchema.index({ createdAt: 1, state: 1 })

export { TrackingConfigSchema, TrackingConfig, T_TrackingConfigDocument }
