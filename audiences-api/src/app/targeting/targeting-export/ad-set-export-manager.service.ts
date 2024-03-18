import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { FacebookTargetingExportSerializer } from '@audiences-api/targeting/targeting-export/facebook-targeting-export-serializer';
import {
  AdAccountDTO,
  AdSetDTO,
  CampaignDTO,
  CampaignStatusType,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { PrismaService } from '@audiences-api/prisma/prisma.service';
import { ThirdPartyAdSetApiService, ThirdPartyFacebookExportApiService } from '@instigo-app/third-party-connector';

@Injectable()
export class AdSetExportManagerService {
  private readonly logger = new Logger(AdSetExportManagerService.name);

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(ThirdPartyFacebookExportApiService)
  private readonly thirdPartyService: ThirdPartyFacebookExportApiService;

  @Inject(ThirdPartyAdSetApiService)
  private readonly thirdPartyAdSetApiService: ThirdPartyAdSetApiService;

  public async updateAdSetTargeting(
    manager: FacebookTargetingExportSerializer,
    accessToken: string,
    campaign: CampaignDTO,
  ): Promise<AdSetDTO> {
    try {
      const adSetId = await this.getAdSetId(manager.adAccount.id);
      if (adSetId) {
        const facebookAdSet = await this.getFacebookAdSetById(adSetId, accessToken);
        facebookAdSet.targeting = manager.targeting;
        if (this.isUsableAdSet(facebookAdSet)) {
          await this.updateAdSet(accessToken, facebookAdSet);
          return facebookAdSet;
        }
      }
      return await this.createAdSetIfDoesntExist(manager, accessToken, campaign);
    } catch (err) {
      this.logger.error(err);
      throw new ForbiddenException(err);
    }
  }

  private isUsableAdSet(adSet: AdSetDTO): boolean {
    return !(adSet.status == CampaignStatusType.DELETED || adSet.status == CampaignStatusType.ARCHIVED);
  }

  private async getAdSetId(adAccountId: string): Promise<string> {
    const { adsetId } = await this.prismaService.adAccount.findFirst({
      where: { id: adAccountId },
      select: { adsetId: true },
    });
    return adsetId;
  }

  private async saveAdSetIdForAdAccount(adAccount: AdAccountDTO, adSetId: string): Promise<string> {
    return (
      await this.prismaService.adAccount.update({
        where: {
          id: adAccount.id,
        },
        data: {
          adsetId: adSetId,
        },
      })
    ).adsetId;
  }

  private async getFacebookAdSetById(adSetId: string, accessToken: string): Promise<AdSetDTO> {
    return await this.thirdPartyService.getAdSetById({
      accessToken,
      adSetId: adSetId,
    });
  }

  private async createAdSetIfDoesntExist(
    manager: FacebookTargetingExportSerializer,
    accessToken: string,
    campaign: CampaignDTO,
  ): Promise<AdSetDTO> {
    const adSetDTO = manager.serializeAdSetCreationObject();
    adSetDTO.campaign = campaign;
    const newAdSet = await this.thirdPartyService.createAdSet({
      accessToken,
      adAccountProviderId: manager.adAccount.id,
      adSet: adSetDTO,
    });
    await this.saveAdSetIdForAdAccount(manager.adAccount, newAdSet.providerId);
    return newAdSet;
  }

  private updateAdSet(accessToken: string, adSet: AdSetDTO): Promise<AdSetDTO> {
    return this.thirdPartyAdSetApiService.bulkPatch({
      provider: SupportedProviders.FACEBOOK,
      accessToken,
      adSets: [adSet],
    });
  }
}
