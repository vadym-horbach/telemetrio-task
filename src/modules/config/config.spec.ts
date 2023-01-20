import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { ConfigController } from './config.controller'
import { TrackingConfigRepository } from '../../models/tracking-config/tracking-config.repository'
import { TrackingConfigStateEnum } from '../../models/tracking-config/constants'

describe('BaseRepository', () => {
  let trackingConfigRepository: TrackingConfigRepository
  let configController: ConfigController

  const mockData = {
    keyword: 'data',
    state: TrackingConfigStateEnum.ACTIVE,
    whereFind: { chats: false, channels: true },
  }

  const mockResult = {
    keyword: 'response',
    state: TrackingConfigStateEnum.ACTIVE,
    whereFind: { chats: false, channels: true },
  }

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [],
      controllers: [ConfigController],
    })
      // eslint-disable-next-line consistent-return
      .useMocker((token) => {
        if (token === TrackingConfigRepository) {
          return {
            createModel: () => mockResult,
            create: async () => Promise.resolve(),
            findMany: async () => Promise.resolve(),
            updateById: async () => Promise.resolve(),
            deleteById: async () => Promise.resolve(),
          }
        }
      })
      .compile()
    trackingConfigRepository = moduleRef.get<TrackingConfigRepository>(TrackingConfigRepository)
    configController = moduleRef.get<ConfigController>(ConfigController)
  })

  it('should create trackingConfig', async () => {
    const mockFunc = jest
      .spyOn(trackingConfigRepository, 'create')
      .mockResolvedValue(trackingConfigRepository.createModel(mockData))

    await expect(configController.create(mockData)).resolves.toEqual(mockResult)
    expect(mockFunc).toBeCalled()
    expect(mockFunc).toBeCalledWith(mockData)
  })

  it('should list trackingConfig', async () => {
    const mockFunc = jest
      .spyOn(trackingConfigRepository, 'findMany')
      .mockResolvedValue([trackingConfigRepository.createModel(mockData)])

    await expect(
      configController.list({
        state: TrackingConfigStateEnum.ACTIVE,
        orderBy: 'createdAt',
        order: 'asc',
        limit: 10,
      }),
    ).resolves.toContain(mockResult)
    expect(mockFunc).toBeCalled()
    expect(mockFunc).toBeCalledWith(
      { state: TrackingConfigStateEnum.ACTIVE },
      { limit: 10, sort: { createdAt: 'asc' } },
    )
  })

  it('should update trackingConfig', async () => {
    const mockFunc = jest
      .spyOn(trackingConfigRepository, 'updateById')
      .mockResolvedValueOnce(trackingConfigRepository.createModel(mockData))
      .mockResolvedValueOnce(null)

    const params1 = { id: 'test_id' }
    const params2 = { id: 'test_id2' }
    await expect(configController.update(params1, mockData)).resolves.toEqual(mockResult)
    await expect(configController.update(params2, mockData)).rejects.toThrow(NotFoundException)

    expect(mockFunc).toBeCalledTimes(2)
    expect(mockFunc).toBeCalledWith(params1.id, mockData)
    expect(mockFunc).toBeCalledWith(params2.id, mockData)
  })

  it('should delete trackingConfig', async () => {
    const mockFunc = jest
      .spyOn(trackingConfigRepository, 'deleteById')
      .mockResolvedValueOnce(trackingConfigRepository.createModel(mockData))
      .mockResolvedValueOnce(null)

    const params1 = { id: 'test_id' }
    const params2 = { id: 'test_id2' }
    await expect(configController.delete(params1)).resolves.toEqual(mockResult)
    await expect(configController.delete(params2)).rejects.toThrow(NotFoundException)

    expect(mockFunc).toBeCalledTimes(2)
    expect(mockFunc).toBeCalledWith(params1.id)
    expect(mockFunc).toBeCalledWith(params2.id)
  })
})
