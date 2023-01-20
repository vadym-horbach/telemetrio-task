import { Injectable } from '@nestjs/common'
import { AsyncLocalStorage } from 'node:async_hooks'

@Injectable()
export class AsyncStorageService {
  private readonly asyncStore = new AsyncLocalStorage<Map<string, any>>()

  getAsyncStorage() {
    return this.asyncStore
  }

  static getInitialStore() {
    return new Map<string, any>()
  }

  private setValue(key: string, value: any) {
    this.asyncStore.getStore()?.set(key, value)

    return this
  }

  private getValue<T>(key: string) {
    return this.asyncStore.getStore()?.get(key) as T | undefined
  }

  setRequestID(value: string) {
    return this.setValue('requestID', value)
  }

  getRequestID() {
    return this.getValue<string>('requestID')
  }
}
