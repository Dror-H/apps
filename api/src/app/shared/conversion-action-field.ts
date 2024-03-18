// Get conversion action string by processed values
export function getConversionAction(campaignObjective, optimizationGoal, promObjValue, isPixel): string {
  // Exceptions: 10_seconds_video_views (deprecated - use thruplay)
  // https://www.socialmediatoday.com/news/facebook-announces-changes-to-ad-metrics-including-removal-of-10-second-vi/566382/
  // TODO need to figure out what to do in cases of campaigns like 6082827856677 that has "10-Second Video View" as the conversion type
  let output = '';
  output += isPixel ? 'offsite_conversion.fb_pixel_' : '';
  output +=
    optimizationGoal === 'LANDING_PAGE_VIEWS'
      ? 'landing_page_view'
      : optimizationGoal === 'VIDEO_VIEWS'
      ? 'video_view'
      : optimizationGoal === 'LANDING_PAGE_VIEWS'
      ? 'landing_page_view'
      : campaignObjective === 'LINK_CLICKS' && optimizationGoal === 'LINK_CLICKS'
      ? 'link_click'
      : campaignObjective === 'LINK_CLICKS' && optimizationGoal === 'REACH'
      ? 'link_click'
      : campaignObjective === 'MESSAGES' && optimizationGoal === 'CONVERSATIONS'
      ? 'onsite_conversion.messaging_conversation_started_7d'
      : campaignObjective === 'CONVERSIONS' && optimizationGoal === 'OFFSITE_CONVERSIONS'
      ? promObjValue.toLowerCase()
      : campaignObjective === 'LEAD_GENERATION' && optimizationGoal === 'LEAD_GENERATION'
      ? 'onsite_conversion.lead_grouped'
      : campaignObjective === 'PAGE_LIKES'
      ? 'like'
      : campaignObjective === 'POST_ENGAGEMENT' && optimizationGoal === 'POST_ENGAGEMENT'
      ? 'post_engagement'
      : '';
  return output;
}
