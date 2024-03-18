import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdAccountDTO, SupportedProviders, VideoDto } from '@instigo-app/data-transfer-object';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { isArray } from 'lodash-es';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { AdTemplateApiService } from '@app/api/services/ad-template.api.service';
import { UppyBase } from '@app/shared/ad-template/media/uppy-base';

@Component({
  selector: 'ingo-media-video-uppy',
  templateUrl: 'media-video-uppy.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MediaVideoUppyComponent),
      multi: true,
    },
  ],
})
export class MediaVideoUppyComponent extends UppyBase {
  @Input() maxFiles = 1;
  @Input() adAccount: AdAccountDTO;

  public isUploadingToProvider = false;

  constructor(
    private http: HttpClient,
    private modalService: NzModalService,
    private displayNotification: DisplayNotification,
    private adTemplateService: AdTemplateApiService,
  ) {
    super(1e9, ['video/*']);
    this.configureUppy();
  }

  writeValue(videos: any[] | any): void {
    if (!videos) {
      return;
    }
    if (isArray(videos)) {
      videos.forEach((video) => {
        this.setDefault(video.location);
      });
    } else {
      this.setDefault(videos.location);
    }
  }

  private configureUppy() {
    this.uppy.on('upload-success', (result, file) => {
      this.isUploadingToProvider = true;
      const video: VideoDto = {
        id: file.body.id,
        originalname: file.body.originalname,
        mimetype: file.body.mimetype,
        location: file.body.location,
      };
      if (this.adAccount.provider === SupportedProviders.FACEBOOK) {
        this.uploadToProvider(video).subscribe(
          (response) => {
            this.isUploadingToProvider = false;
            this.onChange({ providerId: response.providerId, location: video.location });
          },
          (err) => {
            console.log(err);
            this.displayError();
          },
        );
      }
      if (this.adAccount.provider === SupportedProviders.LINKEDIN) {
        this.onChange(video);
      }
    });
    this.uppy.on('file-removed', (file) => {
      this.isUploadingToProvider = false;
    });
  }

  private getVideo(videoUrl: string): Observable<Blob> {
    return this.http.get(videoUrl, { responseType: 'blob' }).pipe(take(1));
  }

  private setDefault(location: string): void {
    if (!location) {
      this.notFetchable = true;
    }
    this.getVideo(location).subscribe((blob) => {
      const file = this.uppy.addFile({ type: blob.type, data: new File([blob], 'video') });
      this.uppy.setFileState(file, {
        progress: { uploadComplete: true, uploadStarted: true },
      });
    });
  }

  private displayError(): void {
    this.displayNotification.displayNotification(
      new Notification({
        title: `The Video could not be uploaded`,
        type: NotificationType.ERROR,
      }),
    );
  }

  private uploadToProvider(video: VideoDto): Observable<any> {
    return this.adTemplateService.uploadVideo({ adAccount: this.adAccount, video: video });
  }
}
