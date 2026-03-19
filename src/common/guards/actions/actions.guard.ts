import { CanActivate, ExecutionContext } from '@nestjs/common';
import { CustomFastifyRequest } from './custom-fastify-request.type';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../../modules/database/entities/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';

export class ActionsGuard implements CanActivate {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const token = context.getArgs()[0]?.headers?.authorization as string;
    if (!token?.length) return false;

    const bot = await this.em.findOne(UserEntity, {
      where: { isBot: true, token },
    });

    if (!bot) return false;

    const request = context.switchToHttp().getRequest<CustomFastifyRequest>();
    request.user = bot;
    request.userId = bot.id;

    return true;
  }
}
