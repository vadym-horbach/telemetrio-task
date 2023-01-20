import dotenv from 'dotenv'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { VALIDATED_ENV_PROPNAME } from '@nestjs/config/dist/config.constants'
import path from 'path'
import fs from 'fs'
import { EnvironmentEnum, EnvironmentDTO, LoggingLevelsEnum, validate } from './config.validate'

@Injectable()
export class AppConfigService extends ConfigService<EnvironmentDTO> {
  private static instance: AppConfigService

  constructor(internalConfig?: Record<string, any>) {
    super(internalConfig)

    // @ts-expect-error: @nestjs/config ALWAYS reads from process.env so this causes it to read internally
    this.getFromProcessEnv = () => undefined
  }

  static getInstance() {
    if (!AppConfigService.instance) {
      const envPath = path.resolve(process.cwd(), '.env')
      const config = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {}

      AppConfigService.instance = new AppConfigService({
        [VALIDATED_ENV_PROPNAME]: validate({ ...config, ...process.env }),
      })
    }

    return AppConfigService.instance
  }

  get environment() {
    return <EnvironmentEnum>this.get('NODE_ENV')
  }

  get isDevelopment() {
    return this.environment === EnvironmentEnum.DEVELOPMENT
  }

  get isProduction() {
    return this.environment === EnvironmentEnum.PRODUCTION
  }

  get port() {
    return <number>this.get('NODE_PORT')
  }

  get isClusterEnabled() {
    return !this.isDevelopment && <boolean>this.get('ENABLE_CLUSTER')
  }

  get loggingLevel() {
    return <LoggingLevelsEnum>this.get('LOGGING_LEVEL')
  }

  get apiRootUrl() {
    return <string>this.get('API_ROOT_URL')
  }

  get clientRootUrl() {
    return <string>this.get('CLIENT_ROOT_URL')
  }

  get corsOrigins() {
    const originsString = <string>this.get('CORS_ORIGINS')
    const origins = originsString.split(' ').filter((e) => e !== '')

    return [this.clientRootUrl, this.apiRootUrl, ...origins]
  }

  get isCloudWatchEnabled() {
    return <boolean>this.get('ENABLE_CLOUDWATCH')
  }

  get cloudWatchConfig() {
    const config = {
      awsAccessKey: <string>this.get('AWS_CLOUDWATCH_ACCESS_KEY'),
      awsSecretKey: <string>this.get('AWS_CLOUDWATCH_KEY_SECRET'),
      awsRegion: <string>this.get('AWS_CLOUDWATCH_REGION'),
    }

    if (config.awsAccessKey && config.awsSecretKey && config.awsRegion) {
      return config
    }

    return null
  }

  get database() {
    return { uri: <string>this.get('DB_URI') }
  }
}
