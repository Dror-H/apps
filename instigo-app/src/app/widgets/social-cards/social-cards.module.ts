import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SocialCardsComponent } from './social-cards.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';

@NgModule({
  declarations: [SocialCardsComponent],
  imports: [CommonModule, NzGridModule, NzCardModule],
  exports: [SocialCardsComponent],
  providers: [],
})
export class SocialCardsModule {}
