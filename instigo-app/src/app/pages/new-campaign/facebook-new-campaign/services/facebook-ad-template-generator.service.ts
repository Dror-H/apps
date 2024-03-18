import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CAROUSEL_MAX_CHILDREN } from '@app/global/utils';
import {
  AdTemplateFormBuilder,
  getFacebookAdTemplateFormValidators,
} from '@app/shared/ad-template/ad-template-control.manager';
import {
  AdTemplateCarousel,
  AdTemplateDTO,
  AdTemplateImage,
  AdTemplateType,
  AdTemplateVideo,
  DraftPost,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { ValidatorApiService } from '@app/api/services/validator-api.service';

@Injectable()
export class FacebookAdTemplateGeneratorService {
  constructor(private fb: FormBuilder, private asyncValidatorService: ValidatorApiService) {}

  public addCarouselChild(carouselGroup: FormGroup): void {
    const childAttachments = carouselGroup.get('childAttachments') as FormArray;
    if (childAttachments.length < CAROUSEL_MAX_CHILDREN) {
      childAttachments.push(this.generateCarouselItem());
    }
  }

  public removeChild(carouselGroup: FormGroup, index: number): void {
    const childAttachments = carouselGroup.get('childAttachments') as FormArray;
    childAttachments.removeAt(index);
  }

  public generateImageAdTemplateExistingPost(draftPost: DraftPost): FormGroup {
    return new AdTemplateFormBuilder(this.fb)
      .addControl('instagramAccount', draftPost.instagramAccount || null)
      .addControl('isInstagramEligible', draftPost.data.isInstagramEligible || null)
      .addControl('message', draftPost.data.message || null)
      .addControl('headline', draftPost.data.attachments.title || null)
      .addControl('adTemplateType', AdTemplateType.EXISTING_POST)
      .addControl('adAccount', draftPost.adAccount || null)
      .addControl('adFormat', draftPost.adFormat || 'DESKTOP_FEED_STANDARD')
      .addControl('providerId', draftPost.providerId || null).form;
  }

  public generateImageAdTemplate(adTemplateDTO: AdTemplateDTO): FormGroup {
    const data = adTemplateDTO.data as AdTemplateImage;
    return new AdTemplateFormBuilder(this.fb, SupportedProviders.FACEBOOK, this.asyncValidatorService)
      .addGroup('social', [
        { name: 'promotePage', value: data.social.promotePage || null },
        { name: 'instagramAccount', value: data.social.instagramAccount || null },
      ])
      .addControl('id', adTemplateDTO.id || null)
      .addControl('providerId', adTemplateDTO.providerId || null)
      .addControl('isInstagramEligible', data.isInstagramEligible ?? null)
      .addControl('headline', data.headline || null)
      .addControl('message', data.message || null)
      .addControl('linkDestination', data.linkDestination || null)
      .addControl('linkCaption', data.linkCaption || null)
      .addControl('linkDescription', data.linkDescription || null)
      .addControl('callToAction', data.callToAction || 'NO_BUTTON')
      .addControl('adFormat', data.adFormat || 'DESKTOP_FEED_STANDARD')
      .addControl('adTemplateType', adTemplateDTO.adTemplateType || null)
      .addControl('adAccount', adTemplateDTO.adAccount || null)
      .addControl('picture', data.picture || null).form;
  }

  public generateVideoAdTemplate(adTemplateDTO: AdTemplateDTO): FormGroup {
    const data = adTemplateDTO.data as AdTemplateVideo;
    return new AdTemplateFormBuilder(this.fb, SupportedProviders.FACEBOOK, this.asyncValidatorService)
      .addGroup('social', [
        { name: 'promotePage', value: data.social.promotePage || null },
        { name: 'instagramAccount', value: data.social.instagramAccount || null },
      ])
      .addControl('id', adTemplateDTO.id || null)
      .addControl('providerId', adTemplateDTO.providerId || null)
      .addControl('isInstagramEligible', data.isInstagramEligible ?? null)
      .addControl('headline', data.headline || null)
      .addControl('message', data.message || null)
      .addControl('linkDestination', data.linkDestination || null)
      .addControl('linkCaption', data.linkCaption || null)
      .addControl('linkDescription', data.linkDescription || null)
      .addControl('callToAction', data.callToAction || 'NO_BUTTON')
      .addControl('adFormat', data.adFormat || 'DESKTOP_FEED_STANDARD')
      .addControl('adTemplateType', adTemplateDTO.adTemplateType || null)
      .addControl('adAccount', adTemplateDTO.adAccount || null)
      .addControl('thumbnail', data.thumbnail || null)
      .addControl('video', data.video || null).form;
  }

  public generateCarouselAdTemplate(adTemplateDTO: AdTemplateDTO): FormGroup {
    const data = adTemplateDTO.data as AdTemplateCarousel;
    const newCarousel = new AdTemplateFormBuilder(this.fb, SupportedProviders.FACEBOOK, this.asyncValidatorService)
      .addGroup('social', [
        { name: 'promotePage', value: data.social.promotePage || null },
        { name: 'instagramAccount', value: data.social.instagramAccount || null },
      ])
      .addControl('id', adTemplateDTO.id || null)
      .addControl('message', data.message || null)
      .addControl('linkDestination', data.linkDestination || null)
      .addControl('linkCaption', data.linkCaption || null)
      .addControl('adFormat', data.adFormat || 'DESKTOP_FEED_STANDARD')
      .addControl('adTemplateType', adTemplateDTO.adTemplateType || null)
      .addControl('adAccount', adTemplateDTO.adAccount || null).form;

    newCarousel.addControl(
      'childAttachments',
      this.fb.array(data.childAttachments || [], getFacebookAdTemplateFormValidators('childAttachments')),
    );
    if (!data.childAttachments) {
      this.addCarouselChild(newCarousel);
      this.addCarouselChild(newCarousel);
    }

    return newCarousel;
  }

  public generateImageAdTemplateFromPage(): FormGroup {
    return new AdTemplateFormBuilder(this.fb)
      .addControl('promotePage', null)
      .addControl('pageInfo', null)
      .addControl('picture', null).form;
  }

  public generateMultiVariateImage(): FormGroup {
    return new AdTemplateFormBuilder(this.fb, SupportedProviders.FACEBOOK, this.asyncValidatorService)
      .addGroup('social', [
        { name: 'promotePage', value: null },
        { name: 'instagramAccount', value: null },
      ])
      .addArray('headline', [null])
      .addArray('message', [null])
      .addArray('linkDestination', [null])
      .addArray('linkCaption', [null])
      .addArray('linkDescription', [null])
      .addArray('callToAction', ['NO_BUTTON'])
      .addControl('picture', null)
      .addControl('leadgenFormId', null, true)
      .addControl('eventId', null, true).form;
  }

  public generateMultiVariateVideo(): FormGroup {
    return new AdTemplateFormBuilder(this.fb, SupportedProviders.FACEBOOK, this.asyncValidatorService)
      .addGroup('social', [
        { name: 'promotePage', value: null },
        { name: 'instagramAccount', value: null },
      ])
      .addArray('headline', [null])
      .addArray('message', [null])
      .addArray('linkDestination', [null])
      .addArray('linkCaption', [null])
      .addArray('linkDescription', [null])
      .addArray('callToAction', ['NO_BUTTON'])
      .addControl('video', null)
      .addControl('thumbnail', null)
      .addControl('leadgenFormId', null, true)
      .addControl('eventId', null, true).form;
  }

  public generateMultiVariateCarousel(): FormGroup {
    const newCarousel = new AdTemplateFormBuilder(this.fb, SupportedProviders.FACEBOOK, this.asyncValidatorService)
      .addGroup('social', [
        { name: 'promotePage', value: null },
        { name: 'instagramAccount', value: null },
      ])
      .addArray('message', [null])
      .addArray('linkDestination', [null])
      .addArray('linkCaption', [null])
      .addControl('multiShareOptimized', false)
      .addControl('multiShareEndCard', false)
      .addControl('leadgenFormId', null, true).form;

    newCarousel.addControl(
      'childAttachments',
      this.fb.array([], getFacebookAdTemplateFormValidators('childAttachments')),
    );

    this.addCarouselChild(newCarousel);
    this.addCarouselChild(newCarousel);

    return newCarousel;
  }

  private generateCarouselItem(): FormGroup {
    return new AdTemplateFormBuilder(this.fb, SupportedProviders.FACEBOOK, this.asyncValidatorService)
      .addControl('linkDestination', null)
      .addControl('linkCaption', null)
      .addControl('linkDescription', null)
      .addControl('headline', null)
      .addControl('callToAction', 'NO_BUTTON')
      .addControl('picture', null).form;
  }
}
