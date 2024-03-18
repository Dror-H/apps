import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { AdCreationDTO, AdDTO, AdUpdateDTO, ResponseSuccess, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Ad } from '@api/ad/data/ad.entity';
import { ThirdPartyAdApiService } from '@instigo-app/third-party-connector';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { from, Observable } from 'rxjs';
import { groupBy } from 'lodash';
import { map, mergeMap, switchMap } from 'rxjs/operators';

@Injectable()
export class AdService {
  @Inject(ThirdPartyAdApiService)
  private readonly thirdPartyAdApiService: ThirdPartyAdApiService;

  @InjectRepository(Ad)
  private readonly adRepository: Repository<Ad>;

  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache;

  async create(ad: Partial<AdCreationDTO<any>>, currentWorkspace: WorkspaceDTO): Promise<AdDTO> {
    const { provider, adAccount } = ad;
    const { accessToken } = currentWorkspace.owner.getAccessToken({ provider });
    const builtAd = await this.thirdPartyAdApiService.create({
      accessToken,
      adAccountProviderId: adAccount.providerId,
      provider,
      ad,
    });
    builtAd.adAccount = adAccount;
    return this.adRepository.save(builtAd);
  }

  async bulkCreate(ads: Partial<AdCreationDTO<any>>[], currentWorkspace: WorkspaceDTO): Promise<Ad[]> {
    const { provider, adAccount, campaign } = ads[0];
    const { accessToken } = currentWorkspace.owner.getAccessToken({ provider });
    const createdAds = await this.thirdPartyAdApiService.createMany({
      accessToken,
      adAccountProviderId: adAccount.providerId,
      provider,
      ads: ads,
    });
    const adSet = ads[0].providerSpecificFields?.adSet;
    const mappedAds = createdAds.map((item) => ({ ...item, adAccount, campaign, adSet }));
    return this.adRepository.save(mappedAds);
  }

  public async updateOne(ad: AdUpdateDTO, currentWorkspace: WorkspaceDTO): Promise<Ad> {
    await this.cacheManager.reset();
    const { accessToken } = currentWorkspace.owner.getAccessToken({ provider: ad.provider });
    await this.thirdPartyAdApiService.updateAd({ provider: ad.provider, accessToken, ad });
    const newAd = {
      id: ad.id,
      name: ad.name,
      objectStorySpec: { ...ad.data, adTemplateType: ad.adTemplateType },
    } as Ad;
    return await this.adRepository.save(newAd);
  }

  bulkPatch(options: { ads: Partial<AdDTO>[]; workspace: WorkspaceDTO }): Observable<any> {
    const { ads, workspace } = options;
    void this.cacheManager.reset();
    return from(Object.entries(groupBy(ads, 'provider'))).pipe(
      mergeMap(([provider, entries]) => {
        const { accessToken } = workspace.owner.getAccessToken({ provider });
        return this.thirdPartyAdApiService.bulkPatch({ provider, accessToken, ads: entries });
      }),
      switchMap(() => this.adRepository.save(ads)),
      map(() => new ResponseSuccess('Ads successfully updated')),
    );
  }
}
