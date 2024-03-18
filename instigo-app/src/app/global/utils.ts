import { AbstractControl, FormGroup } from '@angular/forms';
import { DatePresetTypes } from '@app/global/constants';
import { requiredEachItemAndNoButtonValidator } from '@app/shared/shared/custom-form.validators';
import { AdTemplateType, SupportedProviders, User } from '@instigo-app/data-transfer-object';
import { endOfDay, endOfYear, setHours, setMinutes, subYears } from 'date-fns';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import startOfYear from 'date-fns/startOfYear';
import subDays from 'date-fns/subDays';
import { isFinite } from 'lodash-es';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';

export function versusMath(current, previous) {
  const diff = current - previous;
  const icon = Math.sign(diff) === -1 ? 'down' : 'up';
  const change = Math.round((Math.abs(diff) / previous) * 100);
  return {
    icon,
    change: !isFinite(change) ? '+' : change,
  };
}

export const datePresets = (currentDate: Date) => [
  {
    label: 'This Week',
    value: DatePresetTypes.this_week,
    range: {
      start: startOfWeek(currentDate, { weekStartsOn: 1 }),
      end: endOfDay(currentDate),
    },
  },
  {
    label: 'This Month',
    value: DatePresetTypes.this_month,
    range: {
      start: startOfMonth(currentDate),
      end: endOfDay(currentDate),
    },
  },
  {
    label: 'Last 7 Days',
    value: DatePresetTypes.last7Days,
    range: {
      start: subDays(currentDate, 7),
      end: endOfDay(currentDate),
    },
  },
  {
    label: 'Last 30 Days',
    value: DatePresetTypes.last30Days,
    range: {
      start: subDays(currentDate, 30),
      end: endOfDay(currentDate),
    },
  },
  {
    label: 'Last 90 Days',
    value: DatePresetTypes.last90Days,
    range: {
      start: subDays(currentDate, 90),
      end: endOfDay(currentDate),
    },
  },
  {
    label: 'This Year',
    value: DatePresetTypes.this_year,
    range: {
      start: startOfYear(currentDate),
      end: endOfDay(currentDate),
    },
  },
  {
    label: 'Last Year',
    value: DatePresetTypes.last_year,
    range: {
      start: startOfYear(subYears(currentDate, 1)),
      end: endOfYear(subYears(currentDate, 1)),
    },
  },
];

export const adTemplateTypes = [
  {
    name: 'Image',
    icon: 'far fa-images',
    value: AdTemplateType.IMAGE,
  },
  {
    name: 'Carousel',
    icon: 'fal fa-conveyor-belt-alt',
    value: AdTemplateType.CAROUSEL,
  },
  {
    name: 'Video',
    icon: 'far fa-video',
    value: AdTemplateType.VIDEO,
  },
];

export const campaignAdTemplateTypes = [
  {
    name: 'Image',
    icon: 'far fa-images',
    value: AdTemplateType.IMAGE,
  },
  {
    name: 'Carousel',
    icon: 'fal fa-conveyor-belt-alt',
    value: AdTemplateType.CAROUSEL,
  },
  {
    name: 'Video',
    icon: 'far fa-video',
    value: AdTemplateType.VIDEO,
  },
];

