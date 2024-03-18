import {
  AdAccountDTO,
  AdTemplateDataType,
  AdTemplateType,
  LinkedinImageDto,
  LinkedinMediaUploadResponse,
  SupportedProviders,
  VideoDto,
  WorkspaceDTO,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyAdTemplateApiService } from '@instigo-app/third-party-connector';
import { GatewayTimeoutException, Inject, Injectable, Logger } from '@nestjs/common';
import { from, timer } from 'rxjs';
import { map, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';

@Injectable()
export class AdTemplateService {
  private logger = new Logger(AdTemplateService.name);

  @Inject(ThirdPartyAdTemplateApiService)
  private readonly thirdPartyAdTemplateApiService: ThirdPartyAdTemplateApiService;

  async preview(options: {
    adAccount: AdAccountDTO;
    adTemplateData: AdTemplateDataType;
    adTemplateType: AdTemplateType;
    workspace: WorkspaceDTO;
  }): Promise<{ body: string }> {
    const { adAccount, adTemplateData, adTemplateType, workspace } = options;
    const { accessToken } = workspace.owner.getAccessToken({ provider: adAccount.provider });
    return this.thirdPartyAdTemplateApiService.preview({
      adTemplateData,
      adTemplateType,
      provider: adAccount.provider,
      accessToken,
      adAccount,
    });
  }

  async uploadImage(options: {
    workspace: any;
    adAccount: AdAccountDTO;
    image: LinkedinImageDto;
  }): Promise<LinkedinMediaUploadResponse> {
    const { workspace, adAccount, image } = options;
    const { accessToken } = workspace.owner.getAccessToken({ provider: adAccount.provider });

    switch (adAccount.provider) {
      case SupportedProviders.LINKEDIN:
        const linkedinImageStatus = await this.thirdPartyAdTemplateApiService.uploadImage({
          provider: adAccount.provider,
          accessToken,
          adAccountProviderId: adAccount.businessId,
          imageSource: image,
        });
        return linkedinImageStatus;
    }
  }

  async uploadVideo(options: { workspace: any; adAccount: AdAccountDTO; video: VideoDto }) {
    const { workspace, adAccount, video } = options;
    const { accessToken } = workspace.owner.getAccessToken({ provider: adAccount.provider });

    const videoSource = {
      file_url: video.location,
      title: video.originalname,
      description: video.originalname,
    };

    switch (adAccount.provider) {
      case SupportedProviders.FACEBOOK:
        const { id: providerId } = await this.thirdPartyAdTemplateApiService.uploadVideo({
          provider: adAccount.provider,
          accessToken,
          adAccountProviderId: adAccount.providerId,
          videoSource,
        });

        const polledStatus = await this.pollUntilVideoStatusFinished({
          id: providerId,
          provider: adAccount.provider,
          accessToken,
        });
        if (polledStatus !== 'ready') {
          throw new GatewayTimeoutException();
        }
        return { providerId };
      case SupportedProviders.LINKEDIN:
        const linkedinVideoStatus = await this.thirdPartyAdTemplateApiService.uploadVideo({
          provider: adAccount.provider,
          accessToken,
          adAccountProviderId: adAccount.businessId,
          videoSource: video,
        });
        return linkedinVideoStatus;
    }
  }

  private async pollUntilVideoStatusFinished(data: {
    id: string;
    provider: SupportedProviders;
    accessToken: string;
  }): Promise<any> {
    const { id, provider, accessToken } = data;
    return await new Promise((resolve, reject) => {
      timer(0, 2000)
        .pipe(
          switchMap(() =>
            from(
              this.thirdPartyAdTemplateApiService.status({
                id,
                provider,
                accessToken,
              }),
            ),
          ),
          tap((item) => this.logger.verbose(item.status.video_status, item.published)),
          map((item) => item.status.video_status && item.published),
          takeWhile((data) => !!data),
          takeUntil(timer(1200000)),
        )
        .subscribe({
          error: (err) => reject(err),
          complete: () => {
            resolve('ready');
          },
        });
    });
  }
}
