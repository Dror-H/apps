import { Component, forwardRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, take } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, of } from 'rxjs';
import { SelectExistingComponent } from '../select-existing/select-existing.component';
import * as ImageCompressor from 'uppy-plugin-image-compressor';
import { UppyBase } from '@app/shared/ad-template/media/uppy-base';
import { remove } from 'lodash-es';

@Component({
  selector: 'ingo-media-image-uppy',
  templateUrl: './media-image-uppy.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MediaImageUppyComponent),
      multi: true,
    },
  ],
})
export class MediaImageUppyComponent extends UppyBase {
  @Input() multivariate = false;

  private multivariateExistingImagesLocations: { location: string; id: string; mimetype: string }[] = [];

  constructor(private http: HttpClient, private modalService: NzModalService) {
    super(2e7, ['image/*']);
    this.configureUppy();
  }

  @Input() set maxFiles(fileSize: number) {
    this._maxFiles = fileSize;
    this.uppy.setOptions({ restrictions: { maxNumberOfFiles: Number(this._maxFiles) } });
  }

  public selectExistingMedia($event: MouseEvent) {
    const modalRef = this.modalService.create({
      nzTitle: 'Choose From Gallery',
      nzContent: SelectExistingComponent,
      nzClassName: 'custom-modal',
      nzWrapClassName: 'vertical-center-modal',
      nzWidth: 820,
      nzComponentParams: {
        isImage: true,
      },
    });

    modalRef.afterClose
      .asObservable()
      .pipe(
        take(1),
        switchMap((result) => {
          if (!result) {
            return of({ location: null, image: null });
          }
          return this.getImage(result.location).pipe(map((image) => ({ location: result.location, image })));
        }),
      )
      .subscribe(({ location, image }) => {
        if (!image || !location) {
          return;
        }
        const file = this.uppy.addFile({ type: image.type, data: new File([image], 'img.jpg') });
        this.uppy.setFileState(file, {
          progress: { uploadComplete: true, uploadStarted: true },
        });
        if (this.multivariate) {
          this.multivariateExistingImagesLocations.push({ location, id: file, mimetype: image.type });
          this.onChange(this.multivariateExistingImagesLocations);
        } else {
          this.onChange({ location, id: file, mimeType: image.type });
        }
      });
    return false;
  }

  writeValue(images: any[] | any): void {
    if (!images) {
      return;
    }
    if (this.multivariate) {
      images.forEach((image) => {
        this.setDefault(image.location);
      });
    } else {
      this.setDefault(images.location);
    }
  }

  private configureUppy(): void {
    this.uppy
      .use(ImageCompressor, {
        quality: 0.4,
      })
      .on('file-removed', (file) => {
        if (!this.multivariate) {
          this.onChange(null);
        } else {
          remove(this.multivariateExistingImagesLocations, (item) => item.id === file.id);
          this.onChange(this.multivariateExistingImagesLocations);
        }
      })
      .on('upload-success', (result, file) => {
        if (!this.multivariate) {
          this.onChange({ location: file.body.location, mimetype: file.body.mimetype });
        } else {
          this.multivariateExistingImagesLocations.push({
            location: file.body.location,
            id: result.id,
            mimetype: file.body.mimetype,
          });

          this.onChange(this.multivariateExistingImagesLocations);
        }
      });
  }

  private getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' }).pipe(take(1));
  }

  private setDefault(location: string): void {
    if (!location) {
      this.notFetchable = true;
    }
    this.getImage(location).subscribe((blob) => {
      const file = this.uppy.addFile({ type: blob.type, data: new File([blob], 'img.jpg') });
      this.uppy.setFileState(file, {
        progress: { uploadComplete: true, uploadStarted: true },
      });
    });
  }
}
