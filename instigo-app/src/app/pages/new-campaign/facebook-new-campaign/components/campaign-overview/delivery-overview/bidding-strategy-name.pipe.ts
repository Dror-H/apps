import { PipeTransform } from '@nestjs/common';
import { Pipe } from '@angular/core';
import { biddingStrategies } from '@app/pages/new-campaign/facebook-new-campaign/facebook-new-campaign.data';

@Pipe({ name: 'biddingStrategyName' })
export class BiddingStrategyNamePipe implements PipeTransform {
  transform(value: string): string {
    return this.getBiddingStrategyName(value);
  }

  private getBiddingStrategyName(bidId: string): string {
    return biddingStrategies.filter((item) => item.id === bidId)[0].name;
  }
}
