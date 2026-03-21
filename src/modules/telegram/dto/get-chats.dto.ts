import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ChatTypeEnum } from '../types/chat-type.enum';

export class GetChatsDto {
  @IsEnum(ChatTypeEnum)
  @IsOptional()
  readonly type: ChatTypeEnum;

  @IsNumber({}, { each: true })
  @IsOptional()
  readonly users: number[];
}
