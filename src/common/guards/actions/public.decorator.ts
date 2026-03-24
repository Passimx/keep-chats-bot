import { applyDecorators, SetMetadata } from '@nestjs/common';
import { PUBLIC_DECORATOR_METADATA } from './public-decorator.metadata';

export const Public = () =>
  applyDecorators(SetMetadata(PUBLIC_DECORATOR_METADATA, true));
