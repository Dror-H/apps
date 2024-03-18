import { Pipe, PipeTransform } from '@angular/core';
import { AuthAction } from '@audience-app/auth/auth.models';

@Pipe({ name: 'textFromAuthAction' })
export class TextFromAuthAction implements PipeTransform {
  transform(authAction: AuthAction, opposite?: boolean, isQuestion?: boolean): string {
    return this.getActionTextFromAction(authAction, opposite, isQuestion);
  }

  private getActionTextFromAction(authAction: AuthAction, opposite?: boolean, isQuestion?: boolean): string {
    switch (authAction) {
      case 'signin':
        if (isQuestion) {
          return "Don't have an account?";
        }
        return opposite ? 'Sign up' : 'Sign in';
      case 'signup':
        if (isQuestion) {
          return 'Already have an account?';
        }
        return opposite ? 'Sign in' : 'Sign up';
      case 'signout':
        return 'Sign out';
      default:
        throw new Error('Auth action not supported');
    }
  }
}
