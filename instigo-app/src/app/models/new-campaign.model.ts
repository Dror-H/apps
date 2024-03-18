export interface AdCreativePreview {
  availableOn: { desktop: string; mobile: string };
  label: string;
  mustActivate?: { condition: string; items: number[] };
  type: string;
  value: string;
}
