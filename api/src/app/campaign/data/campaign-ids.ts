import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { isUndefined } from 'lodash';

export class CampaignIdsFilter {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform((value: any) => value.value.split(',').filter((val) => !isUndefined(val)))
  campaignIds?: string[];
}
