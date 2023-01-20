import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Connection, Schema } from 'mongoose'

export class MockMongodbManager {
  private mongoServer: MongoMemoryServer

  private connection?: Connection

  private models = new Set<string>()

  constructor() {
    this.mongoServer = new MongoMemoryServer({ binary: { version: '6.0.3' } })
  }

  async start() {
    if (this.mongoServer.state === 'new' || this.mongoServer.state === 'stopped') {
      await this.mongoServer.start()
      mongoose.set('strictQuery', true)
      const db = await mongoose.connect(this.mongoServer.getUri())
      this.connection = db.connection
    }

    return this
  }

  getModel(name: string, schema: Schema) {
    if (!this.connection) {
      throw new Error('Start the server before using this method')
    }

    this.models.add(name)

    return this.connection.model(name, schema)
  }

  async cleanup() {
    const { connection } = this

    if (connection) {
      await Promise.all(
        Object.keys(connection.collections).map(async (model) =>
          connection.collection(model).deleteMany({}),
        ),
      )
    }

    return this
  }

  async stop() {
    if (this.connection) {
      await this.connection.dropDatabase()
      await this.connection.close()
    }

    await this.mongoServer.stop({ doCleanup: true })

    return this
  }
}
