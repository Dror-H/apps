import { Inject, Injectable, Logger } from '@nestjs/common';
import { AdAccountDTO, AdSetDTO, CampaignDTO, TargetingDto } from '@instigo-app/data-transfer-object';
import { FacebookTargetingExportSerializer } from '@audiences-api/targeting/targeting-export/facebook-targeting-export-serializer';
import { CampaignExportManagerService } from '@audiences-api/targeting/targeting-export/campaign-export-manager.service';
import { AdSetExportManagerService } from '@audiences-api/targeting/targeting-export/ad-set-export-manager.service';

@Injectable()
export class TargetingExportService {
  private readonly logger = new Logger(TargetingExportService.name);

  @Inject(CampaignExportManagerService)
  private readonly campaignExportManager: CampaignExportManagerService;

  @Inject(AdSetExportManagerService)
  private readonly adsetExportManager: AdSetExportManagerService;

  public async facebookExport(
    targeting: TargetingDto,
    adAccount: AdAccountDTO,
    accessToken: string,
    name: string,
  ): Promise<{ campaign: CampaignDTO; adSet: Partial<AdSetDTO> }> {
    this.logger.log('Facebook export started');
    const manager = new FacebookTargetingExportSerializer(name, adAccount, targeting);
    const campaign = await this.campaignExportManager.getCampaign(manager, accessToken);
    const adSet = await this.adsetExportManager.updateAdSetTargeting(manager, accessToken, campaign);
    return { campaign, adSet };
  }
}
