import 'package:flutter_test/flutter_test.dart';
import 'package:instigo_mobile/model/user.dart';

var jsonUser = {
  "id": "92af6cc7-93dd-4464-b0ad-66f5d574a4e4",
  "username": "radulescu",
  "firstName": "Andy",
  "lastName": "Radulescu",
  "email": "radulescu.eduard.andrei@gmail.com",
  "phone": null,
  "isActive": true,
  "createdAt": "2021-05-25T07:51:54.878Z",
  "updatedAt": "2021-11-04T08:55:46.359Z",
  "version": 59,
  "emailVerification": false,
  "onboarding": {"completed": true},
  "roles": ["USER"],
  "settings": {"defaultWorkspace": "89b25a4d-6349-4bab-b4e6-68e70460321b"},
  "stripeCustomerId": "cus_KOAx1ucEmZEs8y",
  "stripeSubscriptionId": "sub_1JjOcYKlYpB2IMP7D34N4gtp",
  "subscriptionStatus": true,
  "pictureUrl":
      "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3618204534897864&height=50&width=50&ext=1624521114&hash=AeQYFoSUEXAzb6nQOZk",
  "billing": {
    "firstName": "Bogdan",
    "lastName": "Lupu",
    "address": "Hofzeile 18-20",
    "zipCode": "1190",
    "country": "Austria",
    "vatNumber": "ATU72152225",
    "type": "company",
    "companyName": "WeAreDevelopers GmbH"
  },
  "fullName": "Andy Radulescu",
  "ownedWorkspace": [
    {
      "id": "89b25a4d-6349-4bab-b4e6-68e70460321b",
      "createdAt": "2021-05-25T07:53:25.402Z",
      "updatedAt": "2021-11-18T03:00:17.702Z",
      "version": 198,
      "name": "workspace",
      "description": "workspace",
      "disabled": false,
      "settings": {"defaultCurrency": "USD"},
      "lastSynced": "2021-11-18T03:00:17.702Z",
      "adAccounts": [
        {
          "id": "07968f6e-9536-481a-a78e-84bdfa0b7192",
          "createdAt": "2018-09-08T11:23:33.000Z",
          "updatedAt": "2021-11-18T03:00:17.459Z",
          "version": 31,
          "name": "Insticore's Ad Account",
          "provider": "linkedin",
          "providerId": "506319907",
          "status": "ACTIVE",
          "disableReason": "NONE",
          "totalAmountSpent": null,
          "currency": "EUR",
          "businessId": "33273977",
          "businessName": "Insticore ",
          "businessProfilePicture":
              "https://media-exp1.licdn.com/dms/image/C4E0BAQEGdvwt79PwkA/company-logo_200_200/0/1573658772269?e=1642636800&v=beta&t=VWVNSS_a8AEgpYUuo-MqXHKllPbfKUCg7_phcYYTink",
          "providerMetadata": null,
          "businessCity": "Vienna",
          "businessStreet": "Hofzeile 18-20",
          "businessStreet2": null,
          "businessZip": "1190",
          "businessCountryCode": "AT",
          "timezoneId": null,
          "timezoneName": null,
          "timezoneOffsetHoursUtc": null,
          "minDailyBudget": null,
          "lastSynced": "2021-11-18T03:00:17.067Z"
        },
        {
          "id": "dc33c9f2-c946-42f9-a4de-9d00de818917",
          "createdAt": "2019-02-14T19:14:49.000Z",
          "updatedAt": "2021-11-18T11:00:21.323Z",
          "version": 8018,
          "name": "Andy Radulescu",
          "provider": "facebook",
          "providerId": "act_2337848699781284",
          "status": "ACTIVE",
          "disableReason": "NONE",
          "totalAmountSpent": "0.00",
          "currency": "RON",
          "businessId": "act_2337848699781284",
          "businessName": "Andy Radulescu",
          "businessProfilePicture": "",
          "providerMetadata": null,
          "businessCity": "",
          "businessStreet": "",
          "businessStreet2": "",
          "businessZip": null,
          "businessCountryCode": null,
          "timezoneId": "12",
          "timezoneName": "Europe/Vienna",
          "timezoneOffsetHoursUtc": 1,
          "minDailyBudget": {
            "minDailyBudgetImp": 442,
            "minDailyBudgetLowFreq": 8836,
            "minDailyBudgetHighFreq": 1105,
            "minDailyBudgetVideoViews": 442
          },
          "lastSynced": "2021-11-18T11:00:15.392Z"
        }
      ]
    }
  ],
  "assignedWorkspaces": [
    {
      "id": "89b25a4d-6349-4bab-b4e6-68e70460321b",
      "createdAt": "2021-05-25T07:53:25.402Z",
      "updatedAt": "2021-11-18T03:00:17.702Z",
      "version": 198,
      "name": "workspace",
      "description": "workspace",
      "disabled": false,
      "settings": {"defaultCurrency": "USD"},
      "lastSynced": "2021-11-18T03:00:17.702Z",
      "adAccounts": [
        {
          "id": "07968f6e-9536-481a-a78e-84bdfa0b7192",
          "createdAt": "2018-09-08T11:23:33.000Z",
          "updatedAt": "2021-11-18T03:00:17.459Z",
          "version": 31,
          "name": "Insticore's Ad Account",
          "provider": "linkedin",
          "providerId": "506319907",
          "status": "ACTIVE",
          "disableReason": "NONE",
          "totalAmountSpent": null,
          "currency": "EUR",
          "businessId": "33273977",
          "businessName": "Insticore ",
          "businessProfilePicture":
              "https://media-exp1.licdn.com/dms/image/C4E0BAQEGdvwt79PwkA/company-logo_200_200/0/1573658772269?e=1642636800&v=beta&t=VWVNSS_a8AEgpYUuo-MqXHKllPbfKUCg7_phcYYTink",
          "providerMetadata": null,
          "businessCity": "Vienna",
          "businessStreet": "Hofzeile 18-20",
          "businessStreet2": null,
          "businessZip": "1190",
          "businessCountryCode": "AT",
          "timezoneId": null,
          "timezoneName": null,
          "timezoneOffsetHoursUtc": null,
          "minDailyBudget": null,
          "lastSynced": "2021-11-18T03:00:17.067Z",
          "pages": []
        },
        {
          "id": "dc33c9f2-c946-42f9-a4de-9d00de818917",
          "createdAt": "2019-02-14T19:14:49.000Z",
          "updatedAt": "2021-11-18T11:00:21.323Z",
          "version": 8018,
          "name": "Andy Radulescu",
          "provider": "facebook",
          "providerId": "act_2337848699781284",
          "status": "ACTIVE",
          "disableReason": "NONE",
          "totalAmountSpent": "0.00",
          "currency": "RON",
          "businessId": "act_2337848699781284",
          "businessName": "Andy Radulescu",
          "businessProfilePicture": "",
          "providerMetadata": null,
          "businessCity": "",
          "businessStreet": "",
          "businessStreet2": "",
          "businessZip": null,
          "businessCountryCode": null,
          "timezoneId": "12",
          "timezoneName": "Europe/Vienna",
          "timezoneOffsetHoursUtc": 1,
          "minDailyBudget": {
            "minDailyBudgetImp": 442,
            "minDailyBudgetLowFreq": 8836,
            "minDailyBudgetHighFreq": 1105,
            "minDailyBudgetVideoViews": 442
          },
          "lastSynced": "2021-11-18T11:00:15.392Z",
          "pages": []
        }
      ],
      "members": [
        {
          "id": "92af6cc7-93dd-4464-b0ad-66f5d574a4e4",
          "firstName": "Andy",
          "lastName": "Radulescu",
          "email": "radulescu.eduard.andrei@gmail.com",
          "createdAt": "2021-05-25T07:51:54.878Z",
          "fullName": "Andy Radulescu"
        }
      ],
      "owner": {
        "id": "92af6cc7-93dd-4464-b0ad-66f5d574a4e4",
        "firstName": "Andy",
        "lastName": "Radulescu",
        "email": "radulescu.eduard.andrei@gmail.com",
        "createdAt": "2021-05-25T07:51:54.878Z",
        "updatedAt": "2021-11-04T08:55:46.359Z",
        "subscriptionStatus": true,
        "fullName": "Andy Radulescu"
      }
    }
  ],
};

