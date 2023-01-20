import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { AppLoggerService, AsyncStorageService } from '../../core'
import { HEADER_REQUEST_ID } from '../constants'
import { I_FastifyReply } from '../interfaces'

@Injectable()
export class AppInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly asyncStorage: AsyncStorageService,
  ) {
    this.logger.setContext(AppInterceptor.name)
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, url } = request

    const requestID = request.headers[HEADER_REQUEST_ID] || request.id
    this.asyncStorage.setRequestID(requestID)

    if (url !== '/') {
      this.logger.http({
        eventType: 'start-request',
        message: `Start request with id: ${requestID}`,
        method,
        url,
        headers: request.headers,
      })
    }

    const startTime = Date.now()

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<I_FastifyReply>()
          response.header(HEADER_REQUEST_ID, requestID)

          if (url !== '/') {
            const responseTime = Date.now() - startTime
            this.logger.http({
              eventType: 'end-request',
              message: `End request with id: ${requestID}`,
              method,
              url,
              responseTime,
            })
          }
        },
        error: (error) => {
          const response = context.switchToHttp().getResponse<I_FastifyReply>()
          response.header(HEADER_REQUEST_ID, requestID)

          if (url !== '/') {
            const responseTime = Date.now() - startTime
            this.logger.error(error)
            this.logger.http({
              eventType: 'failed-request',
              message: `Failed request with id: ${requestID}`,
              method,
              url,
              responseTime,
            })
          }
        },
      }),
    )
  }
}
