import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AudienceService } from '@app/pages/audience/audience.service';
import { AudienceList } from '@instigo-app/data-transfer-object';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { of } from 'rxjs';
import { NewAudienceRoutingModule } from '../new-audience-routing.module';
import { NewAudienceComponent } from './new-audience.component';

@Component({
  selector: 'app-audience-type-selector',
  template: '',
})
class AudienceTypeSelectorMockComponent {
  @Input() audienceForm: FormGroup;
  @Output() setStep = new EventEmitter<number>();
}

@Component({
  selector: 'app-audience-targeting',
  template: '',
})
class AudienceTargetingMockComponent {
  @Input() audienceForm: FormGroup;
  @Output() setStep = new EventEmitter<number>();
}

@Component({
  selector: 'app-audience-overview',
  template: '',
})
class AudienceOverviewMockComponent {
  @Input() audienceForm: FormGroup;
  @Output() setStep = new EventEmitter<number>();
  @Output() createAudience = new EventEmitter<void>();
}

@Component({
  selector: 'ingo-audience-summary',
  template: '',
})
class AudienceSummaryMockComponent {
  @Input() audienceForm: FormGroup;
  @Input() isOverviewActive = false;
  @Input() sticky = false;
}

describe('NewAudienceComponent', () => {
  let component: NewAudienceComponent;
  let fixture: ComponentFixture<NewAudienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NewAudienceComponent,
        AudienceTargetingMockComponent,
        AudienceTypeSelectorMockComponent,
        AudienceOverviewMockComponent,
        AudienceSummaryMockComponent,
      ],
      imports: [
        CommonModule,
        NewAudienceRoutingModule,
        ReactiveFormsModule,
        NzButtonModule,
        NzGridModule,
        NzStepsModule,
        NzPageHeaderModule,
        NzCollapseModule,
        NzAlertModule,
        NzCardModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: AudienceService,
          useValue: { callApiSavedAudience: () => of(null), callApiForLookalikeOrCustom: () => of(null) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewAudienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('addAudienceListOrRulesToPayload', () => {
    it('should put rules field on the payload if listOrRules argument is not audienceList', () => {
      const payload = [{}];
      const rules = {};

      (component as any).addAudienceListOrRulesToPayload(payload, rules);

      expect(payload).toEqual([{ rules: {} }]);
    });

    it('should put audienceListData field on the payload if listOrRules argument is not audienceList', () => {
      const payload = [{}];
      const audienceListData: AudienceList = {
        file: { name: '' },
        content: [['']],
        fields: [],
      };

      (component as any).addAudienceListOrRulesToPayload(payload, audienceListData);

      expect(payload).toEqual([{ audienceListData }]);
    });
  });
});
