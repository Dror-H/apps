import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { AdAccountDTO, PageDTO, PageType, PostDTO } from '@instigo-app/data-transfer-object';
import { ClipboardService } from 'ngx-clipboard';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectFacebookPagePostService } from './select-facebook-page-post.service';

@Component({
  selector: 'ingo-select-facebook-page-post',
  templateUrl: './select-facebook-page-post.component.html',
  styleUrls: ['./select-facebook-page-post.component.scss'],
})
export class SelectFacebookPagePostComponent implements OnInit {
  @Input() adAccount: AdAccountDTO = null;
  @Input() campaignObjective: string;
  @Output() selectedPostEmitter = new EventEmitter<any>();
  public tableState: Observable<TableState>;
  public tableData: Observable<Array<any>>;
  public tableConfiguration: TableConfiguration;
  public promotePage = new FormControl(null);
  public promotePagesOfAdAccount: PageDTO[] = [];
  @ViewChild(DataTableTemplatesComponent, { static: true })
  private templates: DataTableTemplatesComponent;
  @ViewChild('postContent', { static: true })
  private postContent: TemplateRef<any>;
  @ViewChild('postId', { static: true })
  private postId: TemplateRef<any>;
  private selectedPostSubject = new BehaviorSubject<string>(null);

  constructor(
    private readonly selectFacebookPagePostService: SelectFacebookPagePostService,
    private clipboardService: ClipboardService,
  ) {}

  ngOnInit() {
    this.promotePagesOfAdAccount = this.adAccount.pages.filter((page) => page.type === PageType.FACEBOOK);
    if (this.campaignObjective != null) {
      this.selectFacebookPagePostService.isPageEngagementCampaignObjective =
        this.campaignObjective === 'POST_ENGAGEMENT';
    }
    this.selectFacebookPagePostService.adAccount$.next(this.adAccount);
    this.tableConfiguration = this.getTableConfiguration();
    this.tableState = this.selectFacebookPagePostService.postsTableState.state$;
    this.tableData = this.setSelectedPost();
    this.promotePage.valueChanges.subscribe((value: string) => this.selectFacebookPagePostService.pageId$.next(value));
  }

  public onTableStateChange(state: Partial<TableState>): void {
    this.selectFacebookPagePostService.postsTableState.patchState(state);
  }

  public selectPost(id: string, disabled: boolean): void {
    if (disabled) {
      return;
    }
    this.selectedPostSubject.next(id);
  }

  public copyPostId(value: string): void {
    this.clipboardService.copyFromContent(value);
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      scrollbarH: false,
      rowIdentity: (row) => row.id,
      tableId: `existing_posts_table`,
      selectable: false,
      searchable: true,
      columnsCustomizable: true,
      pageSizeCanBeChanged: true,
      clientSide: false,
      customActions: [],
      responsiveCol: {
        column: 1,
        maxWidth: 25,
      },
      columns: [
        {
          name: 'Title',
          prop: 'content',
          cellTemplate: this.postContent,
          unhideable: true,
          canAutoResize: true,
        },
        {
          name: 'Media',
          prop: 'data.fullPicture',
          cellTemplate: this.templates.facebookPreviewTemplate,
          unhideable: true,
          width: 50,
        },
        {
          name: 'ID',
          prop: 'providerId',
          width: 30,
          cellTemplate: this.postId,
        },
        {
          name: 'Created',
          prop: 'createdAt',
          sortable: true,
          cellTemplate: this.templates.dateCell,
          width: 100,
        },
      ],
    };
  }

  private setSelectedPost(): Observable<PostDTO[]> {
    return combineLatest([this.selectFacebookPagePostService.existingPosts$(), this.selectedPostSubject]).pipe(
      map(([posts, selectedId]) =>
        posts.map((post) => {
          post.checked = post.providerId === selectedId;
          if (post.checked) {
            post.adAccount = this.adAccount;
            this.selectedPostEmitter.emit(post);
          }
          return post;
        }),
      ),
    );
  }
}
