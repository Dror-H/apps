import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FakeTranslationLoader } from '@app/shared/shared/fake-translation-loader.helper';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import * as faker from 'faker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CreateWorkspaceCardComponent } from './create-workspace-card.component';

describe('ReplaceWithYourComponent: ', () => {
  let component: CreateWorkspaceCardComponent;
  let fixture: ComponentFixture<CreateWorkspaceCardComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NzCardModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzPopoverModule,
        NzToolTipModule,
        NgxsModule.forRoot([]),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslationLoader },
        }),
      ],
      declarations: [CreateWorkspaceCardComponent],
    }).compileComponents();
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue({ id: faker.datatype.uuid() });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkspaceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle form', () => {
    component.isDisabled = false;
    component.toggleForm();
    expect(component.isFormActive).toBeTruthy();
  });

  it('should toggle form', () => {
    component.isDisabled = true;
    component.toggleForm();
    expect(component.isFormActive).toBeFalsy();
  });

  it('should create workspace', () => {
    // Arrange
    component.createWorkspaceForm.patchValue({ workspace: 'test' });
    component.workspaceCreated.emit = jest.fn();
    component.isDisabled = false;
    // Act
    component.createWorkspace();
    // Assert
    expect(component.workspaceCreated.emit).toHaveBeenCalled();
  });

  it('should create workspace', () => {
    // Arrange
    component.workspaceCreated.emit = jest.fn();
    component.isDisabled = false;
    // Act
    component.createWorkspace();
    // Assert
    expect(component.workspaceCreated.emit).not.toHaveBeenCalled();
  });
});
