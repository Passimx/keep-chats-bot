import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import { UpdateType } from './types/update.type';
import { UserEntity } from '../database/entities/user.entity';
import { User } from '../../common/guards/actions/user.decorator';

@Controller('telegram')
export class ActionsController {
  constructor(private actionsService: ActionsService) {}

  @Post('events')
  events(@Body() body: UpdateType, @User() bot: UserEntity) {
    return this.actionsService.saveAction(bot, body);
  }

  @Get('chats/:id/export')
  exportChat(@Param('id', ParseIntPipe) id: number, @User() bot: UserEntity) {
    return this.actionsService.exportChat(bot, { id });
  }
}
