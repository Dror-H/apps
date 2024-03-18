import { ToBreadcrumbsPipe } from './to-breadcrumbs.pipe';

describe('ToBreadcrumbsPipe', () => {
  let pipe: ToBreadcrumbsPipe;

  beforeEach(() => {
    pipe = new ToBreadcrumbsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it("should put a '>' after each value except last one and title case it", () => {
    const mockInput = ['first', 'second', 'third'];
    const expectedResult = 'First > Second > Third';
    expect((pipe as any).transform(mockInput)).toBe(expectedResult);
  });

  it('should return value as is if it is not array', () => {
    expect((pipe as any).transform('test 123')).toBe('test 123');
    expect((pipe as any).transform({ test: { value: 1 } })).toEqual({ test: { value: 1 } });
  });
});