export const callToAction = {
  [SupportedProviders.FACEBOOK]: [
    'BOOK_TRAVEL',
    'CONTACT_US',
    'DONATE',
    'DONATE_NOW',
    'DOWNLOAD',
    'GET_DIRECTIONS',
    'GO_LIVE',
    'INTERESTED',
    'LEARN_MORE',
    'LIKE_PAGE',
    'MESSAGE_PAGE',
    'SAVE',
    'SEND_TIP',
    'SHOP_NOW',
    'SIGN_UP',
    'VIEW_INSTAGRAM_PROFILE',
    'INSTAGRAM_MESSAGE',
    'LOYALTY_LEARN_MORE',
    'PURCHASE_GIFT_CARDS',
    'PAY_TO_ACCESS',
    'GET_MOBILE_APP',
    'INSTALL_MOBILE_APP',
    'USE_MOBILE_APP',
    'INSTALL_APP',
    'USE_APP',
    'PLAY_GAME',
    'WATCH_VIDEO',
    'WATCH_MORE',
    'OPEN_LINK',
    'NO_BUTTON',
    'LISTEN_MUSIC',
    'MOBILE_DOWNLOAD',
    'GET_OFFER',
    'GET_OFFER_VIEW',
    'BUY_NOW',
    'BUY_TICKETS',
    'UPDATE_APP',
    'BET_NOW',
    'ADD_TO_CART',
    'ORDER_NOW',
    'SELL_NOW',
    'GET_SHOWTIMES',
    'LISTEN_NOW',
    'GET_EVENT_TICKETS',
    'SEARCH_MORE',
    'PRE_REGISTER',
    'CALL',
    'MISSED_CALL',
    'CALL_NOW',
    'CALL_ME',
    'APPLY_NOW',
    'BUY',
    'GET_QUOTE',
    'SUBSCRIBE',
    'RECORD_NOW',
    'VOTE_NOW',
    'GIVE_FREE_RIDES',
    'REGISTER_NOW',
    'OPEN_MESSENGER_EXT',
    'EVENT_RSVP',
    'CIVIC_ACTION',
    'SEND_INVITES',
    'REQUEST_TIME',
    'SEE_MENU',
    'WHATSAPP_MESSAGE',
    'SEARCH',
    'TRY_IT',
    'TRY_ON',
    'LINK_CARD',
    'DIAL_CODE',
    'FIND_YOUR_GROUP',
  ],
  [SupportedProviders.LINKEDIN]: [
    'NO_BUTTON',
    'APPLY_NOW',
    'DOWNLOAD',
    'GET_QUOTE',
    'LEARN_MORE',
    'SIGN_UP',
    'SUBSCRIBE',
    'REGISTER',
  ],
};

export const fbCtaByObjective = {
  BRAND_AWARENESS: [
    'APPLY_NOW',
    'BOOK_TRAVEL',
    'CONTACT_US',
    'DONATE_NOW',
    'GET_QUOTE',
    'GET_SHOWTIMES',
    'LEARN_MORE',
    'LISTEN_NOW',
    'REQUEST_TIME',
    'MESSAGE_PAGE',
    'WHATSAPP_MESSAGE',
    'SHOP_NOW',
    'SIGN_UP',
    'SUBSCRIBE',
    'WATCH_MORE',
  ],
  REACH: [
    'APPLY_NOW',
    'BOOK_TRAVEL',
    'CONTACT_US',
    'DONATE_NOW',
    'GET_DIRECTIONS',
    'GET_QUOTE',
    'GET_SHOWTIMES',
    'LEARN_MORE',
    'LISTEN_NOW',
    'REQUEST_TIME',
    'SAVE',
    'MESSAGE_PAGE',
    'WHATSAPP_MESSAGE',
    'SHOP_NOW',
    'SIGN_UP',
    'SUBSCRIBE',
    'WATCH_MORE',
  ],
  LINK_CLICKS: [
    'APPLY_NOW',
    'BOOK_TRAVEL',
    'CONTACT_US',
    'DONATE_NOW',
    'DOWNLOAD',
    'GET_OFFER',
    'GET_QUOTE',
    'GET_SHOWTIMES',
    'LEARN_MORE',
    'LISTEN_NOW',
    'REQUEST_TIME',
    'SHOP_NOW',
    'SIGN_UP',
    'SUBSCRIBE',
    'WATCH_MORE',
  ],
  POST_ENGAGEMENT: ['GET_QUOTE', 'LEARN_MORE', 'MESSAGE_PAGE', 'WHATSAPP_MESSAGE', 'SHOP_NOW'],
  PAGE_LIKES: ['LIKE_PAGE'],
  EVENT_RESPONSES: ['EVENT_RSVP'],
  APP_INSTALLS: [
    'BOOK_TRAVEL',
    'DONATE_NOW',
    'INSTALL_APP',
    'LEARN_MORE',
    'LISTEN_NOW',
    'PLAY_GAME',
    'SHOP_NOW',
    'SIGN_UP',
    'SUBSCRIBE',
    'USE_APP',
  ],
  VIDEO_VIEWS: [
    'BOOK_TRAVEL',
    'DONATE_NOW',
    'GET_QUOTE',
    'GET_SHOWTIMES',
    'LEARN_MORE',
    'LISTEN_NOW',
    'MESSAGE_PAGE',
    'WHATSAPP_MESSAGE',
    'SHOP_NOW',
    'SIGN_UP',
    'SUBSCRIBE',
  ],
  LEAD_GENERATION: ['APPLY_NOW', 'DOWNLOAD', 'GET_QUOTE', 'LEARN_MORE', 'SIGN_UP', 'SUBSCRIBE'],
  MESSAGES: [
    'APPLY_NOW',
    'BOOK_TRAVEL',
    'CONTACT_US',
    'DONATE_NOW',
    'GET_OFFER',
    'GET_QUOTE',
    'LEARN_MORE',
    'MESSAGE_PAGE',
    'SHOP_NOW',
    'SIGN_UP',
    'SUBSCRIBE',
  ],
  CONVERSIONS: [
    'APPLY_NOW',
    'BOOK_TRAVEL',
    'CONTACT_US',
    'DONATE_NOW',
    'DOWNLOAD',
    'GET_OFFER',
    'GET_QUOTE',
    'GET_SHOWTIMES',
    'LEARN_MORE',
    'LISTEN_NOW',
    'REQUEST_TIME',
    'SHOP_NOW',
    'SIGN_UP',
    'SUBSCRIBE',
    'WATCH_MORE',
  ],
  PRODUCT_CATALOG_SALES: [
    'BOOK_TRAVEL',
    'DONATE_NOW',
    'GET_SHOWTIMES',
    'LEARN_MORE',
    'LISTEN_NOW',
    'OPEN_LINK',
    'SHOP_NOW',
    'SIGN_UP',
    'SUBSCRIBE',
  ],
  STORE_VISITS: ['CALL_NOW', 'GET_DIRECTIONS', 'LEARN_MORE', 'ORDER_NOW', 'MESSAGE_PAGE', 'SHOP_NOW'],
};

