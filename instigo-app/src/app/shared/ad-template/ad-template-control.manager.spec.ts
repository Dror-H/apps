import { isControlDisabled } from '@app/shared/ad-template/ad-template-control.manager';
import { AdTemplateSubtype } from '@instigo-app/data-transfer-object';

describe('ad-template.control.manager', () => {
  it('should disable controls for events', () => {
    const shouldBeDisabled = isControlDisabled('headline', AdTemplateSubtype.EVENT);
    expect(shouldBeDisabled).toBeTruthy();
  });

  it('should disable controls for leadgenFormId', () => {
    const shouldBeDisabled = isControlDisabled('linkDestination', AdTemplateSubtype.LEADGEN);
    expect(shouldBeDisabled).toBeTruthy();
  });

  it('should disable eventId controls for null', () => {
    const shouldBeDisabled = isControlDisabled('eventId', null);
    expect(shouldBeDisabled).toBeTruthy();
  });

  it('should disable leadgenFormId controls for null', () => {
    const shouldBeDisabled = isControlDisabled('leadgenFormId', null);
    expect(shouldBeDisabled).toBeTruthy();
  });

  it('should not disable disable headline controls for null', () => {
    const shouldBeDisabled = isControlDisabled('headline', null);
    expect(shouldBeDisabled).toBeFalsy();
  });
});
