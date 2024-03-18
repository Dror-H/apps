import { AdAccountDisableReason, AdAccountStatusType, SupportedProviders } from '@instigo-app/data-transfer-object';
import { AdAccount } from '../data/ad-account.entity';
const UNKNOWN_REASON = 'Your ad account has been disabled due to an unknown reason';

export function getAdAccountStatusDescription(adAccount: AdAccount): {
  message: string;
  actionBtn: string;
  actionLink: string;
} {
  if (
    adAccount.disableReason === AdAccountDisableReason.NONE &&
    (adAccount.status === AdAccountStatusType.ACTIVE || adAccount.status === AdAccountStatusType.ANY_ACTIVE)
  ) {
    return null;
  }
  if (
    adAccount.status !== AdAccountStatusType.ACTIVE &&
    adAccount.provider === SupportedProviders.FACEBOOK &&
    adAccount.disableReason === AdAccountDisableReason.ADS_INTEGRITY_POLICY
  ) {
    return {
      message: `Your ad account has been disabled due to Facebook's advertising policy violation`,
      actionBtn: 'Request Review',
      actionLink: 'https://www.facebook.com/help/contact/2166173276743732',
    };
  }
  if (
    adAccount.status !== AdAccountStatusType.ACTIVE &&
    adAccount.provider === SupportedProviders.FACEBOOK &&
    adAccount.disableReason === AdAccountDisableReason.RISK_PAYMENT
  ) {
    return {
      message: 'Your ad account has been disabled due to a payment issue',
      actionBtn: 'View Payment Method',
      actionLink: `https://business.facebook.com/settings/payment-methods?business_id=${adAccount.businessId}`,
    };
  }
  if (
    adAccount.status !== AdAccountStatusType.ACTIVE &&
    adAccount.provider === SupportedProviders.FACEBOOK &&
    adAccount.disableReason === AdAccountDisableReason.UNUSED_ACCOUNT
  ) {
    return {
      message: 'Your ad account has been disabled due to account inactivity.',
      actionBtn: 'Read More',
      actionLink: 'https://www.facebook.com/help/250563911970368',
    };
  }
  if (adAccount.disableReason === AdAccountStatusType.UNSETTLED && adAccount.provider === SupportedProviders.FACEBOOK) {
    return {
      message: 'Your ad account has been disabled due to an unsettled payment',
      actionBtn: 'Pay on Facebook',
      actionLink: `https://business.facebook.com/settings/payment-methods?business_id=${adAccount.businessId}`,
    };
  }

  if (
    adAccount.disableReason === AdAccountStatusType.PENDING_RISK_REVIEW &&
    adAccount.provider === SupportedProviders.FACEBOOK
  ) {
    return {
      message:
        'Your ad account has been disabled and is being evaluated by the Facebook team due to repeated violations of their policies',
      actionBtn: 'Read More',
      actionLink: `https://www.facebook.com/policies/ads/`,
    };
  }

  if (
    adAccount.disableReason === AdAccountStatusType.PENDING_SETTLEMENT &&
    adAccount.provider === SupportedProviders.FACEBOOK
  ) {
    const adAccountIdPrefix = 'act_';
    return {
      message: 'Your ad account has been disabled until your unsettled payments are completed',
      actionBtn: 'Check Payment Status',
      actionLink: `https://business.facebook.com/ads/manager/billing_history/summary/?act=${adAccount?.providerId?.replace(
        adAccountIdPrefix,
        '',
      )}`,
    };
  }

  if (
    adAccount.disableReason === AdAccountStatusType.IN_GRACE_PERIOD &&
    adAccount.provider === SupportedProviders.FACEBOOK
  ) {
    return {
      message: 'Your ad account has been scheduled to be deleted and is currently in its grace period',
      actionBtn: 'Check Account Status',
      actionLink: `https://business.facebook.com/home/accounts?business_id=${adAccount.businessId}`,
    };
  }

  if (
    adAccount.disableReason === AdAccountStatusType.PENDING_CLOSURE &&
    adAccount.provider === SupportedProviders.FACEBOOK
  ) {
    return {
      message: 'Your ad account has been scheduled to be deleted',
      actionBtn: 'Check Deletion Status',
      actionLink: `https://business.facebook.com/home/accounts?business_id=${adAccount.businessId}`,
    };
  }

  if (adAccount.disableReason === AdAccountStatusType.CLOSED && adAccount.provider === SupportedProviders.FACEBOOK) {
    return {
      message: 'Your ad account has been closed and is unavailable for use with Instigo',
      actionBtn: 'How to reactivate',
      actionLink: 'https://www.facebook.com/business/help/1798922733589154',
    };
  }
  if (adAccount.status !== AdAccountStatusType.ACTIVE && adAccount.provider === SupportedProviders.FACEBOOK) {
    return {
      message: UNKNOWN_REASON,
      actionBtn: 'Contact Facebook Support',
      actionLink: 'https://business.facebook.com/business/help/support/get-help',
    };
  }

  if (
    adAccount.status === AdAccountStatusType.ACTIVE &&
    adAccount.disableReason !== AdAccountDisableReason.NONE &&
    adAccount.provider === SupportedProviders.LINKEDIN
  ) {
    return {
      message: UNKNOWN_REASON,
      actionBtn: 'Contact Linkedin Support',
      actionLink: 'https://www.linkedin.com/help/lms/topic/a3083?lang=en',
    };
  }

  if (adAccount.status !== AdAccountStatusType.ACTIVE && adAccount.provider === SupportedProviders.LINKEDIN) {
    return {
      message: UNKNOWN_REASON,
      actionBtn: 'Contact Linkedin Support',
      actionLink: 'https://www.linkedin.com/help/lms/topic/a3083?lang=en',
    };
  }

  return {
    message: UNKNOWN_REASON,
    actionBtn: 'Contact Instigo Support',
    actionLink: 'https://instigo.io/',
  };
}
