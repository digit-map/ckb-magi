import {
  Injectable,
  ExecutionContext,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';

import { map } from 'rxjs/operators';

@Injectable()
export class BlockResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(blocks => ({
        code: 200,
        data: blocks.map(({ hash, number, timestamp, difficulty }) => ({
          hash,
          number,
          timestamp,
          difficulty,
        })),
      })),
    );
  }
}
