import { User } from '@audience-app/global/models/app.models';
import { InitialsFromUser } from '@audience-app/shared/pipes/initials-from-user/initials-from-user.pipe';

describe('InitialsFromUser', () => {
  let pipe: InitialsFromUser;

  beforeEach(() => {
    pipe = new InitialsFromUser();
  });

  describe('transform', () => {
    it('should get initials on correct full name', () => {
      expect(pipe.transform({ firstName: 'Eduard', lastName: 'Serei' } as User)).toBe('ES');
    });
    it('should get initials on only one part of name', () => {
      expect(pipe.transform({ firstName: '', lastName: 'Serei' } as User)).toBe('S');
      expect(pipe.transform({ firstName: 'Eduard', lastName: '' } as User)).toBe('E');
    });
    it('should get initials upperCased', () => {
      expect(pipe.transform({ firstName: 'eduard', lastName: 'serei' } as User)).toBe('ES');
      expect(pipe.transform({ firstName: '', lastName: 'serei' } as User)).toBe('S');
      expect(pipe.transform({ firstName: 'eduard', lastName: '' } as User)).toBe('E');
    });
    it('should get initials upperCased', () => {
      expect(pipe.transform({ firstName: '', lastName: '' } as User)).toBe('');
    });
  });
});
