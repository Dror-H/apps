import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@audiences-api/prisma/prisma.service';
import { FacebookTargetingExportSerializer } from '@audiences-api/targeting/targeting-export/facebook-targeting-export-serializer';
import { AdAccountDTO, CampaignDTO, CampaignStatusType } from '@instigo-app/data-transfer-object';
import { ThirdPartyFacebookExportApiService } from '@instigo-app/third-party-connector';

@Injectable()
export class CampaignExportManagerService {
  private readonly logger = new Logger(CampaignExportManagerService.name);

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(ThirdPartyFacebookExportApiService)
  private readonly thirdPartyService: ThirdPartyFacebookExportApiService;

  public async getCampaign(manager: FacebookTargetingExportSerializer, accessToken: string): Promise<CampaignDTO> {
    try {
      const campaignId = await this.getCampaignId(manager.adAccount.id);
      if (campaignId) {
        const facebookCampaign = await this.getFacebookCampaignById(campaignId, accessToken);
        if (this.isUsableCampaign(facebookCampaign)) {
          return facebookCampaign;
        }
      }
      return await this.createCampaignIfDoesntExist(manager, accessToken);
    } catch (err) {
      this.logger.error(err);
      throw new ForbiddenException(err);
    }
  }

  private async getCampaignId(adAccountId: string): Promise<string> {
    const { campaignId } = await this.prismaService.adAccount.findFirst({
      where: { id: adAccountId },
      select: { campaignId: true },
    });
    return campaignId;
  }

  private async saveCampaignIdForAdAccount(adAccount: AdAccountDTO, campaignId: string): Promise<string> {
    return (
      await this.prismaService.adAccount.update({
        where: {
          id: adAccount.id,
        },
        data: {
          campaignId,
        },
      })
    ).campaignId;
  }

  private isUsableCampaign(campaign: CampaignDTO): boolean {
    return !(campaign.status !== CampaignStatusType.PAUSED || campaign.adSetsCount >= 50);
  }

  private async getFacebookCampaignById(campaignId: string, accessToken: string): Promise<CampaignDTO> {
    return await this.thirdPartyService.getCampaignById({
      accessToken,
      campaignId,
    });
  }

  private async createCampaignIfDoesntExist(
    manager: FacebookTargetingExportSerializer,
    accessToken: string,
  ): Promise<CampaignDTO> {
    const campaignDTO = manager.serializeCampaignObject();
    const newCampaign = await this.thirdPartyService.createCampaign({
      accessToken,
      adAccountProviderId: manager.adAccount.id,
      campaign: campaignDTO,
    });
    await this.saveCampaignIdForAdAccount(manager.adAccount, newCampaign.providerId);
    return newCampaign;
  }
}
