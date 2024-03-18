import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { SubSink } from 'subsink';

export interface AdAccountsTableItem {
  index: number;
  provider: string;
  name: string;
  budget: number;
  spend: number;
  clicks: number;
  cpc: number;
  cpm: number;
  ctr: number;
  cvr: number;
  cpa: number;
  conversions: number;
}

@Component({
  selector: 'ingo-widget-ad-accounts-table',
  templateUrl: './ad-accounts-table.component.html',
  styleUrls: ['./ad-accounts-table.component.scss'],
})
export class AdAccountsTableComponent implements OnInit, OnDestroy {
  activeRange: string;
  ranges: any[];
  columns: any[];
  copyOfData: Array<any>;
  isSearchOpen = false;

  @Input() adAccounts: any[];

  @ViewChild('accountsTable', { static: false }) nzTableComponent?: NzTableComponent<AdAccountsTableItem>;
  adAccountsData: AdAccountsTableItem[] = [];
  private subscription = new SubSink();

  trackByIndex(_: number, data: AdAccountsTableItem): number {
    return data.index;
  }

  ngOnInit(): void {
    this.columns = [
      {
        name: '<i class="fas fa-share-alt"></i>',
        prop: 'provider',
        show: true,
        width: '40px',
        freezeLeft: true,
        unhideable: true,
      },
      {
        name: 'Account',
        prop: 'name',
        show: true,
        width: '15%',
        ellipsis: true,
        freezeLeft: true,
        unhideable: true,
      },
      {
        name: 'Budget',
        prop: 'budget',
        show: true,
      },
      {
        name: 'Spend',
        prop: 'spend',
        show: true,
      },
      {
        name: 'Clicks',
        prop: 'clicks',
        show: true,
      },
      {
        name: 'Avg. CPC',
        prop: 'cpc',
        show: true,
      },
      {
        name: 'Avg. CPM',
        prop: 'cpm',
        show: true,
      },
      {
        name: 'Avg. CTR',
        prop: 'ctr',
        show: true,
      },
      {
        name: 'Avg. CVR',
        prop: 'cvr',
        show: true,
      },
      {
        name: 'Avg. CPA',
        prop: 'cpa',
        show: true,
      },
      {
        name: 'Conversions',
        prop: 'conversions',
        show: true,
      },
    ];
    const data = [];
    for (let i = 0; i < this.adAccounts.length; i++)
      data.push({
        index: i + 1,
        provider: this.adAccounts[i].provider,
        name: this.adAccounts[i].name,
        budget: (i + 1) * 3.5,
        spend: (i + 1) * 3.5,
        clicks: (i + 1) * 3.5,
        cpc: (i + 1) * 3.5,
        cpm: (i + 1) * 3.5,
        ctr: (i + 1) * 3.5,
        cvr: (i + 1) * 3.5,
        cpa: (i + 1) * 3.5,
        conversions: (i + 1) * 3.5,
      });
    this.adAccountsData = data;
    this.copyOfData = [...this.adAccountsData];

    this.activeRange = 'week';
    this.ranges = [
      {
        label: 'week',
        text: 'Week',
      },
      {
        label: 'month',
        text: 'Month',
      },
      {
        label: 'year',
        text: 'Year',
      },
    ];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleRange(timeframe: string) {
    this.activeRange = timeframe;
  }

  changeColumnVis(toggle, index) {
    this.columns[index].show = toggle;
  }

  searchTable(search) {
    const targetValue: any[] = [];
    this.copyOfData.forEach((value: any) => {
      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search)) {
          targetValue.push(value);
          break;
        }
      }
    });
    this.adAccountsData = targetValue;
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }
}
