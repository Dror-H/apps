import { NgModule } from '@angular/core';
import { GetColorByMatchPipe } from '@audience-app/shared/pipes/get-color-by-match/get-color-by-match.pipe';
import { InitialsFromUser } from '@audience-app/shared/pipes/initials-from-user/initials-from-user.pipe';
import { TextFromAuthAction } from '@audience-app/shared/pipes/text-from-auth-action/text-from-auth-action.pipe';
import { ToBreadcrumbsPipe } from '@audience-app/shared/pipes/to-breadcrumbs/to-breadcrumbs.pipe';

const pipes = [InitialsFromUser, TextFromAuthAction, GetColorByMatchPipe, ToBreadcrumbsPipe];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
})
export class SharedPipesModule {}
