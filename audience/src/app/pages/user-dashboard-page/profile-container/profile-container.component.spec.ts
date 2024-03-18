import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserState } from '@audience-app/store/user.state';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';

import { ProfileContainerComponent } from './profile-container.component';
import { User } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-profile',
  template: `<div></div>`,
})
export class MockProfileComponent {
  @Input() public user: User;
  @Input() public disableEmail: boolean;
  @Output() public updateUser = new EventEmitter();
}

describe('ProfileContainerComponent', () => {
  let component: ProfileContainerComponent;
  let fixture: ComponentFixture<ProfileContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileContainerComponent, MockProfileComponent],
      imports: [StoreTestBedModule.configureTestingModule([UserState]), NgxsEmitPluginModule, NgxsSelectSnapshotModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
