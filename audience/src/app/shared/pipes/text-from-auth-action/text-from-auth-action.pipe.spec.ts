import { TextFromAuthAction } from '@audience-app/shared/pipes/text-from-auth-action/text-from-auth-action.pipe';

describe('TextFromAuthActionPipe', () => {
  describe('case signin', () => {
    it('should return Sign in', () => {
      expect(new TextFromAuthAction().transform('signin')).toEqual('Sign in');
    });
    it('should return Sign up', () => {
      expect(new TextFromAuthAction().transform('signin', true)).toEqual('Sign up');
    });

    it('should return a question', () => {
      expect(new TextFromAuthAction().transform('signin', false, true)).toEqual("Don't have an account?");
      expect(new TextFromAuthAction().transform('signin', true, true)).toEqual("Don't have an account?");
    });
  });
  describe('case signup', () => {
    it('should return Sign up', () => {
      expect(new TextFromAuthAction().transform('signup')).toEqual('Sign up');
    });
    it('should return Sign in', () => {
      expect(new TextFromAuthAction().transform('signup', true)).toEqual('Sign in');
    });
    it('should return a question', () => {
      expect(new TextFromAuthAction().transform('signup', false, true)).toEqual('Already have an account?');
      expect(new TextFromAuthAction().transform('signup', true, true)).toEqual('Already have an account?');
    });
  });

  it('should return Sign out', () => {
    expect(new TextFromAuthAction().transform('signout', false, false)).toEqual('Sign out');
  });

  it('should return the default', () => {
    try {
      new TextFromAuthAction().transform(null, false, false);
    } catch (err) {
      expect(err).toEqual(new Error('Auth action not supported'));
    }
  });
});
