import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomFastifyRequest } from './custom-fastify-request.type';
import { UserEntity } from '../../../modules/database/entities/user.entity';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest<CustomFastifyRequest>();

    return request.user;
  },
);
