import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CampaignGroupsApiService } from '@app/api/services/campaign-groups.api.service';
import { TranslateModule } from '@ngx-translate/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CampaignGroupsSelectorComponent } from './campaign-groups-selector.component';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ingo-explain',
  template: '',
})
export class IngoExplainMockComponent {
  @Input() tooltipId: string;
  @Input() tooltipType = 'default';
}

@Component({
  selector: 'parent-explain',
  template: '',
})
export class ParentMockComponent {
  @Input() tooltipId: string;
  @Input() tooltipType = 'default';
}

describe('Campaign groups selector', () => {
  let fixture: ComponentFixture<CampaignGroupsSelectorComponent>;
  let component: CampaignGroupsSelectorComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignGroupsSelectorComponent, IngoExplainMockComponent],
      imports: [TranslateModule.forRoot(), NzSelectModule, NzFormModule, ReactiveFormsModule, CommonModule],
      providers: [{ provide: CampaignGroupsApiService, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(CampaignGroupsSelectorComponent);
    component = fixture.componentInstance;
  });

  xit('should be defined', () => {
    expect(component).toBeDefined();
  });
});
