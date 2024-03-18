import { SupportedProviders, TargetingExcludeDto, TargetingIncludeDto } from '@instigo-app/data-transfer-object';

export class TargetingTemplateState {
  provider: SupportedProviders;
  include: TargetingIncludeDto;
  exclude?: TargetingExcludeDto;

  constructor(options?: { provider?: SupportedProviders }) {
    this.provider = options.provider ?? SupportedProviders.FACEBOOK;
    this.include = { and: [{ or: {} }] };
    this.exclude = { or: {} };
  }
}
