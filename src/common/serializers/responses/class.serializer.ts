import { ClassSerializerInterceptor, PlainLiteralObject } from '@nestjs/common'
import { ClassTransformOptions } from 'class-transformer'
import _ from 'lodash'
import { Document } from 'mongoose'
import { BaseDto } from './base.dto'
import { BaseSchema } from '../../../models/abstract/basic.schema'

export class AppClassSerializerInterceptor extends ClassSerializerInterceptor {
  private static prepareResponse(
    response: PlainLiteralObject | PlainLiteralObject[] | any,
  ): PlainLiteralObject | PlainLiteralObject[] | any {
    if (response instanceof Document) {
      return response.toJSON()
    }

    if (response instanceof BaseSchema || response instanceof BaseDto) {
      return response
    }

    if (response instanceof Date) {
      return response.toISOString()
    }

    if (_.isArray(response)) {
      return response.map(AppClassSerializerInterceptor.prepareResponse)
    }

    if (_.isObjectLike(response)) {
      return _.mapValues(response, AppClassSerializerInterceptor.prepareResponse)
    }

    return response
  }

  serialize(
    response: PlainLiteralObject | PlainLiteralObject[],
    options: ClassTransformOptions,
  ): PlainLiteralObject | PlainLiteralObject[] {
    return super.serialize(AppClassSerializerInterceptor.prepareResponse(response), options)
  }
}
