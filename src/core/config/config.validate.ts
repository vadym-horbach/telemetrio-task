import { plainToInstance } from 'class-transformer'
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator'
import { IsBooleanLike } from '../../common/decorators/validation'

export enum EnvironmentEnum {
  PRODUCTION = 'production',
  STAGING = 'staging',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

export enum LoggingLevelsEnum {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

export class EnvironmentDTO {
  // Server
  @IsDefined()
  @IsEnum(EnvironmentEnum)
  NODE_ENV: EnvironmentEnum = EnvironmentEnum.DEVELOPMENT

  @IsDefined()
  @IsNumber()
  NODE_PORT: number = 5000

  @IsDefined()
  @IsBooleanLike()
  ENABLE_CLUSTER: boolean = true

  @IsDefined()
  @IsEnum(LoggingLevelsEnum)
  LOGGING_LEVEL: LoggingLevelsEnum = LoggingLevelsEnum.HTTP

  @IsDefined()
  @IsUrl({ require_tld: false })
  API_ROOT_URL: string = 'http://localhost:5000'

  @IsDefined()
  @IsUrl({ require_tld: false })
  CLIENT_ROOT_URL: string = 'http://localhost:5000'

  @IsDefined()
  @IsString()
  CORS_ORIGINS: string = ''

  // AWS CloudWatch
  @IsDefined()
  @IsBooleanLike()
  ENABLE_CLOUDWATCH: boolean = false

  @IsOptional()
  @IsString()
  AWS_CLOUDWATCH_ACCESS_KEY!: string

  @IsOptional()
  @IsString()
  AWS_CLOUDWATCH_KEY_SECRET!: string

  @IsOptional()
  @IsString()
  AWS_CLOUDWATCH_REGION!: string

  // ## DATABASE ##
  @IsDefined()
  @IsString()
  DB_URI!: string
}

export const validate = (config: Record<string, unknown>): EnvironmentDTO => {
  const validatedConfig = plainToInstance(EnvironmentDTO, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, {
    whitelist: true,
    forbidUnknownValues: true,
    validationError: {
      target: false,
    },
  })

  if (errors.length > 0) {
    throw new Error(String(errors))
  }

  return validatedConfig
}
