import { mockAdAccount } from '@instigo-app/api-shared';
import { getAdAccountStatusDescription } from './ad-account-status-description';
import 'jest-extended';
import { AdAccountDisableReason, AdAccountStatusType, SupportedProviders } from '@instigo-app/data-transfer-object';

describe('GetAdAccountStatusDescription', () => {
  it('should be valid', () => {
    const account: any = mockAdAccount({ no: 1 })[0];
    const response = getAdAccountStatusDescription({
      ...account,
      status: AdAccountStatusType.ACTIVE,
      disableReason: AdAccountDisableReason.NONE,
    });
    expect(response).toBeNull;
  });
  it('should be invalid due to ADS_INTEGRITY_POLICY', () => {
    const account: any = mockAdAccount({ no: 1 })[0];
    const response = getAdAccountStatusDescription({
      ...account,
      status: AdAccountStatusType.CLOSED,
      provider: SupportedProviders.FACEBOOK,
      disableReason: AdAccountDisableReason.ADS_INTEGRITY_POLICY,
    });
    expect(response).toBeObject();
    expect(response).toContainEntry([
      'message',
      `Your ad account has been disabled due to Facebook's advertising policy violation`,
    ]);
    expect(response).toContainEntry(['actionBtn', 'Request Review']);
    expect(response).toContainEntry(['actionLink', 'https://www.facebook.com/help/contact/2166173276743732']);
  });

  it('should be invalid due to RISK_PAYMENT', () => {
    const account: any = mockAdAccount({ no: 1 })[0];
    const response = getAdAccountStatusDescription({
      ...account,
      status: AdAccountStatusType.CLOSED,
      provider: SupportedProviders.FACEBOOK,
      disableReason: AdAccountDisableReason.RISK_PAYMENT,
    });
    expect(response).toBeObject();
    expect(response).toContainEntry(['message', `Your ad account has been disabled due to a payment issue`]);
    expect(response).toContainEntry(['actionBtn', 'View Payment Method']);
    expect(response).toContainEntry([
      'actionLink',
      `https://business.facebook.com/settings/payment-methods?business_id=${account.businessId}`,
    ]);
  });

  it('should be invalid due to UNUSED_ACCOUNT', () => {
    const account: any = mockAdAccount({ no: 1 })[0];
    const response = getAdAccountStatusDescription({
      ...account,
      status: AdAccountStatusType.PENDING_CLOSURE,
      provider: SupportedProviders.FACEBOOK,
      disableReason: AdAccountDisableReason.UNUSED_ACCOUNT,
    });
    expect(response).toBeObject();
    expect(response).toContainEntry(['message', `Your ad account has been disabled due to account inactivity.`]);
    expect(response).toContainEntry(['actionBtn', 'Read More']);
    expect(response).toContainEntry(['actionLink', `https://www.facebook.com/help/250563911970368`]);
  });

  it('should be invalid due to UNSETTLED', () => {
    const account: any = mockAdAccount({ no: 1 })[0];
    const response = getAdAccountStatusDescription({
      ...account,
      provider: SupportedProviders.FACEBOOK,
      disableReason: AdAccountStatusType.UNSETTLED,
    });
    expect(response).toBeObject();
    expect(response).toContainEntry(['message', `Your ad account has been disabled due to an unsettled payment`]);
    expect(response).toContainEntry(['actionBtn', 'Pay on Facebook']);
    expect(response).toContainEntry([
      'actionLink',
      `https://business.facebook.com/settings/payment-methods?business_id=${account.businessId}`,
    ]);
  });

  it('should be invalid due to PENDING_RISK_REVIEW', () => {
    const account: any = mockAdAccount({ no: 1 })[0];
    const response = getAdAccountStatusDescription({
      ...account,
      provider: SupportedProviders.FACEBOOK,
      disableReason: AdAccountStatusType.PENDING_RISK_REVIEW,
    });
    expect(response).toBeObject();
    expect(response).toContainEntry([
      'message',
      'Your ad account has been disabled and is being evaluated by the Facebook team due to repeated violations of their policies',
    ]);
    expect(response).toContainEntry(['actionBtn', 'Read More']);
    expect(response).toContainEntry(['actionLink', `https://www.facebook.com/policies/ads/`]);
  });

  it('should be invalid due to PENDING_SETTLEMENT', () => {
    const account: any = mockAdAccount({ no: 1 })[0];
    const response = getAdAccountStatusDescription({
      ...account,
      provider: SupportedProviders.FACEBOOK,
      disableReason: AdAccountStatusType.PENDING_SETTLEMENT,
    });
    expect(response).toBeObject();
    expect(response).toContainEntry([
      'message',
      'Your ad account has been disabled until your unsettled payments are completed',
    ]);
    expect(response).toContainEntry(['actionBtn', 'Check Payment Status']);
    expect(response).toContainEntry([
      'actionLink',
      `https://business.facebook.com/ads/manager/billing_history/summary/?act=${account.providerId.replace(
        'act_',
        '',
      )}`,
    ]);
  });

  it('should be invalid due to IN_GRACE_PERIOD', () => {
    const account: any = mockAdAccount({ no: 1 })[0];
    const response = getAdAccountStatusDescription({
      ...account,
      provider: SupportedProviders.FACEBOOK,
      disableReason: AdAccountStatusType.IN_GRACE_PERIOD,
    });
    expect(response).toBeObject();
    expect(response).toContainEntry([
      'message',
      'Your ad account has been scheduled to be deleted and is currently in its grace period',
    ]);
    expect(response).toContainEntry(['actionBtn', 'Check Account Status']);
    expect(response).toContainEntry([
      'actionLink',
      `https://business.facebook.com/home/accounts?business_id=${account.businessId}`,
    ]);
  });

  it('should be invalid due to PENDING_CLOSURE', () => {
    const account: any = mockAdAccount({ no: 1 })[0];
    const response = getAdAccountStatusDescription({
      ...account,
      provider: SupportedProviders.FACEBOOK,
      disableReason: AdAccountStatusType.PENDING_CLOSURE,
    });
    expect(response).toBeObject();
    expect(response).toContainEntry(['message', 'Your ad account has been scheduled to be deleted']);
    expect(response).toContainEntry(['actionBtn', 'Check Deletion Status']);
    expect(response).toContainEntry([
      'actionLink',
      `https://business.facebook.com/home/accounts?business_id=${account.businessId}`,
    ]);
  });

  it('should be invalid missing facebook unknown', () => {
    const account: any = mockAdAccount({ no: 1 })[0];
    const response = getAdAccountStatusDescription({
      ...account,
      provider: SupportedProviders.FACEBOOK,
      status: AdAccountStatusType.CLOSED,
    });
    expect(response).toBeObject();
    expect(response).toContainEntry(['actionBtn', 'Contact Facebook Support']);
    expect(response).toContainEntry(['actionLink', 'https://business.facebook.com/business/help/support/get-help']);
    expect(response).toContainEntry(['message', 'Your ad account has been disabled due to an unknown reason']);
  });
});
