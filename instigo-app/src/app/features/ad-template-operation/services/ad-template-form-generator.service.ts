import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AdTemplateFormBuilder,
  getFacebookAdTemplateFormValidators,
  isControlDisabled,
} from '@app/shared/ad-template/ad-template-control.manager';
import { CAROUSEL_MAX_CHILDREN } from '@app/global/utils';
import {
  AdTemplateCarousel,
  AdTemplateDTO,
  AdTemplateImage,
  AdTemplateType,
  AdTemplateVideo,
  ChildAttachment,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { Subscription } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { ValidatorApiService } from '@app/api/services/validator-api.service';

@Injectable()
export class AdTemplateFormGeneratorService {
  constructor(private readonly fb: FormBuilder, private readonly asyncValidatorService: ValidatorApiService) {}

  private static setStatus(formGroup: FormGroup, isDisabled = false): FormGroup {
    if (isDisabled) {
      formGroup.disable();
    }
    return formGroup;
  }

  public addCarouselChild(carouselGroup: FormGroup, provider: SupportedProviders, child?: ChildAttachment): void {
    const childAttachments = carouselGroup.get('childAttachments') as FormArray;
    if (childAttachments.length < CAROUSEL_MAX_CHILDREN) {
      childAttachments.push(this.generateCarouselItem(provider, child));
    }
  }

  public removeChild(carouselGroup: FormGroup, index: number): void {
    const childAttachments = carouselGroup.get('childAttachments') as FormArray;
    childAttachments.removeAt(index);
  }

  public generateAdTemplateImage(data: AdTemplateImage): FormGroup {
    return new AdTemplateFormBuilder(this.fb, SupportedProviders.FACEBOOK, this.asyncValidatorService)
      .addGroup('social', [
        { name: 'promotePage', value: data?.social?.promotePage },
        { name: 'instagramAccount', value: data?.social?.instagramAccount },
      ])
      .addControl('leadgenFormId', data?.leadgenFormId, isControlDisabled('leadgenFormId', data?.adTemplateSubtype))
      .addControl('eventId', data?.eventId, isControlDisabled('eventId', data?.adTemplateSubtype))
      .addControl('adTemplateSubtype', data?.adTemplateSubtype)
      .addControl('headline', data?.headline, isControlDisabled('headline', data?.adTemplateSubtype))
      .addControl('message', data?.message)
      .addControl(
        'linkDestination',
        data?.linkDestination,
        isControlDisabled('linkDestination', data?.adTemplateSubtype),
      )
      .addControl('linkCaption', data?.linkCaption, isControlDisabled('linkCaption', data?.adTemplateSubtype))
      .addControl(
        'linkDescription',
        data?.linkDescription,
        isControlDisabled('linkDescription', data?.adTemplateSubtype),
      )
      .addControl(
        'callToAction',
        data?.callToAction || 'NO_BUTTON',
        isControlDisabled('callToAction', data?.adTemplateSubtype),
      )
      .addControl('picture', data?.picture)
      .addControl('adFormat', data?.adFormat || 'DESKTOP_FEED_STANDARD').form;
  }

  public generateAdTemplateLinkedinImage(data: AdTemplateImage): FormGroup {
    return new AdTemplateFormBuilder(this.fb, SupportedProviders.LINKEDIN, this.asyncValidatorService)
      .addControl('headline', data?.headline || null)
      .addControl('message', data?.message || null)
      .addControl('linkDestination', data?.linkDestination || null)
      .addControl('linkCaption', data?.linkCaption || null)
      .addControl('linkDescription', data?.linkDescription || null)
      .addControl('callToAction', data?.callToAction || 'NO_BUTTON')
      .addControl('picture', data?.picture || null)
      .addControl('adFormat', data?.adFormat || 'WEBCONVERSION_DESKTOP').form;
  }

  public generateAdTemplateVideo(data: AdTemplateVideo): FormGroup {
    return new AdTemplateFormBuilder(this.fb, SupportedProviders.FACEBOOK, this.asyncValidatorService)
      .addGroup('social', [
        { name: 'promotePage', value: data?.social?.promotePage },
        { name: 'instagramAccount', value: data?.social?.instagramAccount },
      ])
      .addControl('leadgenFormId', data?.leadgenFormId, isControlDisabled('leadgenFormId', data?.adTemplateSubtype))
      .addControl('eventId', data?.eventId, isControlDisabled('eventId', data?.adTemplateSubtype))
      .addControl('adTemplateSubtype', data?.adTemplateSubtype)
      .addControl('headline', data?.headline, isControlDisabled('headline', data?.adTemplateSubtype))
      .addControl('message', data?.message)
      .addControl(
        'linkDestination',
        data?.linkDestination,
        isControlDisabled('linkDestination', data?.adTemplateSubtype),
      )
      .addControl('linkCaption', data?.linkCaption, isControlDisabled('linkCaption', data?.adTemplateSubtype))
      .addControl(
        'linkDescription',
        data?.linkDescription,
        isControlDisabled('linkDescription', data?.adTemplateSubtype),
      )
      .addControl(
        'callToAction',
        data?.callToAction || 'NO_BUTTON',
        isControlDisabled('callToAction', data?.adTemplateSubtype),
      )
      .addControl('video', data?.video)
      .addControl('thumbnail', data?.thumbnail)
      .addControl('adFormat', data?.adFormat || 'DESKTOP_FEED_STANDARD').form;
  }

  public generateAdTemplateLinkedinVideo(data: AdTemplateVideo): FormGroup {
    return new AdTemplateFormBuilder(this.fb, SupportedProviders.LINKEDIN, this.asyncValidatorService)
      .addControl('headline', data?.headline || null)
      .addControl('message', data?.message || null)
      .addControl('linkDestination', data?.linkDestination || null)
      .addControl('linkCaption', data?.linkCaption || null)
      .addControl('linkDescription', data?.linkDescription || null)
      .addControl('callToAction', data?.callToAction || 'NO_BUTTON')
      .addControl('video', data?.video || null)
      .addControl('adFormat', data?.adFormat || 'WEBCONVERSION_DESKTOP').form;
  }

  public generateAdTemplateCarousel(data: AdTemplateCarousel): FormGroup {
    const newCarousel = new AdTemplateFormBuilder(this.fb, SupportedProviders.FACEBOOK, this.asyncValidatorService)
      .addGroup('social', [
        { name: 'promotePage', value: data?.social?.promotePage || null },
        { name: 'instagramAccount', value: data?.social?.instagramAccount || null },
      ])
      .addControl('message', data?.message || null)
      .addControl('linkDestination', data?.linkDestination || null)
      .addControl('linkCaption', data?.linkCaption || null)
      .addControl('multiShareOptimized', data?.multiShareOptimized || false)
      .addControl('multiShareEndCard', data?.multiShareEndCard || false)
      .addControl('adFormat', data?.adFormat || 'DESKTOP_FEED_STANDARD').form;

    newCarousel.addControl(
      'childAttachments',
      this.fb.array([], getFacebookAdTemplateFormValidators('childAttachments')),
    );

    if (data?.childAttachments) {
      data?.childAttachments.forEach((item) => this.addCarouselChild(newCarousel, SupportedProviders.FACEBOOK, item));
    } else {
      this.addCarouselChild(newCarousel, SupportedProviders.FACEBOOK);
      this.addCarouselChild(newCarousel, SupportedProviders.FACEBOOK);
    }

    return newCarousel;
  }

  public generateAdTemplateLinkedinCarousel(data: AdTemplateCarousel): FormGroup {
    const newCarousel = new AdTemplateFormBuilder(this.fb, SupportedProviders.LINKEDIN, this.asyncValidatorService)
      .addControl('message', data?.message || null)
      .addControl('linkDestination', data?.linkDestination || null)
      .addControl('linkCaption', data?.linkCaption || null)
      .addControl('adFormat', data?.adFormat || 'WEBCONVERSION_DESKTOP').form;

    newCarousel.addControl(
      'childAttachments',
      this.fb.array([], getFacebookAdTemplateFormValidators('childAttachments')),
    );

    if (data?.childAttachments) {
      data?.childAttachments.forEach((item) => this.addCarouselChild(newCarousel, SupportedProviders.LINKEDIN, item));
    } else {
      this.addCarouselChild(newCarousel, SupportedProviders.LINKEDIN);
      this.addCarouselChild(newCarousel, SupportedProviders.LINKEDIN);
    }

    return newCarousel;
  }

  public generateAdTemplateForm(adTemplate?: AdTemplateDTO): FormGroup {
    const provider = adTemplate?.provider || SupportedProviders.FACEBOOK;
    const adTemplateType = adTemplate?.adTemplateType || AdTemplateType.IMAGE;
    return this.fb.group({
      settings: this.fb.group({
        provider: [provider],
        adAccount: [adTemplate?.adAccount || null, Validators.required],
        adTemplateType: [adTemplateType],
        adTemplateName: [
          adTemplate?.name || null,
          [Validators.required, Validators.minLength(4), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
        ],
      }),
      facebook: AdTemplateFormGeneratorService.setStatus(
        this.fb.group({
          image: AdTemplateFormGeneratorService.setStatus(
            this.generateAdTemplateImage(adTemplate?.data as AdTemplateImage),
            adTemplateType !== AdTemplateType.IMAGE,
          ),
          carousel: AdTemplateFormGeneratorService.setStatus(
            this.generateAdTemplateCarousel(adTemplate?.data as AdTemplateCarousel),
            adTemplateType !== AdTemplateType.CAROUSEL,
          ),
          video: AdTemplateFormGeneratorService.setStatus(
            this.generateAdTemplateVideo(adTemplate?.data as AdTemplateVideo),
            adTemplateType !== AdTemplateType.VIDEO,
          ),
        }),
        provider !== SupportedProviders.FACEBOOK,
      ),
      linkedin: AdTemplateFormGeneratorService.setStatus(
        this.fb.group({
          image: AdTemplateFormGeneratorService.setStatus(
            this.generateAdTemplateLinkedinImage(adTemplate?.data as AdTemplateImage),
            adTemplateType !== AdTemplateType.IMAGE,
          ),
          carousel: AdTemplateFormGeneratorService.setStatus(
            this.generateAdTemplateLinkedinCarousel(adTemplate?.data as AdTemplateCarousel),
            adTemplateType !== AdTemplateType.CAROUSEL,
          ),
          video: AdTemplateFormGeneratorService.setStatus(
            this.generateAdTemplateLinkedinVideo(adTemplate?.data as AdTemplateVideo),
            adTemplateType !== AdTemplateType.VIDEO,
          ),
        }),
        provider !== SupportedProviders.LINKEDIN,
      ),
    });
  }

  public listenOnAdTemplateTypeFormChanges(adTemplateForm: FormGroup): Subscription {
    return adTemplateForm
      .get('settings.provider')
      .valueChanges.pipe(
        startWith(adTemplateForm.get('settings.provider').value),
        tap((provider) => {
          switch (provider) {
            case SupportedProviders.FACEBOOK: {
              adTemplateForm.get('facebook').enable();
              adTemplateForm.get('linkedin').disable();
              break;
            }
            case SupportedProviders.LINKEDIN: {
              adTemplateForm.get('facebook').disable();
              adTemplateForm.get('linkedin').enable();
              break;
            }
          }
        }),
        switchMap((provider) =>
          adTemplateForm.get('settings.adTemplateType').valueChanges.pipe(
            startWith(adTemplateForm.get('settings.adTemplateType').value),
            tap((change) => {
              switch (change) {
                case AdTemplateType.IMAGE: {
                  adTemplateForm.get(`${provider}.carousel`).disable();
                  adTemplateForm.get(`${provider}.video`).disable();
                  this.enableAdTemplate(adTemplateForm.get(`${provider}.image`) as FormGroup);

                  break;
                }
                case AdTemplateType.CAROUSEL: {
                  adTemplateForm.get(`${provider}.image`).disable();
                  adTemplateForm.get(`${provider}.video`).disable();
                  adTemplateForm.get(`${provider}.carousel`).enable();
                  break;
                }
                case AdTemplateType.VIDEO: {
                  adTemplateForm.get(`${provider}.image`).disable();
                  adTemplateForm.get(`${provider}.carousel`).disable();
                  this.enableAdTemplate(adTemplateForm.get(`${provider}.video`) as FormGroup);
                  break;
                }
              }
            }),
          ),
        ),
      )
      .subscribe();
  }

  private enableAdTemplate(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((controlName) => {
      if (isControlDisabled(controlName, formGroup.value.adTemplateSubtype)) {
        formGroup.get(controlName).disable();
      } else {
        formGroup.get(controlName).enable();
      }
    });
  }

  private generateCarouselItem(provider: SupportedProviders, child?: ChildAttachment): FormGroup {
    return new AdTemplateFormBuilder(this.fb, provider, this.asyncValidatorService)
      .addControl('linkDestination', child?.linkDestination || null)
      .addControl('linkCaption', child?.linkCaption || null)
      .addControl('linkDescription', child?.linkDescription || null)
      .addControl('headline', child?.headline || null)
      .addControl('callToAction', child?.callToAction || 'NO_BUTTON')
      .addControl('picture', child?.picture || null).form;
  }
}