export const adFormatOptionsList = {
  [SupportedProviders.FACEBOOK]: [
    'AUDIENCE_NETWORK_INSTREAM_VIDEO',
    'AUDIENCE_NETWORK_INSTREAM_VIDEO_MOBILE',
    'AUDIENCE_NETWORK_OUTSTREAM_VIDEO',
    'AUDIENCE_NETWORK_REWARDED_VIDEO',
    'DESKTOP_FEED_STANDARD',
    'FACEBOOK_STORY_MOBILE',
    'INSTAGRAM_EXPLORE_CONTEXTUAL',
    'INSTAGRAM_EXPLORE_IMMERSIVE',
    'INSTAGRAM_STANDARD',
    'INSTAGRAM_STORY',
    'INSTANT_ARTICLE_RECIRCULATION_AD',
    'INSTANT_ARTICLE_STANDARD',
    'INSTREAM_VIDEO_DESKTOP',
    'INSTREAM_VIDEO_IMAGE',
    'INSTREAM_VIDEO_MOBILE',
    'JOB_BROWSER_DESKTOP',
    'JOB_BROWSER_MOBILE',
    'MARKETPLACE_MOBILE',
    'MESSENGER_MOBILE_INBOX_MEDIA',
    'MESSENGER_MOBILE_STORY_MEDIA',
    'MOBILE_BANNER',
    'MOBILE_FEED_BASIC',
    'MOBILE_FEED_STANDARD',
    'MOBILE_FULLWIDTH',
    'MOBILE_INTERSTITIAL',
    'MOBILE_MEDIUM_RECTANGLE',
    'MOBILE_NATIVE',
    'RIGHT_COLUMN_STANDARD',
    'SUGGESTED_VIDEO_DESKTOP',
    'SUGGESTED_VIDEO_MOBILE',
    'WATCH_FEED_MOBILE',
  ],
  [SupportedProviders.LINKEDIN]: ['WEBCONVERSION_MOBILE', 'WEBCONVERSION_DESKTOP'],
};

