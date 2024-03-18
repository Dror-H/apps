import { AdCreativePreview } from '@app/models/new-campaign.model';

export class PreviewBase {
  public activePlacement: string;
  public previewType: { desktop: string | boolean; mobile: string | boolean };
  public isMobile = 'desktop';
  public formCombinations = [];

  public generatePreviewType(previewType: AdCreativePreview): void {
    this.activePlacement = previewType.label;
    this.previewType = previewType.availableOn;
    if (this.previewType.desktop == false) {
      this.isMobile = 'mobile';
    }
    if (this.previewType.mobile == false) {
      this.isMobile = 'desktop';
    }
  }

  public getPreviewDevice($event: number): void {
    if ($event === 0) {
      this.isMobile = 'desktop';
    } else {
      this.isMobile = 'mobile';
    }
  }
}
