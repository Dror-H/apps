// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: 'localhost',
  production: false,
  frontendUrl: 'http://localhost:4200',
  websiteUrl: 'https://instigo.io',
  websiteKey: 'dgd55wuzoglpwvzov2v7cn8ohk78moeznlgri5jvpgr1j6efdvdlje2ufpgnwdzq',
  gAnalyticsKey: 'G-M1FCE9X3V6',
  stripeKey: 'pk_test_nTiB81WTHZkiKstTdvuuAp4e',
  prices: {
    month: 'price_1JhsLsKlYpB2IMP7IcF3IEjt',
    quarter: 'price_1JhsLtKlYpB2IMP7Ufu3zGRm',
    annual: 'price_1JhsLtKlYpB2IMP7wGk2ydUK',
  },
  features: {
    linkedinCampaign: true,
    linkedin: true,
    userback: false,
    customAudienceContainer: true,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// tslint:disable-next-line: no-commented-out-code
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
