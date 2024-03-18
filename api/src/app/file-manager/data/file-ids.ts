import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { isUndefined } from 'lodash';

export class CheckFileIdsFilter {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform((value: any) => value.split(',').filter((val) => !isUndefined(val)))
  fileIds?: string[];
}
