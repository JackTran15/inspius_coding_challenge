import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const httpContext = context.switchToHttp();
    // const request = httpContext.getRequest();

    return next.handle().pipe(
      map((data) => {
        return {
          error: data?.error || false,
          data: data.data,
          message: data.message,
        };
      }),
    );
  }
}
