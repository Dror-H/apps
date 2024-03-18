import { FacebookTargetingExportSerializer } from '@audiences-api/targeting/targeting-export/facebook-targeting-export-serializer';
import { AdAccountDTO, SupportedProviders, TargetingDto } from '@instigo-app/data-transfer-object';

const adAccount = {
  providerId: 'providerId',
  name: 'test-ad account',
  status: 'ACTIVE',
  currency: 'EUR',
  businessId: 'businessId',
  businessName: 'some business name',
  businessProfilePicture: 'string',
  provider: SupportedProviders.FACEBOOK,
  businessCity: 'string',
  businessStreet: 'string',
  businessStreet2: 'string',
  businessZip: 'string',
  businessCountryCode: 'string',
  timezoneId: 'string',
  timezoneName: 'string',
  timezoneOffsetHoursUtc: 'string',
  accessToken: 'string',
  totalAmountSpent: 'string',
  disableReason: 'string',
  adAccountStatusDescription: 'any',
} as AdAccountDTO;

describe('FacebookTargetingExportSerializer', () => {
  it('should serialize the campaign', () => {
    const campaign = new FacebookTargetingExportSerializer(
      'Audience Name',
      adAccount,
      {} as TargetingDto,
    ).serializeCampaignObject();
    expect(campaign).toMatchSnapshot();
  });

  it('should create the adSet', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const adSet = new FacebookTargetingExportSerializer(
      'Audience Name',
      adAccount,
      {} as TargetingDto,
    ).serializeAdSetCreationObject();
    expect(adSet).toMatchSnapshot();
  });
});
