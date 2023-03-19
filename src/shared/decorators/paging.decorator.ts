import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PagingQueryDto } from '../dto/Paging';

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 10;

export const Paging = createParamDecorator<PagingQueryDto>(
  (config: PagingQueryDto, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { skip, limit } = request.query;

    const _paging: PagingQueryDto = {
      skip: skip ? parseInt(skip) : config?.skip || DEFAULT_SKIP,
      limit: limit ? parseInt(limit) : config?.limit || DEFAULT_LIMIT,
    };
    return _paging;
  },
);
