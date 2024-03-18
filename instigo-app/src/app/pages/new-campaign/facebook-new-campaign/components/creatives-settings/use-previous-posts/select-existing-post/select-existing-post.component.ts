import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { existingPostsTypeOptions } from '@app/pages/new-campaign/facebook-new-campaign/facebook-new-campaign.data';
import { AdAccountDTO, PostDTO } from '@instigo-app/data-transfer-object';
import { ControlValueAccessorBaseHelper } from '@app/shared/shared/control-value-accessor-base-helper';

@Component({
  selector: 'ingo-select-existing-post',
  templateUrl: './select-existing-post.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectExistingPostComponent,
      multi: true,
    },
  ],
})
export class SelectExistingPostComponent extends ControlValueAccessorBaseHelper {
  @Input() existingPost = new FormGroup({});
  @Input() isSelectionOpen: boolean = false;
  @Input() adAccount: AdAccountDTO;
  @Input() campaignObjective: string;
  @Output() selectedPostEmitter = new EventEmitter<any>();

  @ViewChild('selectActions')
  selectActions: ElementRef;

  public existingPostsTypeOptions = existingPostsTypeOptions;
  public selectedPost: PostDTO = null;

  public confirmSelection() {
    this.selectedPostEmitter.emit(this.selectedPost);
  }

  public cancelSelection(): void {
    this.selectedPostEmitter.emit(null);
  }

  public onEmittedSelectedPost(selectedPost: PostDTO): void {
    this.selectedPost = selectedPost;
    this.selectActions.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }
}