export const getAdAccountsByProviderWholeObj = (adNetworks: any, provider: string): NzSelectOptionInterface[] =>
  adNetworks
    .filter((network) => network.value === provider)
    .map((item) =>
      item.adAccounts.map(
        (adAccount) =>
          ({
            label: adAccount.name,
            value: adAccount,
          } as NzSelectOptionInterface),
      ),
    )[0] || [];

export function concatTimeStringToDate(date: Date, time: string): Date {
  const splittedTime = time.split(':');
  date = setHours(date, parseInt(splittedTime[0]));
  date = setMinutes(date, parseInt(splittedTime[1]));
  return date;
}

export function getEngagementFields(insights) {
  if (insights && insights.actions) {
    return { postEngagements: insights.actions.find((v) => v.actionType === 'post_engagement')?.value || 0 };
  }
  return 0;
}

export function generateLookalikeAudienceName(
  item,
  index,
  lookalikesList,
  audienceName: string,
): { name: string; reach: string } {
  const countries = item.locationSpec.include.countries;
  const moreThan2Country =
    item.locationSpec.include.countries.length > 2
      ? `and ${item.locationSpec.include.countries.length - 2} others, `
      : '';
  const secondCountry = countries[1] ? `${countries[1]},` : '';
  const startingRatio = item.startingRatio === 0 ? '' : `${item.startingRatio * 100}% of`;
  return {
    reach: lookalikesList.reaches[index],
    name: `${audienceName} (${countries[0]}, ${secondCountry} ${moreThan2Country} ${startingRatio} ${
      item.ratio * 100
    }%)`,
  };
}

export function enableOrDisableMultivariateFields(
  multivariateForm: FormGroup,
  adType: AdTemplateType,
  campaignObjective: string,
) {
  const multivariateFormControls = multivariateForm.controls;

  Object.keys(multivariateFormControls).forEach((key) => {
    if (key !== 'adCombinations' && key !== 'adTemplateType') {
      if (key.toUpperCase() === adType) {
        handleCampaignObjective(campaignObjective, multivariateFormControls[key]);
      } else {
        multivariateFormControls[key].disable();
      }
    }
  });
}

export function handleCampaignObjective(campaignObjective: string, formGroup: AbstractControl): void {
  formGroup.enable();
  switch (campaignObjective) {
    case 'LEAD_GENERATION': {
      formGroup.get('linkDestination')?.disable();
      formGroup.get('eventId')?.disable();
      formGroup.get('leadgenFormId').enable();
      formGroup.get('callToAction')?.setValidators(requiredEachItemAndNoButtonValidator);
      break;
    }
    case 'EVENT_RESPONSES': {
      formGroup.get('eventId').enable();
      formGroup.get('message')?.enable();
      formGroup.get('headline')?.disable();
      formGroup.get('social.instagramAccount')?.disable();
      formGroup.get('linkDestination')?.disable();
      formGroup.get('linkCaption')?.disable();
      formGroup.get('linkDescription')?.disable();
      formGroup.get('callToAction')?.disable();
      formGroup.get('leadgenFormId')?.disable();
      break;
    }
    case 'PAGE_LIKES': {
      formGroup.get('social.instagramAccount')?.disable();
      formGroup.get('linkCaption')?.disable();
      formGroup.get('linkDescription')?.disable();
      formGroup.get('social.instagramAccount')?.disable();
      formGroup.get('callToAction')?.disable();
      formGroup.get('eventId')?.disable();
      formGroup.get('leadgenFormId')?.disable();
      break;
    }
    default: {
      formGroup.get('callToAction')?.clearValidators();
      formGroup.get('leadgenFormId')?.disable();
      formGroup.get('eventId')?.disable();
    }
  }
}

export function whenUsernameIsEmptyOrRockstarReturnEmail(user: User): string {
  return !user.fullName || user.fullName === 'Rockstar' ? user.email : user.fullName;
}

export const CAROUSEL_MAX_CHILDREN = 10;
export const AUDIENCE_PAGINATION_SIZE = 10;
export const HEADLINE_MAX_CHARS = 100;
