import { ThumbType } from './thumb.type';

export type VideoType = {
  duration: number;
  width: number;
  height: number;
  file_name: string;
  mime_type: string;
  thumbnail: ThumbType;
  thumb: ThumbType;
  file_id: string;
  file_unique_id: string;
  file_size: number;
};
