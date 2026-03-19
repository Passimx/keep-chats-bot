import { FastifyRequest } from 'fastify';
import { UserEntity } from '../../../modules/database/entities/user.entity';

export interface CustomFastifyRequest extends FastifyRequest {
  userId: number;
  user: UserEntity;
}
