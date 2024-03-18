import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@audience-app/global/models/app.models';

@Pipe({ name: 'initialsFromUser' })
export class InitialsFromUser implements PipeTransform {
  transform(user: User): string {
    return ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase();
  }
}
