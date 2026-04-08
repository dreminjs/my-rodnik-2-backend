import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAPIResponse } from 'src/interfaces/common.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  IAPIResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IAPIResponse<T>> {
    return next.handle().pipe(
      map((data: T) => ({
        data,
      })),
    );
  }
}
