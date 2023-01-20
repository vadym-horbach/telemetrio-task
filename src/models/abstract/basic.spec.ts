import { Injectable } from '@nestjs/common'
import { getModelToken, InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import { Exclude, Expose, plainToInstance } from 'class-transformer'
import { Test, TestingModule } from '@nestjs/testing'
import { BaseRepository } from './base.repository'
import { BasicSchema } from './basic.schema'
import { MockMongodbManager } from '../../../test/utils'

type T_MockDocument = HydratedDocument<Mock>

@Exclude()
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform: (doc, res) => {
      return plainToInstance(Mock, res)
    },
  },
})
class Mock extends BasicSchema {
  @Expose()
  @Prop({ required: true })
  name!: string
}

const MockSchema = SchemaFactory.createForClass(Mock)

@Injectable()
export class MockRepository extends BaseRepository<Mock, T_MockDocument> {
  constructor(@InjectModel(Mock.name) protected readonly Model: Model<T_MockDocument>) {
    super()
  }
}

describe('BaseRepository', () => {
  const mongodbManager = new MockMongodbManager()
  let mockRepository: MockRepository

  beforeAll(async () => {
    await mongodbManager.start()
    const mockModel = mongodbManager.getModel(Mock.name, MockSchema)

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [{ provide: getModelToken(Mock.name), useValue: mockModel }, MockRepository],
    }).compile()
    mockRepository = moduleRef.get<MockRepository>(MockRepository)
  })

  afterAll(async () => {
    await mongodbManager.stop()
  })

  afterEach(async () => {
    await mongodbManager.cleanup()
  })

  it('should create and save correct object', async () => {
    const mock = { name: 'test' }
    const mockTimestamp = Date.now()

    const entity = await mockRepository.create(mock)

    expect(entity.id).toBeDefined()
    expect(entity).toMatchObject(mock)
    expect(entity.createdAt).toBeDefined()
    expect(entity.updatedAt).toBeDefined()
    expect(entity.createdAt.getTime()).toBeGreaterThanOrEqual(mockTimestamp)
    expect(entity.updatedAt.getTime()).toBeGreaterThanOrEqual(mockTimestamp)
  })
  it('should throw validation error', async () => {
    await expect(mockRepository.create({})).rejects.toThrow('is required')
  })
  it('should update object', async () => {
    const mock = { name: 'test' }
    const mockUpdated = { name: 'test updated' }

    const entity = await mockRepository.create(mock)
    expect(entity).toMatchObject(mock)
    expect(entity).not.toMatchObject(mockUpdated)

    const updated = await mockRepository.updateById(entity.id, mockUpdated)
    expect(updated).not.toBeNull()
    expect(updated).not.toMatchObject(mock)
    expect(updated).toMatchObject(mockUpdated)

    expect(updated?.id).toBe(entity?.id)
    expect(updated?.createdAt).toEqual(entity?.createdAt)
    expect(updated?.updatedAt.getTime()).toBeGreaterThan(entity.updatedAt.getTime())
  })
  it('should correct toJSON serialize', async () => {
    const mock = { name: 'test' }
    const entity = await mockRepository.create({ name: 'test' })
    const serialized = entity.toJSON()

    expect(serialized).toBeInstanceOf(Mock)
    expect(serialized.__v).not.toBeDefined()
    expect(serialized._id).not.toBeDefined()
    expect(serialized).toMatchObject(mock)
    expect(serialized.id).toBe(entity.id)
  })
  it('should findById correct object', async () => {
    const createdEntity = await mockRepository.create({ name: 'test' })

    const entity = await mockRepository.findById(createdEntity.id)

    expect(entity).not.toBeNull()
    expect(entity?.id).toEqual(createdEntity.id)
    expect(entity?.toObject()).toEqual(createdEntity.toObject())
    expect(entity?.toJSON()).toEqual(createdEntity.toJSON())
  })
  it('should deleteById remove object', async () => {
    const createdEntity = await mockRepository.create({ name: 'test' })
    expect(createdEntity).not.toBeNull()
    await mockRepository.deleteById(createdEntity.id)
    const entity = await mockRepository.findById(createdEntity.id)
    expect(entity).toBeNull()
  })
})
