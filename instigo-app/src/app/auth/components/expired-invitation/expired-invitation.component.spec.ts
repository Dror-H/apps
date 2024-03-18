import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FakeTranslationLoader } from '@app/shared/shared/fake-translation-loader.helper';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ExpiredInvitationComponent } from './expired-invitation.component';

describe('ExpiredInvitationComponent: ', () => {
  let component: ExpiredInvitationComponent;
  let fixture: ComponentFixture<ExpiredInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslationLoader },
        }),
      ],
      declarations: [ExpiredInvitationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