String expectedUserToString ="User{id: 92af6cc7-93dd-4464-b0ad-66f5d574a4e4, username: radulescu, firstName: Andy, lastName: Radulescu, fullName: Andy Radulescu, email: radulescu.eduard.andrei@gmail.com, phone: null, isActive: true, createdAt: 2021-05-25 07:51:54.878Z, updatedAt: 2021-11-04 08:55:46.359Z, version: 59, emailVerification: false, pictureUrl: https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3618204534897864&height=50&width=50&ext=1624521114&hash=AeQYFoSUEXAzb6nQOZk, onboarding: {completed: true}, roles: [USER], stripeCustomerId: cus_KOAx1ucEmZEs8y, stripeSubscriptionId: sub_1JjOcYKlYpB2IMP7D34N4gtp, subscriptionStatus: true, billing: BillingInformation{firstName: Bogdan, lastName: Lupu, address: Hofzeile 18-20, zipCode: 1190, country: Austria, vatNumber: ATU72152225, type: company, companyName: WeAreDevelopers GmbH}, settings: WorkspaceSettings{defaultWorkspace: 89b25a4d-6349-4bab-b4e6-68e70460321b, defaultCurrency: null}, ownedWorkspaces: [Workspace{id: 89b25a4d-6349-4bab-b4e6-68e70460321b, createdAt: 2021-05-25 07:53:25.402Z, updatedAt: 2021-11-18 03:00:17.702Z, version: 198, name: workspace, description: workspace, disabled: false, settings: WorkspaceSettings{defaultWorkspace: null, defaultCurrency: USD}, lastSynced: 2021-11-18 03:00:17.702Z, adAccounts: [AdAccount{id: 07968f6e-9536-481a-a78e-84bdfa0b7192, createdAt: 2018-09-08 11:23:33.000Z, updatedAt: 2021-11-18 03:00:17.459Z, version: 31, name: Insticore's Ad Account, provider: linkedin, providerId: 506319907, status: ACTIVE, disableReason: NONE, currency: EUR, businessId: 33273977, businessName: Insticore , businessCity: Vienna, businessStreet: Hofzeile 18-20, businessZip: 1190, businessCountryCode: AT, lastSynced: 2021-11-18 03:00:17.067Z, totalAmountSpent: null, businessProfilePicture: https://media-exp1.licdn.com/dms/image/C4E0BAQEGdvwt79PwkA/company-logo_200_200/0/1573658772269?e=1642636800&v=beta&t=VWVNSS_a8AEgpYUuo-MqXHKllPbfKUCg7_phcYYTink, providerMetadata: null, businessStreet2: null, timezoneId: null, timezoneName: null, timezoneOffsetHoursUtc: null, minDailyBudget: null}, AdAccount{id: dc33c9f2-c946-42f9-a4de-9d00de818917, createdAt: 2019-02-14 19:14:49.000Z, updatedAt: 2021-11-18 11:00:21.323Z, version: 8018, name: Andy Radulescu, provider: facebook, providerId: act_2337848699781284, status: ACTIVE, disableReason: NONE, currency: RON, businessId: act_2337848699781284, businessName: Andy Radulescu, businessCity: , businessStreet: , businessZip: null, businessCountryCode: null, lastSynced: 2021-11-18 11:00:15.392Z, totalAmountSpent: 0.00, businessProfilePicture: , providerMetadata: null, businessStreet2: , timezoneId: 12, timezoneName: Europe/Vienna, timezoneOffsetHoursUtc: 1, minDailyBudget: MinDailyBudget{minDailyBudgetImp: 442, minDailyBudgetLowFreq: 8836, minDailyBudgetHighFreq: 1105, minDailyBudgetVideoViews: 442}}]}], assignedWorkspaces: [Workspace{id: 89b25a4d-6349-4bab-b4e6-68e70460321b, createdAt: 2021-05-25 07:53:25.402Z, updatedAt: 2021-11-18 03:00:17.702Z, version: 198, name: workspace, description: workspace, disabled: false, settings: WorkspaceSettings{defaultWorkspace: null, defaultCurrency: USD}, lastSynced: 2021-11-18 03:00:17.702Z, adAccounts: [AdAccount{id: 07968f6e-9536-481a-a78e-84bdfa0b7192, createdAt: 2018-09-08 11:23:33.000Z, updatedAt: 2021-11-18 03:00:17.459Z, version: 31, name: Insticore's Ad Account, provider: linkedin, providerId: 506319907, status: ACTIVE, disableReason: NONE, currency: EUR, businessId: 33273977, businessName: Insticore , businessCity: Vienna, businessStreet: Hofzeile 18-20, businessZip: 1190, businessCountryCode: AT, lastSynced: 2021-11-18 03:00:17.067Z, totalAmountSpent: null, businessProfilePicture: https://media-exp1.licdn.com/dms/image/C4E0BAQEGdvwt79PwkA/company-logo_200_200/0/1573658772269?e=1642636800&v=beta&t=VWVNSS_a8AEgpYUuo-MqXHKllPbfKUCg7_phcYYTink, providerMetadata: null, businessStreet2: null, timezoneId: null, timezoneName: null, timezoneOffsetHoursUtc: null, minDailyBudget: null}, AdAccount{id: dc33c9f2-c946-42f9-a4de-9d00de818917, createdAt: 2019-02-14 19:14:49.000Z, updatedAt: 2021-11-18 11:00:21.323Z, version: 8018, name: Andy Radulescu, provider: facebook, providerId: act_2337848699781284, status: ACTIVE, disableReason: NONE, currency: RON, businessId: act_2337848699781284, businessName: Andy Radulescu, businessCity: , businessStreet: , businessZip: null, businessCountryCode: null, lastSynced: 2021-11-18 11:00:15.392Z, totalAmountSpent: 0.00, businessProfilePicture: , providerMetadata: null, businessStreet2: , timezoneId: 12, timezoneName: Europe/Vienna, timezoneOffsetHoursUtc: 1, minDailyBudget: MinDailyBudget{minDailyBudgetImp: 442, minDailyBudgetLowFreq: 8836, minDailyBudgetHighFreq: 1105, minDailyBudgetVideoViews: 442}}]}]}";

void main() {
  group('USER serialization', () {
    test('should serialize', () {
      User user = User.fromJson(jsonUser);

      expect(user, user);
    });

    test('user toString should equal expected', () {
      User user = User.fromJson(jsonUser);

      expect(user.toString(), expectedUserToString);
    });

    test('deserialize and serialize', () {
      User user = User.fromJson(jsonUser);

      expect(user.toJson()['username'], 'radulescu');
    });
  });
}
