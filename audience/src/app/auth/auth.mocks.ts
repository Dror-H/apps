import { User } from '@audience-app/global/models/app.models';

export const currentUserMock: User = {
  name: 'Eduard Serei',
  profilePicture: 'assets/images/avatars/hottest.jpg',
  email: 'eduard@instigo.io',
  emailVerified: true,
  phone: '123456789',
  id: 'adsfkjasdifads0fad-sf-sadfads',
  adAccounts: [],
  isAdmin: false,
  createdAt: '',
  lastLogin: '',
  firstName: 'Eduard',
  lastName: 'Serei',
  stripeSubscriptionId: '1',
  billing: {
    firstName: 'Ed',
    lastName: 'Se',
    address: 'Home',
    zipCode: '123',
    country: {
      code: 'US',
      name: 'America',
    },
    vatNumber: '123',
    type: 'private',
    companyName: "Ed's",
  },
};
