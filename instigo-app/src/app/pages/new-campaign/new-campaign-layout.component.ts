import { Component, OnDestroy } from '@angular/core';
import { NewCampaignLayoutService } from '@app/pages/new-campaign/new-campaign-layout.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ingo-new-campaign-layout',
  templateUrl: './new-campaign-layout.component.html',
  providers: [NewCampaignLayoutService],
})
export class NewCampaignLayoutComponent implements OnDestroy {
  public enableLinkedinCampaign: boolean;

  constructor(public layoutService: NewCampaignLayoutService, private readonly router: Router) {
    this.enableLinkedinCampaign = environment.features.linkedinCampaign;
  }

  public retry(): void {
    this.layoutService.loadingOnCampaignCreate$.next(false);
  }

  public startOver(): void {
    this.layoutService.deleteAll();
    this.layoutService.hasRestarted.next(true);
    void this.router.navigate(['/new-campaign']);
  }

  ngOnDestroy(): void {
    this.layoutService.deleteAll();
  }
}
