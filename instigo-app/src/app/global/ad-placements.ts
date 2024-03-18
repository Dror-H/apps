import { SupportedProviders } from '@instigo-app/data-transfer-object';

export const allPlacements = {
  [SupportedProviders.FACEBOOK]: {
    facebook_positions: [
      {
        label: 'Facebook Feed',
        value: 'feed',
        type: 'Feed',
        availableOn: {
          desktop: 'DESKTOP_FEED_STANDARD',
          mobile: 'MOBILE_FEED_STANDARD',
        },
      },
      {
        label: 'Facebook Marketplace',
        value: 'marketplace',
        type: 'Feed',
        availableOn: {
          desktop: 'MARKETPLACE_DESKTOP',
          mobile: 'MARKETPLACE_MOBILE',
        },
        mustActivate: {
          condition: 'all',
          items: ['facebook_positions.feed'],
        },
      },
      {
        label: 'Facebook Video Feeds',
        value: 'video_feeds',
        type: 'Feed',
        availableOn: {
          desktop: 'SUGGESTED_VIDEO_DESKTOP',
          mobile: 'SUGGESTED_VIDEO_MOBILE',
        },
      },
      {
        label: 'Facebook Right Column',
        value: 'right_hand_column',
        type: 'Feed',
        availableOn: {
          desktop: 'RIGHT_COLUMN_STANDARD',
          mobile: false,
        },
      },
      {
        label: 'Facebook Stories',
        value: 'story',
        type: 'Story',
        availableOn: {
          desktop: false,
          mobile: 'FACEBOOK_STORY_MOBILE',
        },
        mustActivate: {
          condition: 'or',
          items: ['facebook_positions.feed', 'instagram.story'],
        },
      },
      {
        label: 'Facebook In-Stream Videos',
        value: 'instream_video',
        type: 'In-Stream',
        availableOn: {
          desktop: 'INSTREAM_VIDEO_DESKTOP',
          mobile: 'INSTREAM_VIDEO_MOBILE',
        },
      },
      {
        label: 'Facebook Instant Article',
        value: 'instant_article',
        type: 'In-Article',
        availableOn: {
          desktop: false,
          mobile: 'INSTANT_ARTICLE_STANDARD',
        },
        mustActivate: {
          condition: 'all',
          items: ['facebook_positions.feed'],
        },
      },
    ],
    instagram_positions: [
      {
        label: 'Instagram Feed',
        value: 'stream',
        type: 'Feed',
        availableOn: {
          desktop: false,
          mobile: 'INSTAGRAM_STANDARD',
        },
      },
      {
        label: 'Instagram Stories',
        value: 'story',
        type: 'Story',
        availableOn: {
          desktop: false,
          mobile: 'INSTAGRAM_STORY',
        },
      },
      {
        label: 'Instagram Explore',
        value: 'explore',
        type: 'feed',
        availableOn: {
          desktop: false,
          mobile: 'INSTAGRAM_EXPLORE_CONTEXTUAL',
        },
      },
    ],
    audience_network_positions: [
      {
        label: 'Audience Network Classic',
        value: 'classic',
        type: 'Apps and Sites',
        availableOn: {
          desktop: false,
          mobile: 'INSTAGRAM_EXPLORE_CONTEXTUAL',
        },
      },
      {
        label: 'Audience Network In-Stream Videos',
        value: 'instream_video',
        type: 'Apps and Sites',
        availableOn: {
          desktop: 'AUDIENCE_NETWORK_INSTREAM_VIDEO',
          mobile: 'AUDIENCE_NETWORK_INSTREAM_VIDEO_MOBILE',
        },
      },
      {
        label: 'Audience Network Rewarded Videos',
        value: 'rewarded_video',
        type: 'Apps and Sites',
        availableOn: {
          desktop: false,
          mobile: 'AUDIENCE_NETWORK_REWARDED_VIDEO',
        },
      },
    ],
    messenger_positions: [
      {
        label: 'Messenger Inbox',
        value: 'messenger_home',
        type: 'Feed',
        availableOn: {
          desktop: false,
          mobile: 'MESSENGER_MOBILE_INBOX_MEDIA',
        },
        mustActivate: {
          condition: 'all',
          items: 'facebook_positions.feed',
        },
      },
      // {
      //   label: 'Messenger Sponsored Messages',
      //   value: 'sponsored_messages',
      //   type: 'Messages',
      //   availableOn: {
      //     desktop: false,
      //     mobile: 'INSTAGRAM_EXPLORE_CONTEXTUAL',
      //   },
      // },
      {
        label: 'Messenger Stories',
        value: 'story',
        type: 'Story',
        availableOn: {
          desktop: false,
          mobile: 'MESSENGER_MOBILE_STORY_MEDIA',
        },
        mustActivate: {
          condition: 'or',
          items: ['facebook_positions.feed', 'instagram_positions.story'],
        },
      },
    ],
  },
};

export const placementTypes = {
  [SupportedProviders.FACEBOOK]: [
    'Feed',
    'Story',
    'In-Stream',
    // 'Search',
    // 'Messages',
    'In-Article',
    'Apps and Sites',
  ],
};
