import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { AdPreviewPlacementComponent } from '@app/pages/new-campaign/facebook-new-campaign/components/creatives-settings/create-new-variations/ad-preview-carousel/multivariate-ad-preview-placement/ad-preview-placement.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

const adSetFormat = [
  {
    value: 'feed',
    platform: 'facebook_positions',
  },
  {
    value: 'marketplace',
    platform: 'facebook_positions',
  },
  {
    value: 'video_feeds',
    platform: 'facebook_positions',
  },
  {
    value: 'right_hand_column',
    platform: 'facebook_positions',
  },
  {
    value: 'stream',
    platform: 'instagram_positions',
  },
  {
    value: 'messenger_home',
    platform: 'messenger_positions',
  },
  {
    value: 'story',
    platform: 'facebook_positions',
  },
  {
    value: 'story',
    platform: 'messenger_positions',
  },
  {
    value: 'instream_video',
    platform: 'facebook_positions',
  },
  {
    value: 'instant_article',
    platform: 'facebook_positions',
  },
  {
    value: 'classic',
    platform: 'audience_network_positions',
  },
  {
    value: 'instream_video',
    platform: 'audience_network_positions',
  },
  {
    value: 'rewarded_video',
    platform: 'audience_network_positions',
  },
];

describe('AdPreviewPlacementComponent', () => {
  let fixture: ComponentFixture<AdPreviewPlacementComponent>;
  let component: AdPreviewPlacementComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdPreviewPlacementComponent],
      imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NzCardModule,
        NzButtonModule,
        NzGridModule,
        NzCheckboxModule,
        NzCollapseModule,
        NzSwitchModule,
        NzFormModule,
        NzToolTipModule,
      ],
    });

    fixture = TestBed.createComponent(AdPreviewPlacementComponent);
    component = fixture.componentInstance;
    component.instagramAccountControl = new FormControl(null);
    component.adSetFormat = adSetFormat;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should toggle Ad-Format', () => {
    const updateValueSpy = jest.spyOn(component as any, 'updateValue');
    const event = new MouseEvent('click');
    component.toggleAdFormat(event, {
      label: 'Facebook Feed',
      value: {
        label: 'Facebook Feed',
        value: 'feed',
        type: 'Feed',
        availableOn: {
          desktop: 'DESKTOP_FEED_STANDARD',
          mobile: 'MOBILE_FEED_STANDARD',
        },
      },
      platform: 'facebook_positions',
      checked: false,
      disabled: false,
    });
    expect(updateValueSpy).toHaveBeenCalledWith([
      {
        platform: 'facebook_positions',
        value: 'feed',
      },
      {
        platform: 'facebook_positions',
        value: 'marketplace',
      },
      {
        platform: 'facebook_positions',
        value: 'video_feeds',
      },
      {
        platform: 'facebook_positions',
        value: 'right_hand_column',
      },
      {
        platform: 'messenger_positions',
        value: 'messenger_home',
      },
      {
        platform: 'facebook_positions',
        value: 'story',
      },
      {
        platform: 'messenger_positions',
        value: 'story',
      },
      {
        platform: 'facebook_positions',
        value: 'instream_video',
      },
      {
        platform: 'facebook_positions',
        value: 'instant_article',
      },
      {
        platform: 'audience_network_positions',
        value: 'classic',
      },
      {
        platform: 'audience_network_positions',
        value: 'instream_video',
      },
      {
        platform: 'audience_network_positions',
        value: 'rewarded_video',
      },
    ]);
  });

  it('should toggle all in subCategory', () => {
    const updateValueSpy = jest.spyOn(component as any, 'updateValue');
    const event = new MouseEvent('click');
    component.toggleAllInSubCategory(event, { label: 'Feed', value: true });

    expect(updateValueSpy).toHaveBeenCalledWith([
      {
        platform: 'facebook_positions',
        value: 'story',
      },
      { platform: 'messenger_positions', value: 'story' },
      {
        platform: 'facebook_positions',
        value: 'instream_video',
      },
      { platform: 'facebook_positions', value: 'instant_article' },
      {
        platform: 'audience_network_positions',
        value: 'classic',
      },
      {
        platform: 'audience_network_positions',
        value: 'instream_video',
      },
      { platform: 'audience_network_positions', value: 'rewarded_video' },
    ]);
  });

  it('should disable all formats on specific devices', () => {
    (component as any).disableAllAdFormatsOnSpecificDevice({ desktop: true, mobile: false });
    expect(component.adTemplateOptions).toEqual({
      'Apps and Sites': [
        {
          checked: false,
          disabled: true,
          label: 'Audience Network Classic',
          platform: 'audience_network_positions',
          value: {
            availableOn: {
              desktop: false,
              mobile: 'INSTAGRAM_EXPLORE_CONTEXTUAL',
            },
            label: 'Audience Network Classic',
            type: 'Apps and Sites',
            value: 'classic',
          },
        },
        {
          checked: false,
          disabled: true,
          label: 'Audience Network In-Stream Videos',
          platform: 'audience_network_positions',
          value: {
            availableOn: {
              desktop: 'AUDIENCE_NETWORK_INSTREAM_VIDEO',
              mobile: 'AUDIENCE_NETWORK_INSTREAM_VIDEO_MOBILE',
            },
            label: 'Audience Network In-Stream Videos',
            type: 'Apps and Sites',
            value: 'instream_video',
          },
        },
        {
          checked: false,
          disabled: true,
          label: 'Audience Network Rewarded Videos',
          platform: 'audience_network_positions',
          value: {
            availableOn: {
              desktop: false,
              mobile: 'AUDIENCE_NETWORK_REWARDED_VIDEO',
            },
            label: 'Audience Network Rewarded Videos',
            type: 'Apps and Sites',
            value: 'rewarded_video',
          },
        },
      ],
      Feed: [
        {
          checked: true,
          disabled: false,
          label: 'Facebook Feed',
          platform: 'facebook_positions',
          value: {
            availableOn: {
              desktop: 'DESKTOP_FEED_STANDARD',
              mobile: 'MOBILE_FEED_STANDARD',
            },
            label: 'Facebook Feed',
            type: 'Feed',
            value: 'feed',
          },
        },
        {
          checked: true,
          disabled: false,
          label: 'Facebook Marketplace',
          platform: 'facebook_positions',
          value: {
            availableOn: {
              desktop: 'MARKETPLACE_DESKTOP',
              mobile: 'MARKETPLACE_MOBILE',
            },
            label: 'Facebook Marketplace',
            mustActivate: {
              condition: 'all',
              items: ['facebook_positions.feed'],
            },
            type: 'Feed',
            value: 'marketplace',
          },
        },
        {
          checked: true,
          disabled: false,
          label: 'Facebook Video Feeds',
          platform: 'facebook_positions',
          value: {
            availableOn: {
              desktop: 'SUGGESTED_VIDEO_DESKTOP',
              mobile: 'SUGGESTED_VIDEO_MOBILE',
            },
            label: 'Facebook Video Feeds',
            type: 'Feed',
            value: 'video_feeds',
          },
        },
        {
          checked: true,
          disabled: false,
          label: 'Facebook Right Column',
          platform: 'facebook_positions',
          value: {
            availableOn: {
              desktop: 'RIGHT_COLUMN_STANDARD',
              mobile: false,
            },
            label: 'Facebook Right Column',
            type: 'Feed',
            value: 'right_hand_column',
          },
        },
        {
          checked: false,
          disabled: true,
          label: 'Instagram Feed',
          platform: 'instagram_positions',
          value: {
            availableOn: {
              desktop: false,
              mobile: 'INSTAGRAM_STANDARD',
            },
            label: 'Instagram Feed',
            type: 'Feed',
            value: 'stream',
          },
        },
        {
          checked: false,
          disabled: true,
          label: 'Messenger Inbox',
          platform: 'messenger_positions',
          value: {
            availableOn: {
              desktop: false,
              mobile: 'MESSENGER_MOBILE_INBOX_MEDIA',
            },
            label: 'Messenger Inbox',
            mustActivate: {
              condition: 'all',
              items: 'facebook_positions.feed',
            },
            type: 'Feed',
            value: 'messenger_home',
          },
        },
      ],
      'In-Article': [
        {
          checked: false,
          disabled: true,
          label: 'Facebook Instant Article',
          platform: 'facebook_positions',
          value: {
            availableOn: {
              desktop: false,
              mobile: 'INSTANT_ARTICLE_STANDARD',
            },
            label: 'Facebook Instant Article',
            mustActivate: {
              condition: 'all',
              items: ['facebook_positions.feed'],
            },
            type: 'In-Article',
            value: 'instant_article',
          },
        },
      ],
      'In-Stream': [
        {
          checked: true,
          disabled: false,
          label: 'Facebook In-Stream Videos',
          platform: 'facebook_positions',
          value: {
            availableOn: {
              desktop: 'INSTREAM_VIDEO_DESKTOP',
              mobile: 'INSTREAM_VIDEO_MOBILE',
            },
            label: 'Facebook In-Stream Videos',
            type: 'In-Stream',
            value: 'instream_video',
          },
        },
      ],
      Story: [
        {
          checked: false,
          disabled: true,
          label: 'Facebook Stories',
          platform: 'facebook_positions',
          value: {
            availableOn: {
              desktop: false,
              mobile: 'FACEBOOK_STORY_MOBILE',
            },
            label: 'Facebook Stories',
            mustActivate: {
              condition: 'or',
              items: ['facebook_positions.feed', 'instagram.story'],
            },
            type: 'Story',
            value: 'story',
          },
        },
        {
          checked: false,
          disabled: true,
          label: 'Instagram Stories',
          platform: 'instagram_positions',
          value: {
            availableOn: {
              desktop: false,
              mobile: 'INSTAGRAM_STORY',
            },
            label: 'Instagram Stories',
            type: 'Story',
            value: 'story',
          },
        },
        {
          checked: false,
          disabled: true,
          label: 'Messenger Stories',
          platform: 'messenger_positions',
          value: {
            availableOn: {
              desktop: false,
              mobile: 'MESSENGER_MOBILE_STORY_MEDIA',
            },
            label: 'Messenger Stories',
            mustActivate: {
              condition: 'or',
              items: ['facebook_positions.feed', 'instagram_positions.story'],
            },
            type: 'Story',
            value: 'story',
          },
        },
      ],
    });
  });
});
