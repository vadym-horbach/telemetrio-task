import type {
  FilterQuery,
  UpdateQuery,
  Types,
  QueryOptions,
  PopulateOptions,
  UpdateWriteOpResult,
  HydratedDocument,
  Model,
} from 'mongoose'
import { Injectable } from '@nestjs/common'
import { I_DeleteResult, T_CreatePartial } from './basic.types'
import { BaseSchema } from './basic.schema'

@Injectable()
export abstract class BaseRepository<
  C extends BaseSchema,
  T extends HydratedDocument<C> = HydratedDocument<C>,
> {
  protected abstract readonly Model: Model<T>

  async distinct<R = any>(field: string, filter?: FilterQuery<T>): Promise<R[]> {
    return this.Model.distinct(field, filter).exec()
  }

  async count(filter: FilterQuery<T>, limit?: number): Promise<number> {
    const cursor = this.Model.countDocuments(filter)

    if (limit) {
      void cursor.limit(limit)
    }

    return cursor.exec()
  }

  async findMany<P>(
    filter: FilterQuery<T> = {},
    options?: QueryOptions,
    populate?: PopulateOptions | Array<PopulateOptions>,
    projection?: any | undefined,
  ): Promise<T[]> {
    const cursor = this.Model.find(filter, projection, options)

    if (populate) {
      void cursor.populate<P>(populate)
    }

    return cursor.exec()
  }

  async findById<P>(
    id: string | Types.ObjectId,
    options?: QueryOptions,
    populate?: PopulateOptions | Array<PopulateOptions>,
    projection?: any | undefined,
  ): Promise<T | null> {
    const cursor = this.Model.findById(id, projection, options)

    if (populate) {
      void cursor.populate<P>(populate)
    }

    return cursor.exec()
  }

  async findOne<P>(
    filter: FilterQuery<T>,
    options?: QueryOptions,
    populate?: PopulateOptions | Array<PopulateOptions>,
    projection?: any | undefined,
  ): Promise<T | null> {
    const cursor = this.Model.findOne(filter, projection, options)

    if (populate) {
      void cursor.populate<P>(populate)
    }

    return cursor.exec()
  }

  createModel(doc: T_CreatePartial<C>): T {
    return new this.Model(doc)
  }

  async create(doc: T_CreatePartial<C>): Promise<T> {
    const entity = this.createModel(doc)

    return entity.save()
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.Model.findByIdAndUpdate(id, update, {
      runValidators: true,
      setDefaultsOnInsert: true,
      ...options,
      new: true,
    }).exec()
  }

  async updateOne(
    query: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.Model.findOneAndUpdate(query, update, {
      runValidators: true,
      setDefaultsOnInsert: true,
      ...options,
      new: true,
    }).exec()
  }

  async updateOrCreate(
    query: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T> {
    return this.Model.findOneAndUpdate(query, update, {
      runValidators: true,
      setDefaultsOnInsert: true,
      ...options,
      upsert: true,
      new: true,
    }).exec()
  }

  async updateMany(
    query: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.Model.updateMany(query, update, options).exec()
  }

  async deleteById(id: string | Types.ObjectId, options?: QueryOptions): Promise<T | null> {
    return this.Model.findByIdAndDelete(id, options).exec()
  }

  async deleteOne(query: FilterQuery<T>, options?: QueryOptions): Promise<T | null> {
    return this.Model.findOneAndDelete(query, options).exec()
  }

  async deleteMany(query: FilterQuery<T>, options?: QueryOptions): Promise<I_DeleteResult> {
    return this.Model.deleteMany(query, options).exec()
  }
}
