import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { TrackingConfig, T_TrackingConfigDocument } from './tracking-config.schema'
import { BaseRepository } from '../abstract/base.repository'

@Injectable()
export class TrackingConfigRepository extends BaseRepository<
  TrackingConfig,
  T_TrackingConfigDocument
> {
  constructor(
    @InjectModel(TrackingConfig.name) protected readonly Model: Model<T_TrackingConfigDocument>,
  ) {
    super()
  }
}
